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
@Table(name = "session_L3_DETAILS")
public class SessionL3DetailsE {
    
    // Primary key berria: L3_id AUTO_INCREMENT
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "L3_id")
    private Integer l3Id;

    // SESSION_id foreign key
    @Column(name = "SESSION_id", length = 36, nullable = false)
    private String sessionId;

    @Column(name = "receiver_id", length = 10)
    private String receiverId;

    @Column(name = "passive_id", length = 10)
    private String passiveId;

    @Column(name = "relay_id", length = 10)
    private String relayId;

    // OneToOne: sesio bakoitzak L3 bakarra
    @OneToOne
    @JoinColumn(name = "SESSION_id", insertable = false, updatable = false)
    private SessionE session;

    // Getters eta Setters
    public Integer getL3Id() {
        return l3Id;
    }

    public void setL3Id(Integer l3Id) {
        this.l3Id = l3Id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getPassiveId() {
        return passiveId;
    }

    public void setPassiveId(String passiveId) {
        this.passiveId = passiveId;
    }

    public String getRelayId() {
        return relayId;
    }

    public void setRelayId(String relayId) {
        this.relayId = relayId;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }
}