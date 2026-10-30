package com.placamate.dto;

import com.placamate.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {
    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
}
