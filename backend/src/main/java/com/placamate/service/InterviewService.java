package com.placamate.service;

import com.placamate.dto.*;
import com.placamate.exception.*;
import com.placamate.model.*;
import com.placamate.repository.*;
import org.springframework.stereotype.Service;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;
    private final RecruiterRepository recruiterRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    public InterviewService(InterviewRepository interviewRepository, JobApplicationRepository applicationRepository,
                            RecruiterRepository recruiterRepository, StudentRepository studentRepository,
                            NotificationService notificationService) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.recruiterRepository = recruiterRepository;
        this.studentRepository = studentRepository;
        this.notificationService = notificationService;
    }

    public InterviewDto scheduleInterview(User user, InterviewCreateRequest request) {
        JobApplication application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        // Verify recruiter owns this job's company
        if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = recruiterRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
            if (!application.getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
                throw new ForbiddenException("You can only schedule interviews for your company's applicants");
            }
        }

        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setScheduledAt(request.getScheduledAt());
        interview.setMode(request.getMode());
        interview.setLocationOrMeetingLink(request.getLocationOrMeetingLink());
        interview.setNotes(request.getNotes());

        interview = interviewRepository.save(interview);

        // Update application status
        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);

        // Notify student
        notificationService.createNotification(
                application.getStudent().getUser(),
                "Interview Scheduled",
                "An interview has been scheduled for your application to " +
                        application.getJob().getTitle() + " at " + application.getJob().getCompany().getName() +
                        " on " + request.getScheduledAt().toString()
        );

        return toDto(interview);
    }

    public java.util.List<InterviewDto> getStudentInterviews(User user) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return interviewRepository.findByApplicationStudentId(student.getId()).stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    private InterviewDto toDto(Interview interview) {
        InterviewDto dto = new InterviewDto();
        dto.setId(interview.getId());
        dto.setApplicationId(interview.getApplication().getId());
        dto.setScheduledAt(interview.getScheduledAt());
        dto.setMode(interview.getMode());
        dto.setLocationOrMeetingLink(interview.getLocationOrMeetingLink());
        dto.setNotes(interview.getNotes());
        return dto;
    }
}
