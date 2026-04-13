package com.example.demo.repository_DL;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity_DL.UserE;

@Repository
public interface UserRepository extends JpaRepository<UserE, Long> {
    Optional<UserE> findByUsername(String username);
}