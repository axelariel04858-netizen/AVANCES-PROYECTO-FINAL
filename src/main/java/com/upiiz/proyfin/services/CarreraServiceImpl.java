package com.upiiz.proyfin.services;

import com.upiiz.proyfin.entities.CarreraEntity;
import com.upiiz.proyfin.repositories.CarreraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarreraServiceImpl implements CarreraService{

    @Autowired
    private CarreraRepository carreraRepository;

    @Override
    public List<CarreraEntity> listado() {
        return carreraRepository.findAll();
    }

    @Override
    public Optional<CarreraEntity> carreraPorID(Long id) {
        return carreraRepository.findById(id);
    }

    @Override
    public CarreraEntity agregarCarrera(CarreraEntity carrera) {
        return carreraRepository.save(carrera);
    }

    @Override
    public CarreraEntity actualizarCarrera(Long Id, CarreraEntity carrera) {
        carrera.setId(Id);
        return carreraRepository.save(carrera);
    }

    @Override
    public void eliminarCarrera(Long id) {
        carreraRepository.deleteById(id);
    }

}
