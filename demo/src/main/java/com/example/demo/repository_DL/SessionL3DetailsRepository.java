package com.example.demo.repository_DL;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.SessionL3DetailsE;

@Repository
public interface SessionL3DetailsRepository extends JpaRepository<SessionL3DetailsE, Integer> {

    // Sesio baten L3 xehetasunak lortu
    @Query("SELECT l3 FROM SessionL3DetailsE l3 WHERE l3.sessionId = :sessionId")
    Optional<SessionL3DetailsE> findBySessionId(String sessionId);
}
