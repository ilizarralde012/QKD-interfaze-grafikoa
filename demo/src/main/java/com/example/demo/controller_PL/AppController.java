package com.example.demo.controller_PL;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity_DL.AppE;
import com.example.demo.service_BL.AppService;

@RestController

/*
@RequestMapping kontroladore honen bide guztien aurrizkia definitzen du.
/api/ erabiltzen dugu datu-endpointak HTML orrialdeetatik bereizteko.
*/
@RequestMapping("/api")
public class AppController {

    private final AppService appService;

    public AppController(AppService appService) {
        this.appService = appService;
    }

    /**
     * Site jakin bateko app guztiak JSON formatuan itzultzen ditu.
     *
     * Nabigatzailetik edo JS-tik deitzeko adibidea:
     *   GET /api/apps/Site_A   → Site_A-ko appak
     *   GET /api/apps/Site_D   → Site_D-ko appak
     *
     * @param siteId - URLtik dator, adib. "Site_A"
     * @return 200 OK app zerrenda JSON formatuan
     *         00 OK zerrenda hutsarekin [] siteak appik ez badu
     */
    @GetMapping("/apps/{siteId}")
    public ResponseEntity<List<AppE>> getAppsBySite(@PathVariable String siteId) {
        List<AppE> apps = appService.getAppsBySite(siteId);
        return ResponseEntity.ok(apps);
    }
}