package com.example.demo.service_BL;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity_DL.AppE;
import com.example.demo.repository_DL.AppRepository;

@Service
public class AppService {

    /*
    Dependentzia-injekzioa: Spring-ek AppRepository sortzen du eta
    automatikoki pasatzen dio konstruktoreari. Hau da modu gomendatua
    @Autowired eremuan erabiltzearen aldean.
    */
    private final AppRepository appRepository;

    public AppService(AppRepository appRepository) {
        this.appRepository = appRepository;
    }

    /**
     * Site jakin bateko app guztiak itzultzen ditu.
     *
     * @param siteId - Sitearen id-a (adib. "Site_A", "Site_D")
     * @return AppE zerrenda. Hutsik dagoen kasuan.
     */
    public List<AppE> getAppsBySite(String siteId) {
        return appRepository.findBySiteId(siteId);
    }
}