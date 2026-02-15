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
@RequestMapping define el prefijo de todas las rutas de este controller.
Usamos /api/ para separar los endpoints de datos de las páginas HTML.
*/
@RequestMapping("/api")
public class AppController {

    private final AppService appService;

    public AppController(AppService appService) {
        this.appService = appService;
    }

    /**
     * Devuelve en JSON todas las apps de un site concreto.
     *
     * Ejemplo de llamada desde el navegador o desde JS:
     *   GET /api/apps/Site_A   → apps del Site_A
     *   GET /api/apps/Site_D   → apps del Site_D
     *
     * @param siteId - Viene de la URL, ej. "Site_A"
     * @return 200 OK con la lista de apps en JSON
     *         200 OK con lista vacía [] si el site no tiene apps
     */
    @GetMapping("/apps/{siteId}")
    public ResponseEntity<List<AppE>> getAppsBySite(@PathVariable String siteId) {
        List<AppE> apps = appService.getAppsBySite(siteId);
        return ResponseEntity.ok(apps);
    }
}