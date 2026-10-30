package com.placamate.repository;

import com.placamate.model.Recruiter;
import com.placamate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByUser(User user);
    Optional<Recruiter> findByUserId(Long userId);
}
