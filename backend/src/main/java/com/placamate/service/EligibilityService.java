package com.placamate.service;

import com.placamate.dto.EligibilityResult;
import com.placamate.model.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EligibilityService {

    /**
     * Checks if a student is eligible for a specific job opportunity.
     * Returns an EligibilityResult with a boolean and a human-readable reason.
     */
    public EligibilityResult checkEligibility(Student student, Job job) {
        List<String> reasons = new ArrayList<>();

        // Check CGPA
        if (job.getMinimumCgpa() != null && student.getCgpa() != null) {
            if (student.getCgpa() < job.getMinimumCgpa()) {
                reasons.add("Minimum CGPA required is " + job.getMinimumCgpa() + " (yours: " + student.getCgpa() + ")");
            }
        }

        // Check department
        if (job.getEligibleDepartments() != null && !job.getEligibleDepartments().isBlank()) {
            String[] eligibleDepts = job.getEligibleDepartments().split(",");
            boolean deptMatch = false;
            for (String dept : eligibleDepts) {
                if (dept.trim().equalsIgnoreCase(student.getDepartment())) {
                    deptMatch = true;
                    break;
                }
            }
            if (!deptMatch && student.getDepartment() != null) {
                reasons.add("This opportunity is restricted to " + job.getEligibleDepartments() + " students");
            }
        }

        // Check graduation year
        if (job.getGraduationYear() != null && student.getGraduationYear() != null) {
            if (!job.getGraduationYear().equals(student.getGraduationYear())) {
                reasons.add("This opportunity is for " + job.getGraduationYear() + " graduates (yours: " + student.getGraduationYear() + ")");
            }
        }

        // Check backlogs
        if (job.getMaximumBacklogs() != null && student.getBacklogs() != null) {
            if (student.getBacklogs() > job.getMaximumBacklogs()) {
                reasons.add("Maximum " + job.getMaximumBacklogs() + " backlogs allowed (yours: " + student.getBacklogs() + ")");
            }
        }

        // Check 10th percentage
        if (job.getMinimumTenthPercentage() != null && student.getTenthPercentage() != null) {
            if (student.getTenthPercentage() < job.getMinimumTenthPercentage()) {
                reasons.add("Minimum 10th percentage required is " + job.getMinimumTenthPercentage() + "% (yours: " + student.getTenthPercentage() + "%)");
            }
        }

        // Check 12th percentage
        if (job.getMinimumTwelfthPercentage() != null && student.getTwelfthPercentage() != null) {
            if (student.getTwelfthPercentage() < job.getMinimumTwelfthPercentage()) {
                reasons.add("Minimum 12th percentage required is " + job.getMinimumTwelfthPercentage() + "% (yours: " + student.getTwelfthPercentage() + "%)");
            }
        }

        if (reasons.isEmpty()) {
            return new EligibilityResult(true, "You are eligible for this opportunity");
        } else {
            return new EligibilityResult(false, "Not eligible: " + String.join("; ", reasons));
        }
    }
}
