package com.jobportal.service;

import com.jobportal.dto.JobDto;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class JobService {
    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public void createJob(JobDto dto, User employer) {
        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());
        job.setExperienceRequired(dto.getExperienceRequired());
        job.setCategory(dto.getCategory());
        job.setSkillsRequired(dto.getSkillsRequired());
        
        if (dto.getJobType() != null && !dto.getJobType().isEmpty()) {
            job.setJobType(Job.JobType.valueOf(dto.getJobType()));
        }
        
        if (dto.getDeadline() != null && !dto.getDeadline().isEmpty()) {
            job.setDeadline(LocalDate.parse(dto.getDeadline(), DateTimeFormatter.ISO_LOCAL_DATE));
        }

        job.setEmployer(employer);
        jobRepository.save(job);
    }

    public List<Job> findAllOpenJobs() {
        return jobRepository.findByStatusOrderByPostedAtDesc(Job.JobStatus.OPEN);
    }

    public List<Job> findJobsByEmployer(User employer) {
        return jobRepository.findByEmployerOrderByPostedAtDesc(employer);
    }

    public Job findById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }
    
    public void deleteJob(Long id, User employer) {
        Job job = findById(id);
        if (job.getEmployer().getId().equals(employer.getId())) {
            jobRepository.delete(job);
        }
    }
    
    public void closeJob(Long id, User employer) {
        Job job = findById(id);
        if (job.getEmployer().getId().equals(employer.getId())) {
            job.setStatus(Job.JobStatus.CLOSED);
            jobRepository.save(job);
        }
    }
    
    public Job save(Job job) {
        return jobRepository.save(job);
    }
}
