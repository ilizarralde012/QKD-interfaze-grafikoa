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
@Table(name = "session_L1_DETAILS")
public class SessionL1DetailsE {
    
    // Primary key berria: L1_id AUTO_INCREMENT
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "L1_id")
    private Integer l1Id;

    // SESSION_id orain foreign key hutsa da (ez primary key)
    @Column(name = "SESSION_id", length = 36, nullable = false)
    private String sessionId;

    @Column(name = "kms_src_id", length = 10)
    private String kmsSrcId;

    @Column(name = "kms_dst_id", length = 10)
    private String kmsDstId;

    // OneToOne erlazioa mantentzen dugu
    @OneToOne
    @JoinColumn(name = "SESSION_id", insertable = false, updatable = false)
    private SessionE session;

    // Getters eta Setters
    public Integer getL1Id() {
        return l1Id;
    }

    public void setL1Id(Integer l1Id) {
        this.l1Id = l1Id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getKmsSrcId() {
        return kmsSrcId;
    }

    public void setKmsSrcId(String kmsSrcId) {
        this.kmsSrcId = kmsSrcId;
    }

    public String getKmsDstId() {
        return kmsDstId;
    }

    public void setKmsDstId(String kmsDstId) {
        this.kmsDstId = kmsDstId;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }
}