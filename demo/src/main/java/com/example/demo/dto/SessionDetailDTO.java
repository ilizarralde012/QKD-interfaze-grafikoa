package com.example.demo.dto;

import java.util.List;

import com.example.demo.model.ArchitectureData;

public class SessionDetailDTO {
    private String sessionId;
    private Integer securityLevel;
    private String status;
    
    // L1 xehetasunak (baldin badaude)
    private String kmsSrcId;
    private String kmsDstId;
    
    // L2 xehetasunak (baldin badaude) - hop-en zerrenda
    private List<L2HopDTO> l2Hops;
    
    // L3 xehetasunak (baldin badaude)
    private String receiverId;
    private String passiveId;
    private String relayId;
    
    // L4 xehetasunak (baldin badaude)
    private String initiatorId;
    private String responderId;

    // Topologia informazioa
    private ArchitectureData topology;

    // Constructor hutsa
    public SessionDetailDTO() {}

    // Getters eta Setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public Integer getSecurityLevel() { return securityLevel; }
    public void setSecurityLevel(Integer securityLevel) { this.securityLevel = securityLevel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getKmsSrcId() { return kmsSrcId; }
    public void setKmsSrcId(String kmsSrcId) { this.kmsSrcId = kmsSrcId; }

    public String getKmsDstId() { return kmsDstId; }
    public void setKmsDstId(String kmsDstId) { this.kmsDstId = kmsDstId; }

    public List<L2HopDTO> getL2Hops() { return l2Hops; }
    public void setL2Hops(List<L2HopDTO> l2Hops) { this.l2Hops = l2Hops; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getPassiveId() { return passiveId; }
    public void setPassiveId(String passiveId) { this.passiveId = passiveId; }

    public String getRelayId() { return relayId; }
    public void setRelayId(String relayId) { this.relayId = relayId; }

    public String getInitiatorId() { return initiatorId; }
    public void setInitiatorId(String initiatorId) { this.initiatorId = initiatorId; }

    public String getResponderId() { return responderId; }
    public void setResponderId(String responderId) { this.responderId = responderId; }

    public ArchitectureData getTopology() { return topology; }
    public void setTopology(ArchitectureData topology) { this.topology = topology; }
    
    // Klase txiki bat L2 hop-entzat
    public static class L2HopDTO {
        private Integer hopOrder;
        private String kmsId;

        public L2HopDTO(Integer hopOrder, String kmsId) {
            this.hopOrder = hopOrder;
            this.kmsId = kmsId;
        }

        public Integer getHopOrder() { return hopOrder; }
        public void setHopOrder(Integer hopOrder) { this.hopOrder = hopOrder; }

        public String getKmsId() { return kmsId; }
        public void setKmsId(String kmsId) { this.kmsId = kmsId; }
    }
}
