package com.example.demo.dto;

import java.time.LocalDateTime;

public class SessionSummaryDTO {
    private String sessionId;
    private String sourceAppId;
    private String destAppId;
    private Integer securityLevel;
    private LocalDateTime startTime;
    private String status;
    private LocalDateTime endTime;

    // Constructor
    public SessionSummaryDTO(String sessionId, String sourceAppId, String destAppId, 
                             Integer securityLevel, LocalDateTime startTime, 
                             String status, LocalDateTime endTime) {
        this.sessionId = sessionId;
        this.sourceAppId = sourceAppId;
        this.destAppId = destAppId;
        this.securityLevel = securityLevel;
        this.startTime = startTime;
        this.status = status;
        this.endTime = endTime;
    }

    // Getters eta Setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getSourceAppId() { return sourceAppId; }
    public void setSourceAppId(String sourceAppId) { this.sourceAppId = sourceAppId; }

    public String getDestAppId() { return destAppId; }
    public void setDestAppId(String destAppId) { this.destAppId = destAppId; }

    public Integer getSecurityLevel() { return securityLevel; }
    public void setSecurityLevel(Integer securityLevel) { this.securityLevel = securityLevel; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}