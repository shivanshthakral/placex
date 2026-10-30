package com.placamate.repository;

import com.placamate.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationId(Long applicationId);
    List<Interview> findByApplicationStudentId(Long studentId);
    Optional<Interview> findTopByApplicationIdOrderByScheduledAtDesc(Long applicationId);
}
