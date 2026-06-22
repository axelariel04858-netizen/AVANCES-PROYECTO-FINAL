package com.upiiz.proyfin.services;

import com.upiiz.proyfin.entities.AuthAdminEntity;

import java.util.Optional;

public interface AuthAdminService {

    Optional<AuthAdminEntity> adminbyId(Long id);

}
