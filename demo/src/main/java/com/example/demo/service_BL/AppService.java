package com.example.demo.service_BL;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity_DL.AppE;
import com.example.demo.repository_DL.AppRepository;

@Service
public class AppService {

    /*
    Inyección de dependencias: Spring crea el AppRepository y lo
    pasa automáticamente al constructor. Es la forma recomendada
    frente a @Autowired en el campo.
    */
    private final AppRepository appRepository;

    public AppService(AppRepository appRepository) {
        this.appRepository = appRepository;
    }

    /**
     * Devuelve todas las apps asociadas a un site.
     *
     * @param siteId - El id del site (ej. "Site_A", "Site_D")
     * @return Lista de AppE. Vacía si el site no tiene apps.
     */
    public List<AppE> getAppsBySite(String siteId) {
        return appRepository.findBySiteId(siteId);
    }
}