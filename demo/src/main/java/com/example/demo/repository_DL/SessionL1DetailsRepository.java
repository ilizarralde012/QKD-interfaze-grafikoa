package com.example.demo.repository_DL;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.SessionL1DetailsE;

@Repository
public interface SessionL1DetailsRepository extends JpaRepository<SessionL1DetailsE, Integer> {

    // Sesio baten L1 xehetasunak lortu
    @Query("SELECT l1 FROM SessionL1DetailsE l1 WHERE l1.sessionId = :sessionId")
    Optional<SessionL1DetailsE> findBySessionId(String sessionId);
}