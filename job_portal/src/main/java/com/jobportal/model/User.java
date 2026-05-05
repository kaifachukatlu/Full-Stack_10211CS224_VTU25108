package com.jobportal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String skills;
    
    private String resumePath;
    private String profilePicture;
    
    @Column(columnDefinition = "TEXT")
    private String bio;

    private LocalDateTime createdAt = LocalDateTime.now();
    
    private boolean isActive = true;

    @Column(nullable = false)
    private String authProvider = "LOCAL"; // e.g., LOCAL, GOOGLE, LINKEDIN

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}
