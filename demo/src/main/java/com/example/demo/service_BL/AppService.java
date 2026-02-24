package com.example.demo.service_BL;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity_DL.AppE;
import com.example.demo.repository_DL.AppRepository;

@Service
public class AppService {

    private final AppRepository appRepository;
    private final SessionService sessionService;

    public AppService(AppRepository appRepository, SessionService sessionService) {
        this.appRepository = appRepository;
        this.sessionService = sessionService;
    }

    // Site bateko app-ak lortu
    public List<AppE> getAppsBySite(String siteId) {
        return appRepository.findBySiteId(siteId);
    }

    // App guztiak lortu
    public List<AppE> getAllApps() {
        return appRepository.findAll();
    }

    // App baten request kopurua
    public Long getRequestCountForApp(String appId) {
        return sessionService.countRequestsByApp(appId);
    }
}