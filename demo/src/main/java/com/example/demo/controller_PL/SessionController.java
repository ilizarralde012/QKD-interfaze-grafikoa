package com.example.demo.controller_PL;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.SessionDetailDTO;
import com.example.demo.dto.SessionSummaryDTO;
import com.example.demo.service_BL.SessionService;

@RestController
@RequestMapping("/api")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // GET /api/sessions - Sesio guztiak lortu
    @GetMapping("/sessions")
    public ResponseEntity<List<SessionSummaryDTO>> getAllSessions() {
        List<SessionSummaryDTO> sessions = sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }

    // GET /api/sessions/{sessionId} - Sesio baten xehetasunak lortu
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<SessionDetailDTO> getSessionDetail(@PathVariable String sessionId) {
        SessionDetailDTO detail = sessionService.getSessionDetail(sessionId);
        return ResponseEntity.ok(detail);
    }
}