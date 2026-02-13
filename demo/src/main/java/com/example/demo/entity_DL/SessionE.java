package com.example.demo.entity_DL;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "SESSION")
public class SessionE {
    @Id
    @Column(length = 36)
    private String id;

    @Column(length = 45)
    private String status; // Ahora es VARCHAR(45) como acordamos

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    // Relación con la App que inicia
    @ManyToOne
    @JoinColumn(name = "init_app_id", nullable = false)
    private AppE initApp;

    // Relación con la App objetivo
    @ManyToOne
    @JoinColumn(name = "target_app_id", nullable = false)
    private AppE targetApp;

    // Relación con el nivel de seguridad
    @ManyToOne
    @JoinColumn(name = "security_level", nullable = false)
    private SecurityLevelE securityLevel;

    public SessionE() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public AppE getInitApp() {
        return initApp;
    }

    public void setInitApp(AppE initApp) {
        this.initApp = initApp;
    }

    public AppE getTargetApp() {
        return targetApp;
    }

    public void setTargetApp(AppE targetApp) {
        this.targetApp = targetApp;
    }

    public SecurityLevelE getSecurityLevel() {
        return securityLevel;
    }

    public void setSecurityLevel(SecurityLevelE securityLevel) {
        this.securityLevel = securityLevel;
    }
}
