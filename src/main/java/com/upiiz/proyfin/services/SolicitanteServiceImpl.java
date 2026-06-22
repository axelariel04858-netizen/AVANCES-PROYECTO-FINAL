package com.upiiz.proyfin.services;

import com.upiiz.proyfin.entities.CarreraEntity;
import com.upiiz.proyfin.entities.SolicitanteEntity;
import com.upiiz.proyfin.repositories.SolicitanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitanteServiceImpl implements SolicitanteService {

    @Autowired
    private SolicitanteRepository solicitanteRepository;

    @Override
    public List<SolicitanteEntity> listado(){return solicitanteRepository.findAll();}

    @Override
    public Optional<SolicitanteEntity> solicitanteById(Long id){return  solicitanteRepository.findById(id);}

    @Override
    public SolicitanteEntity agregarSolicitante(SolicitanteEntity solicitante){return solicitanteRepository.save(solicitante);}
}
