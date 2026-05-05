package com.jobportal.config;

import com.jobportal.dto.UserRegistrationDto;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public DatabaseSeeder(UserService userService, UserRepository userRepository, JobRepository jobRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Employer
            UserRegistrationDto employerDto = new UserRegistrationDto();
            employerDto.setFullName("FastJobs Tech Inc");
            employerDto.setEmail("employer@fastjobs.com");
            employerDto.setPassword("password");
            employerDto.setRole("ROLE_EMPLOYER");
            userService.registerUser(employerDto);

            // Seed Student
            UserRegistrationDto studentDto = new UserRegistrationDto();
            studentDto.setFullName("Alex Candidate");
            studentDto.setEmail("student@fastjobs.com");
            studentDto.setPassword("password");
            studentDto.setRole("ROLE_STUDENT");
            userService.registerUser(studentDto);

            User employer = userRepository.findByEmail("employer@fastjobs.com").orElseThrow();

            // Seed Jobs
            createJob("Senior Full Stack Engineer", "Looking for an expert to build high-performance web applications using Spring Boot and React.", "Tech Innovators", "Remote", "120,000 - 150,000", "5+ Years", "Software Engineering", employer);
            createJob("UX/UI Designer", "Design the next generation of sleek, fast, and user-centric interfaces.", "Creative Studio X", "New York, NY", "90,000 - 120,000", "3+ Years", "Design", employer);
            createJob("Data Analyst", "Turn massive datasets into actionable insights for our marketing team.", "DataCorp", "San Francisco, CA", "100,000 - 130,000", "2+ Years", "Data Science", employer);
            createJob("Product Manager", "Lead product development cycles from ideation to launch.", "Agile Solutions", "Remote", "130,000 - 160,000", "4+ Years", "Product", employer);
            createJob("DevOps Engineer", "Maintain and scale our cloud infrastructure for maximum uptime.", "CloudNet", "Austin, TX", "110,000 - 140,000", "3+ Years", "DevOps", employer);
        }
    }

    private void createJob(String title, String description, String company, String location, String salary, String exp, String category, User employer) {
        Job job = new Job();
        job.setTitle(title);
        job.setDescription(description);
        job.setCompany(company);
        job.setLocation(location);
        job.setSalary(salary);
        job.setExperienceRequired(exp);
        job.setCategory(category);
        job.setSkillsRequired("Java, Spring Boot, MySQL");
        job.setJobType(Job.JobType.FULL_TIME);
        job.setStatus(Job.JobStatus.OPEN);
        job.setPostedAt(LocalDateTime.now());
        job.setDeadline(LocalDate.now().plusMonths(1));
        job.setEmployer(employer);
        job.setApplicationCount(0);
        jobRepository.save(job);
    }
}
