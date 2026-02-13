package com.example.demo.entity_DL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_L2_DETAILS")
public class SessionL2DetailsE {
    @Id
    @Column(name = "SESSION_id")
    private String sessionId;

    private Integer hop_count;
    private Integer hop_order;
    private String kms_id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "SESSION_id")
    private SessionE session;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Integer getHop_count() {
        return hop_count;
    }

    public void setHop_count(Integer hop_count) {
        this.hop_count = hop_count;
    }

    public Integer getHop_order() {
        return hop_order;
    }

    public void setHop_order(Integer hop_order) {
        this.hop_order = hop_order;
    }

    public String getKms_id() {
        return kms_id;
    }

    public void setKms_id(String kms_id) {
        this.kms_id = kms_id;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }

}
