package com.example.demo.repository_DL;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.SessionL4DetailsE;

@Repository
public interface SessionL4DetailsRepository extends JpaRepository<SessionL4DetailsE, Integer> {

    // Sesio baten L4 xehetasunak lortu
    @Query("SELECT l4 FROM SessionL4DetailsE l4 WHERE l4.sessionId = :sessionId")
    Optional<SessionL4DetailsE> findBySessionId(String sessionId);
}
