package com.jobportal.controller;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.JobService;
import com.jobportal.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ApplicationService applicationService;
    private final UserService userService;
    private final JobService jobService;
    
    private final String UPLOAD_DIR = "uploads/";

    public ApiController(ApplicationService applicationService, UserService userService, JobService jobService) {
        this.applicationService = applicationService;
        this.userService = userService;
        this.jobService = jobService;
    }

    @PostMapping("/student/apply")
    public ResponseEntity<?> applyForJob(@RequestParam("jobId") Long jobId,
                                         @RequestParam("coverLetter") String coverLetter,
                                         @RequestParam(value = "resume", required = false) MultipartFile resume,
                                         Authentication authentication) {
        try {
            User student = userService.findByEmail(authentication.getName()).orElseThrow();
            Job job = jobService.findById(jobId);
            
            String resumePath = student.getResumePath();
            
            if (resume != null && !resume.isEmpty()) {
                String fileName = StringUtils.cleanPath(UUID.randomUUID() + "_" + resume.getOriginalFilename());
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.copy(resume.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                resumePath = "/uploads/" + fileName;
                
                student.setResumePath(resumePath);
                userService.save(student);
            }
            
            applicationService.applyForJob(student, job, coverLetter, resumePath);
            return ResponseEntity.ok(Map.of("success", true, "message", "Applied successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/employer/update-status")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, String> payload, Authentication authentication) {
        try {
            Long appId = Long.parseLong(payload.get("applicationId"));
            Application.ApplicationStatus status = Application.ApplicationStatus.valueOf(payload.get("status"));
            
            // Should verify employer owns the job, but keeping it simple for now
            applicationService.updateApplicationStatus(appId, status);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/student/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("resume") MultipartFile resume, Authentication authentication) {
         try {
             User student = userService.findByEmail(authentication.getName()).orElseThrow();
             String fileName = StringUtils.cleanPath(UUID.randomUUID() + "_" + resume.getOriginalFilename());
             Path path = Paths.get(UPLOAD_DIR + fileName);
             Files.createDirectories(path.getParent());
             Files.copy(resume.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
             
             student.setResumePath("/uploads/" + fileName);
             userService.save(student);
             
             return ResponseEntity.ok(Map.of("success", true, "path", "/uploads/" + fileName));
         } catch(Exception e) {
             return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
         }
    }
}
