package com.example.demo.entity_DL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_L1_DETAILS")
public class SessionL1DetailsE {
    @Id
    @Column(name = "SESSION_id")
    private String sessionId;

    private String kms_src_id;
    private String kms_dst_id;

    @OneToOne
    @MapsId // Indica que el ID de esta entidad se deriva de la entidad Session
    @JoinColumn(name = "SESSION_id")
    private SessionE session;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getKms_src_id() {
        return kms_src_id;
    }

    public void setKms_src_id(String kms_src_id) {
        this.kms_src_id = kms_src_id;
    }

    public String getKms_dst_id() {
        return kms_dst_id;
    }

    public void setKms_dst_id(String kms_dst_id) {
        this.kms_dst_id = kms_dst_id;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }

}
