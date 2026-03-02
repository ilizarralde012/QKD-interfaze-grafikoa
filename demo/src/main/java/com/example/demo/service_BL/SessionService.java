package com.example.demo.service_BL;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.dto.SessionDetailDTO;
import com.example.demo.dto.SessionSummaryDTO;
import com.example.demo.entity_DL.SessionE;
import com.example.demo.entity_DL.SessionL2DetailsE;
import com.example.demo.repository_DL.SessionL1DetailsRepository;
import com.example.demo.repository_DL.SessionL2DetailsRepository;
import com.example.demo.repository_DL.SessionL3DetailsRepository;
import com.example.demo.repository_DL.SessionL4DetailsRepository;
import com.example.demo.repository_DL.SessionRepository;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SessionL1DetailsRepository l1Repository;
    private final SessionL2DetailsRepository l2Repository;
    private final SessionL3DetailsRepository l3Repository;
    private final SessionL4DetailsRepository l4Repository;

    public SessionService(SessionRepository sessionRepository,
                          SessionL1DetailsRepository l1Repository,
                          SessionL2DetailsRepository l2Repository,
                          SessionL3DetailsRepository l3Repository,
                          SessionL4DetailsRepository l4Repository) {
        this.sessionRepository = sessionRepository;
        this.l1Repository = l1Repository;
        this.l2Repository = l2Repository;
        this.l3Repository = l3Repository;
        this.l4Repository = l4Repository;
    }

    // App batek hasitako request kopurua
    public Long countRequestsByApp(String appId) {
        return sessionRepository.countByInitAppId(appId);
    }

    // Sesio guztien laburpena lortu (taularentzat)
    public List<SessionSummaryDTO> getAllSessions() {
        List<SessionE> sessions = sessionRepository.findAll();
        
        return sessions.stream().map(session -> {
            String sourceAppId = session.getInitApp() != null ? session.getInitApp().getId() : null;
            String destAppId = session.getTargetApp() != null ? session.getTargetApp().getId() : null;
            
            // endTime: bakarrik "Level configured for target" bada
            boolean showEndTime = "Level configured for target".equals(session.getStatus());
            
            return new SessionSummaryDTO(
                session.getId(),
                sourceAppId,
                destAppId,
                session.getSecurityLevel() != null ? session.getSecurityLevel().getId() : null,
                session.getStartTime(),
                session.getStatus(),
                showEndTime ? session.getEndTime() : null
            );
        }).collect(Collectors.toList());
    }

    // Sesio baten xehetasunak lortu (panelerantzat)
    public SessionDetailDTO getSessionDetail(String sessionId) {
        SessionE session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

        SessionDetailDTO detail = new SessionDetailDTO();
        detail.setSessionId(session.getId());
        detail.setStatus(session.getStatus());
        
        Integer secLevel = session.getSecurityLevel() != null ? session.getSecurityLevel().getId() : null;
        detail.setSecurityLevel(secLevel);

        // Xehetasunak kargatu status-en arabera
        String status = session.getStatus();
        if ("Level configured for init".equals(status) || 
            "SLA assigned for target".equals(status) || 
            "Level configured for target".equals(status)) {
            
            loadDetailsByLevel(detail, sessionId, secLevel);
        }

        return detail;
    }

    // Xehetasunak kargatu security level-aren arabera
    private void loadDetailsByLevel(SessionDetailDTO detail, String sessionId, Integer level) {
        if (level == null) return;

        switch (level) {
            case 1:
                l1Repository.findBySessionId(sessionId).ifPresent(l1 -> {
                    detail.setKmsSrcId(l1.getKmsSrcId());
                    detail.setKmsDstId(l1.getKmsDstId());
                });
                break;
            case 2:
                List<SessionL2DetailsE> l2List = l2Repository.findBySessionIdOrderByHopOrder(sessionId);
                List<SessionDetailDTO.L2HopDTO> hops = l2List.stream()
                    .map(l2 -> new SessionDetailDTO.L2HopDTO(l2.getHopOrder(), l2.getKmsId()))
                    .collect(Collectors.toList());
                detail.setL2Hops(hops);
                break;
            case 3:
                l3Repository.findBySessionId(sessionId).ifPresent(l3 -> {
                    detail.setReceiverId(l3.getReceiverId());
                    detail.setPassiveId(l3.getPassiveId());
                    detail.setRelayId(l3.getRelayId());
                });
                break;
            case 4:
                l4Repository.findBySessionId(sessionId).ifPresent(l4 -> {
                    detail.setInitiatorId(l4.getInitiatorId());
                    detail.setResponderId(l4.getResponderId());
                });
                break;
        }
    }
}