package com.example.demo.repository_DL;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.SessionE;

@Repository
public interface SessionRepository extends JpaRepository<SessionE, String> {

    // App batek hasitako sesio kopurua
    @Query("SELECT COUNT(s) FROM SessionE s WHERE s.initApp.id = :appId")
    Long countByInitAppId(String appId);

    //Sesio guztiak erlazioekin query bakarrean
    @Query("SELECT DISTINCT s FROM SessionE s " +
           "LEFT JOIN FETCH s.initApp " +
           "LEFT JOIN FETCH s.targetApp " +
           "LEFT JOIN FETCH s.securityLevel")
    List<SessionE> findAllWithRelations();
}