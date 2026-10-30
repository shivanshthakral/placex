package com.placamate.repository;

import com.placamate.model.JobApplication;
import com.placamate.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByStudentId(Long studentId);
    List<JobApplication> findByJobId(Long jobId);
    List<JobApplication> findByJobCompanyId(Long companyId);
    List<JobApplication> findByStatus(ApplicationStatus status);
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    long countByStudentId(Long studentId);
    long countByStatus(ApplicationStatus status);
    long countByJobCompanyId(Long companyId);

    @Query("SELECT DISTINCT a.student.id FROM JobApplication a WHERE a.status = :status")
    List<Long> findDistinctStudentIdsByStatus(@Param("status") ApplicationStatus status);

    @Query("SELECT a FROM JobApplication a WHERE a.job.company.id = :companyId AND a.status = :status")
    List<JobApplication> findByJobCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") ApplicationStatus status);

    @Query("SELECT COUNT(DISTINCT a.student.id) FROM JobApplication a WHERE a.status = :status")
    long countDistinctStudentsByStatus(@Param("status") ApplicationStatus status);

    @Query("SELECT a.student.department, COUNT(DISTINCT a.student.id) FROM JobApplication a WHERE a.status = :status GROUP BY a.student.department")
    List<Object[]> countDistinctStudentsByStatusGroupByDepartment(@Param("status") ApplicationStatus status);

    @Query("SELECT a.job.company.name, COUNT(a) FROM JobApplication a WHERE a.status = :status GROUP BY a.job.company.name")
    List<Object[]> countByStatusGroupByCompany(@Param("status") ApplicationStatus status);

    @Query("SELECT a.status, COUNT(a) FROM JobApplication a GROUP BY a.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT FUNCTION('MONTH', a.applicationDate), COUNT(a) FROM JobApplication a GROUP BY FUNCTION('MONTH', a.applicationDate)")
    List<Object[]> countGroupByMonth();
}
