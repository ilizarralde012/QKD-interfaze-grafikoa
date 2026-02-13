package com.example.demo.entity_DL;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "EVENTS")
public class EventsE {
    @Id
    @Column(name = "session_id")
    private String sessionId;

    private LocalDateTime init_SLA_time;
    private LocalDateTime init_config_time;
    private LocalDateTime target_SLA_time;
    private LocalDateTime target_config_time;
    private String error_msg;

    @OneToOne
    @MapsId
    @JoinColumn(name = "session_id")
    private SessionE session;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getInit_SLA_time() {
        return init_SLA_time;
    }

    public void setInit_SLA_time(LocalDateTime init_SLA_time) {
        this.init_SLA_time = init_SLA_time;
    }

    public LocalDateTime getInit_config_time() {
        return init_config_time;
    }

    public void setInit_config_time(LocalDateTime init_config_time) {
        this.init_config_time = init_config_time;
    }

    public LocalDateTime getTarget_SLA_time() {
        return target_SLA_time;
    }

    public void setTarget_SLA_time(LocalDateTime target_SLA_time) {
        this.target_SLA_time = target_SLA_time;
    }

    public LocalDateTime getTarget_config_time() {
        return target_config_time;
    }

    public void setTarget_config_time(LocalDateTime target_config_time) {
        this.target_config_time = target_config_time;
    }

    public String getError_msg() {
        return error_msg;
    }

    public void setError_msg(String error_msg) {
        this.error_msg = error_msg;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }

}
