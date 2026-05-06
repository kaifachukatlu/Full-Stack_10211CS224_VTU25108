package com.jobportal.service;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final EmailService emailService;

    public ApplicationService(ApplicationRepository applicationRepository, JobService jobService, EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.jobService = jobService;
        this.emailService = emailService;
    }

    public void applyForJob(User applicant, Job job, String coverLetter, String resumeSnapshot) {
        if (applicationRepository.existsByApplicantAndJob(applicant, job)) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application app = new Application();
        app.setApplicant(applicant);
        app.setJob(job);
        app.setCoverLetter(coverLetter);
        app.setResumeSnapshot(resumeSnapshot); // Storing the path at the time of application
        
        applicationRepository.save(app);
        
        // Increment application count
        job.setApplicationCount(job.getApplicationCount() + 1);
        jobService.save(job);
    }

    public List<Application> getApplicationsByApplicant(User applicant) {
        return applicationRepository.findByApplicantOrderByAppliedAtDesc(applicant);
    }

    public List<Application> getApplicationsForJob(Job job) {
        return applicationRepository.findByJobOrderByAppliedAtDesc(job);
    }
    
    public Application findById(Long id) {
        return applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public void updateApplicationStatus(Long id, Application.ApplicationStatus status) {
        Application app = findById(id);
        app.setStatus(status);
        applicationRepository.save(app);
        
        if (status == Application.ApplicationStatus.SHORTLISTED) {
            String subject = "Congratulations! You have been shortlisted for " + app.getJob().getTitle();
            String text = "Hello " + app.getApplicant().getFullName() + ",\n\n"
                    + "We are pleased to inform you that " + app.getJob().getCompany()
                    + " has shortlisted your application for the " + app.getJob().getTitle() + " position.\n\n"
                    + "Please check your inbox regularly for further instructions.\n\n"
                    + "Fast Jobs Portal Team";
            emailService.sendEmail(app.getApplicant().getEmail(), subject, text);
        }
    }
}
