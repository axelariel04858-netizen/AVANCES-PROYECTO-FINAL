package com.upiiz.proyfin.services;

import com.upiiz.proyfin.entities.AuthAdminEntity;
import com.upiiz.proyfin.repositories.AuthAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthAdminServiceImpl implements AuthAdminService {

    @Autowired
    private AuthAdminRepository authAdminRepository;

    @Override
    public Optional<AuthAdminEntity> adminbyId(Long id){
        return authAdminRepository.findById(id);
    }

}
