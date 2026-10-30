package com.placamate.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class InterviewCreateRequest {
    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Schedule time is required")
    private LocalDateTime scheduledAt;

    private String mode;
    private String locationOrMeetingLink;
    private String notes;

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getLocationOrMeetingLink() { return locationOrMeetingLink; }
    public void setLocationOrMeetingLink(String locationOrMeetingLink) { this.locationOrMeetingLink = locationOrMeetingLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
