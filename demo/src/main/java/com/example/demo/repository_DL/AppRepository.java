package com.example.demo.repository_DL;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.AppE;

@Repository
public interface AppRepository extends JpaRepository<AppE, String> {

    // Site bateko app-ak lortu
    @Query("SELECT a FROM AppE a WHERE a.siteId = :siteId")
    List<AppE> findBySiteId(String siteId);
}