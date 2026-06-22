package com.upiiz.proyfin.repositories;

import com.upiiz.proyfin.entities.AuthAdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthAdminRepository extends JpaRepository<AuthAdminEntity,Long> {

    Optional<AuthAdminEntity> findByUsernameAndPassword(String username, String password);

}
