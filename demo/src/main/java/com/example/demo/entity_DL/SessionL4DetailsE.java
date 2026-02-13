package com.example.demo.entity_DL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_L4_DETAILS")
public class SessionL4DetailsE {
    @Id
    @Column(name = "SESSION_id")
    private String sessionId;

    private String initiator_id;
    private String responder_id;

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

    public String getInitiator_id() {
        return initiator_id;
    }

    public void setInitiator_id(String initiator_id) {
        this.initiator_id = initiator_id;
    }

    public String getResponder_id() {
        return responder_id;
    }

    public void setResponder_id(String responder_id) {
        this.responder_id = responder_id;
    }

    public SessionE getSession() {
        return session;
    }

    public void setSession(SessionE session) {
        this.session = session;
    }

}
