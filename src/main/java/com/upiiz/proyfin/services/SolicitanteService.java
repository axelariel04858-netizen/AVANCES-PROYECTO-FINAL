package com.upiiz.proyfin.services;

import com.upiiz.proyfin.entities.SolicitanteEntity;

import java.util.List;
import java.util.Optional;

public interface SolicitanteService {

    List<SolicitanteEntity> listado();
    Optional<SolicitanteEntity> solicitanteById(Long id);
    SolicitanteEntity agregarSolicitante(SolicitanteEntity Solicitante);

}
