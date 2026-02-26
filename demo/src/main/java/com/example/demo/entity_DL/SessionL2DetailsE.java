package com.example.demo.entity_DL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_L2_DETAILS")
public class SessionL2DetailsE {
    
    // Primary key berria: L2_id AUTO_INCREMENT
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "L2_id")
    private Integer l2Id;

    // SESSION_id foreign key
    @Column(name = "SESSION_id", length = 36, nullable = false)
    private String sessionId;

    @Column(name = "hop_count")
    private Integer hopCount;

    @Column(name = "hop_order")
    private Integer hopOrder;

    @Column(name = "kms_id", length = 10)
    private String kmsId;

    // ManyToOne: sesio batek L2 hop asko izan ditzake
    @ManyToOne
    @JoinColumn(name = "SESSION_id", insertable = false, updatable = false)
    private SessionE session;

    // Getters eta Setters
    public Integer getL2Id() {
        return l2Id;
    }

    public void setL2Id(Integer l2Id) {
        this.l2Id = l2Id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Integer getHopCount() {
        return hopCount;
    }

    public void setHopCount(Integer hopCount) {
        this.hopCount = hopCount;
    }

    public Integer getHopOrder() {
        return hopOrder;
    }

    public void setHopOrder(Integer hopOrder) {
        this.hopOrder = hopOrder;
    }

    public String getKmsId() {
        return kmsId;
    }

    public void setKmsId(String kmsId) {
        this.kmsId = kmsId;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }
}