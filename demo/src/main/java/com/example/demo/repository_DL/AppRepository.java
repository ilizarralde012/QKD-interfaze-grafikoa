package com.example.demo.repository_DL;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.AppE;

@Repository
public interface AppRepository extends JpaRepository<AppE, String> {

    /*
    Spring Data JPA-k SQL kontsulta automatikoki sortzen du metodoaren
    izenetik abiatuta. "findBy" + "SiteId" APP taulako site_id
    zutabearen arabera bilatzen du.

    Honen baliokidea da: SELECT * FROM APP WHERE site_id = ?
    */
    List<AppE> findBySiteId(String siteId);
}