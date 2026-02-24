package com.example.demo.repository_DL;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.SessionE;

@Repository
public interface SessionRepository extends JpaRepository<SessionE, String> {

    // App batek hasitako sesio kopurua
    @Query("SELECT COUNT(s) FROM SessionE s WHERE s.initApp.id = :appId")
    Long countByInitAppId(String appId);
}