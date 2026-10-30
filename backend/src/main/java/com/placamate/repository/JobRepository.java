package com.placamate.repository;

import com.placamate.model.Job;
import com.placamate.model.Company;
import com.placamate.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompany(Company company);
    List<Job> findByCompanyId(Long companyId);
    List<Job> findByStatus(JobStatus status);
    long countByStatus(JobStatus status);
    long countByCompanyId(Long companyId);
}
