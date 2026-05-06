package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Company is required")
    private String company;

    private String location;
    private String salary;
    private String experienceRequired;
    private String category;
    private String skillsRequired;
    private String jobType;
    private String deadline; // YYYY-MM-DD
}
