package com.example.demo.entity_DL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_L3_DETAILS")
public class SessionL3DetailsE {
    @Id
    @Column(name = "SESSION_id")
    private String sessionId;

    private String receiver_id;
    private String passive_id;
    private String relay_id;

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

    public String getReceiver_id() {
        return receiver_id;
    }

    public void setReceiver_id(String receiver_id) {
        this.receiver_id = receiver_id;
    }

    public String getPassive_id() {
        return passive_id;
    }

    public void setPassive_id(String passive_id) {
        this.passive_id = passive_id;
    }

    public String getRelay_id() {
        return relay_id;
    }

    public void setRelay_id(String relay_id) {
        this.relay_id = relay_id;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }

}
