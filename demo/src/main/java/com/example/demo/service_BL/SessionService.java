package com.example.demo.service_BL;

import org.springframework.stereotype.Service;

import com.example.demo.repository_DL.SessionRepository;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * App batek hasitako request kopurua kalkulatzen du.
     * 
     * @param appId - Aplikazioaren IDa
     * @return Request kopurua
     */
    public Long countRequestsByApp(String appId) {
        return sessionRepository.countByInitAppId(appId);
    }
}