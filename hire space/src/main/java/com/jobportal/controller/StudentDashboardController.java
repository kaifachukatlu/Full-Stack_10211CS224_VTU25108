package com.jobportal.controller;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.JobService;
import com.jobportal.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/student")
public class StudentDashboardController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final UserService userService;

    public StudentDashboardController(JobService jobService, ApplicationService applicationService, UserService userService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName()).orElseThrow();
        List<Application> applications = applicationService.getApplicationsByApplicant(user);
        
        long pending = applications.stream().filter(a -> a.getStatus() == Application.ApplicationStatus.PENDING).count();
        long shortlisted = applications.stream().filter(a -> a.getStatus() == Application.ApplicationStatus.SHORTLISTED).count();
        long rejected = applications.stream().filter(a -> a.getStatus() == Application.ApplicationStatus.REJECTED).count();
        
        model.addAttribute("applications", applications);
        model.addAttribute("totalApplied", applications.size());
        model.addAttribute("pending", pending);
        model.addAttribute("shortlisted", shortlisted);
        model.addAttribute("rejected", rejected);
        model.addAttribute("user", user);
        
        return "student/dashboard";
    }

    @GetMapping("/jobs")
    public String browseJobs(Model model) {
        List<Job> jobs = jobService.findAllOpenJobs();
        model.addAttribute("jobs", jobs);
        return "student/jobs";
    }

    @GetMapping("/profile")
    public String profile(Model model, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName()).orElseThrow();
        model.addAttribute("user", user);
        return "student/profile";
    }
}
