package com.jobportal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String company;

    private String location;
    private String salary;
    private String experienceRequired;
    private String category;
    
    @Column(columnDefinition = "TEXT")
    private String skillsRequired;

    @Enumerated(EnumType.STRING)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.OPEN;

    private LocalDateTime postedAt = LocalDateTime.now();
    private LocalDate deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    private Integer applicationCount = 0;

    public enum JobType {
        FULL_TIME, PART_TIME, INTERNSHIP
    }

    public enum JobStatus {
        OPEN, CLOSED
    }
}
