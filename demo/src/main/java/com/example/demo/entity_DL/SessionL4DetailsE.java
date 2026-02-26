package com.example.demo.entity_DL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_L4_DETAILS")
public class SessionL4DetailsE {
    
    // Primary key berria: L4_id AUTO_INCREMENT
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "L4_id")
    private Integer l4Id;

    // SESSION_id foreign key
    @Column(name = "SESSION_id", length = 36, nullable = false)
    private String sessionId;

    @Column(name = "initiator_id", length = 10)
    private String initiatorId;

    @Column(name = "responder_id", length = 10)
    private String responderId;

    // OneToOne: sesio bakoitzak L4 bakarra
    @OneToOne
    @JoinColumn(name = "SESSION_id", insertable = false, updatable = false)
    private SessionE session;

    // Getters eta Setters
    public Integer getL4Id() {
        return l4Id;
    }

    public void setL4Id(Integer l4Id) {
        this.l4Id = l4Id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getInitiatorId() {
        return initiatorId;
    }

    public void setInitiatorId(String initiatorId) {
        this.initiatorId = initiatorId;
    }

    public String getResponderId() {
        return responderId;
    }

    public void setResponderId(String responderId) {
        this.responderId = responderId;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }
}