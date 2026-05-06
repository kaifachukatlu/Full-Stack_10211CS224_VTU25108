package com.jobportal.controller;

import com.jobportal.dto.JobDto;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.JobService;
import com.jobportal.service.UserService;
import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/employer")
public class EmployerDashboardController {

    private final JobService jobService;
    private final UserService userService;
    private final ApplicationService applicationService;

    public EmployerDashboardController(JobService jobService, UserService userService, ApplicationService applicationService) {
        this.jobService = jobService;
        this.userService = userService;
        this.applicationService = applicationService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, Authentication authentication) {
        User employer = userService.findByEmail(authentication.getName()).orElseThrow();
        List<Job> jobs = jobService.findJobsByEmployer(employer);
        
        long totalJobs = jobs.size();
        long totalApplicants = jobs.stream().mapToLong(Job::getApplicationCount).sum();
        
        // Aggregate statistics for Chart
        long pending = 0, shortlisted = 0, rejected = 0;
        for (Job job : jobs) {
            List<Application> apps = applicationService.getApplicationsForJob(job);
            pending += apps.stream().filter(a -> a.getStatus() == Application.ApplicationStatus.PENDING).count();
            shortlisted += apps.stream().filter(a -> a.getStatus() == Application.ApplicationStatus.SHORTLISTED).count();
            rejected += apps.stream().filter(a -> a.getStatus() == Application.ApplicationStatus.REJECTED).count();
        }
        
        model.addAttribute("jobs", jobs);
        model.addAttribute("totalJobs", totalJobs);
        model.addAttribute("totalApplicants", totalApplicants);
        model.addAttribute("pendingCount", pending);
        model.addAttribute("shortlistedCount", shortlisted);
        model.addAttribute("rejectedCount", rejected);
        model.addAttribute("user", employer);
        
        return "employer/dashboard";
    }

    @GetMapping("/jobs")
    public String manageJobs(Model model, Authentication authentication) {
        User employer = userService.findByEmail(authentication.getName()).orElseThrow();
        model.addAttribute("jobs", jobService.findJobsByEmployer(employer));
        return "employer/jobs";
    }

    @GetMapping("/post-job")
    public String postJobForm(Model model) {
        model.addAttribute("jobDto", new JobDto());
        return "employer/post-job";
    }

    @PostMapping("/post-job")
    public String postJob(@Valid @ModelAttribute("jobDto") JobDto dto, BindingResult result, Authentication authentication) {
        if (result.hasErrors()) {
            return "employer/post-job";
        }
        User employer = userService.findByEmail(authentication.getName()).orElseThrow();
        jobService.createJob(dto, employer);
        return "redirect:/employer/jobs?success";
    }

    @GetMapping("/applicants/{jobId}")
    public String viewApplicants(@PathVariable Long jobId, Model model, Authentication authentication) {
        User employer = userService.findByEmail(authentication.getName()).orElseThrow();
        Job job = jobService.findById(jobId);
        
        if (!job.getEmployer().getId().equals(employer.getId())) {
            return "redirect:/employer/dashboard"; // unauthorized
        }
        
        List<Application> applications = applicationService.getApplicationsForJob(job);
        model.addAttribute("job", job);
        model.addAttribute("applications", applications);
        return "employer/applicants";
    }

    @GetMapping("/export-applicants/{jobId}")
    public void exportApplicantsToCSV(@PathVariable Long jobId, HttpServletResponse response, Authentication authentication) throws IOException {
        User employer = userService.findByEmail(authentication.getName()).orElseThrow();
        Job job = jobService.findById(jobId);
        
        if (!job.getEmployer().getId().equals(employer.getId())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        List<Application> applications = applicationService.getApplicationsForJob(job);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"applicants_" + jobId + ".csv\"");

        try (CSVWriter writer = new CSVWriter(response.getWriter())) {
            String[] header = {"Cadet Name", "Email", "Status", "Applied On"};
            writer.writeNext(header);

            for (Application app : applications) {
                String[] data = {
                        app.getApplicant().getFullName(),
                        app.getApplicant().getEmail(),
                        app.getStatus().name(),
                        app.getAppliedAt().toString()
                };
                writer.writeNext(data);
            }
        }
    }
}
