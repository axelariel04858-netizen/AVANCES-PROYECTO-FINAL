package com.upiiz.proyfin.services;

import com.upiiz.proyfin.entities.CarreraEntity;

import java.util.List;
import java.util.Optional;

public interface CarreraService {

    List<CarreraEntity> listado();
    Optional<CarreraEntity> carreraPorID(Long id);
    CarreraEntity agregarCarrera(CarreraEntity carrera);
    CarreraEntity actualizarCarrera(Long id, CarreraEntity carrera);
    void eliminarCarrera(Long id);

}
