package com.example.demo.repository_DL;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.SessionL2DetailsE;

@Repository
public interface SessionL2DetailsRepository extends JpaRepository<SessionL2DetailsE, Integer> {

    // Sesio baten L2 hop guztiak lortu (hop_order-ez ordenatuta)
    @Query("SELECT l2 FROM SessionL2DetailsE l2 WHERE l2.sessionId = :sessionId ORDER BY l2.hopOrder")
    List<SessionL2DetailsE> findBySessionIdOrderByHopOrder(String sessionId);
}