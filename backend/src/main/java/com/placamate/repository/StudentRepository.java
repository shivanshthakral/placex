package com.placamate.repository;

import com.placamate.model.Student;
import com.placamate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByUserId(Long userId);
    boolean existsByRegistrationNumber(String registrationNumber);
    List<Student> findByDepartment(String department);
    long countByDepartment(String department);
}
