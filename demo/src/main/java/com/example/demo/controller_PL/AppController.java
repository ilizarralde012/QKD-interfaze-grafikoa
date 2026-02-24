package com.example.demo.controller_PL;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity_DL.AppE;
import com.example.demo.service_BL.AppService;

@RestController
@RequestMapping("/api")
public class AppController {

    private final AppService appService;

    public AppController(AppService appService) {
        this.appService = appService;
    }

    // GET /api/apps/{siteId} - Site bateko app-ak
    @GetMapping("/apps/{siteId}")
    public ResponseEntity<List<AppE>> getAppsBySite(@PathVariable String siteId) {
        List<AppE> apps = appService.getAppsBySite(siteId);
        return ResponseEntity.ok(apps);
    }

    // GET /api/apps - App guztiak request kopuruarekin
    @GetMapping("/apps")
    public ResponseEntity<List<Map<String, Object>>> getAllApps() {
        List<AppE> apps = appService.getAllApps();
        
        List<Map<String, Object>> response = apps.stream().map(app -> {
            Map<String, Object> appData = new HashMap<>();
            appData.put("id", app.getId());
            appData.put("siteId", app.getSiteId());
            appData.put("vkmsId", app.getVkmsId());
            
            Long requestCount = appService.getRequestCountForApp(app.getId());
            appData.put("requestCount", requestCount);
            
            return appData;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
}