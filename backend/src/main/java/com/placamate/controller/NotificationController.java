package com.placamate.controller;

import com.placamate.dto.NotificationDto;
import com.placamate.model.User;
import com.placamate.service.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        List<NotificationDto> notifications = notificationService.getNotifications(user);
        long unreadCount = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(Map.of("notifications", notifications, "unreadCount", unreadCount));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(notificationService.markAsRead(id, user));
    }
}
