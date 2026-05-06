package com.jobportal.controller;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Collections;
import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Controller
public class MockSocialLoginController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    public MockSocialLoginController(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/mock-social-login/{provider}")
    public String mockLogin(@PathVariable String provider, HttpServletRequest request, HttpServletResponse response) {
        String email = "test." + provider.toLowerCase() + "@example.com";
        String name = provider.substring(0, 1).toUpperCase() + provider.substring(1).toLowerCase() + " User";

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setAuthProvider(provider.toUpperCase());
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            Role role = roleRepository.findByName("ROLE_STUDENT").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("ROLE_STUDENT");
                return roleRepository.save(newRole);
            });
            user.getRoles().add(role);
            user = userRepository.save(user);
        }

        // Programmatically log in the user
        org.springframework.security.core.userdetails.User userDetails = 
            new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
            );

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
                
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return "redirect:/student/dashboard";
    }
}
