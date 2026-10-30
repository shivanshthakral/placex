package com.placamate.service;

import com.placamate.dto.NotificationDto;
import com.placamate.model.*;
import com.placamate.repository.NotificationRepository;
import com.placamate.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification(user, title, message);
        notificationRepository.save(notification);
    }

    public List<NotificationDto> getNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    public NotificationDto markAsRead(Long id, User user) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return toDto(notification);
    }

    private NotificationDto toDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setRead(notification.isRead());
        return dto;
    }
}
