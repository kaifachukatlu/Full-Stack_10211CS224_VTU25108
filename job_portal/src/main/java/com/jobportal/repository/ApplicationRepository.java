package com.jobportal.repository;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicantOrderByAppliedAtDesc(User applicant);
    List<Application> findByJobOrderByAppliedAtDesc(Job job);
    boolean existsByApplicantAndJob(User applicant, Job job);
}
