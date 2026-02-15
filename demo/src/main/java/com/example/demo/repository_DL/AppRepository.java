package com.example.demo.repository_DL;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.AppE;

@Repository
public interface AppRepository extends JpaRepository<AppE, String> {

    /*
    Spring Data JPA genera la consulta SQL automáticamente a partir
    del nombre del método. "findBy" + "SiteId" busca por la columna
    site_id de la tabla APP.

    Equivale a: SELECT * FROM APP WHERE site_id = ?
    */
    List<AppE> findBySiteId(String siteId);
}