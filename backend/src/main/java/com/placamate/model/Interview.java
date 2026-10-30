package com.placamate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    private String mode; // ONLINE, OFFLINE

    private String locationOrMeetingLink;

    @Column(length = 500)
    private String notes;

    public Interview() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobApplication getApplication() { return application; }
    public void setApplication(JobApplication application) { this.application = application; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getLocationOrMeetingLink() { return locationOrMeetingLink; }
    public void setLocationOrMeetingLink(String locationOrMeetingLink) { this.locationOrMeetingLink = locationOrMeetingLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
