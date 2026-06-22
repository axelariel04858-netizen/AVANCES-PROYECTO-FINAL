package com.upiiz.proyfin.controllers;

import com.upiiz.proyfin.entities.CarreraEntity;
import com.upiiz.proyfin.services.CarreraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class CarreraController {

    @GetMapping("/carreras")
    public String carreras() {return "carreras";}

    @Autowired
    private CarreraService carreraService;

    //USANDO AJAX
    //C - CREATE - CREAR MASCOTA USANDO AJAX
    @PostMapping("/carreras/api")
    @ResponseBody
    public ResponseEntity<CarreraEntity> crearCarreraAJAX(@RequestBody CarreraEntity carrera){
        return ResponseEntity.ok(carreraService.agregarCarrera(carrera));
    }


    //R - READ - LISTADO PRODUCTOS USANDO AJAX
    @GetMapping("/carreras/api")
    @ResponseBody
    public ResponseEntity<List<CarreraEntity>> listadoCarrerasJAX(){return ResponseEntity.ok(carreraService.listado());}


    // R - LEER UNA SOLA MASCOTA USANDO AJAX
    @GetMapping("/carreras/api/{id}")
    @ResponseBody
    public ResponseEntity<CarreraEntity> carreraByIdAJAX(@PathVariable Long id) {
        return ResponseEntity.ok(carreraService.carreraPorID(id).orElse(null));
    }


    //U - UPDATE - ACTUALIZAR PRODUCTO USANDO AJAX
    @PatchMapping("/carreras/api/{id}")
    @ResponseBody
    public ResponseEntity<CarreraEntity> actualizarCarreraAJAX(@PathVariable Long id, @RequestBody CarreraEntity carrera){return ResponseEntity.ok(carreraService.actualizarCarrera(id, carrera));}


    //D - DELETE - ELIMINAR UN PRODUCTO USANDO AJAX
    @DeleteMapping("/carreras/api/{id}")
    @ResponseBody
    public void eliminarCarreraAJAX(@PathVariable Long id){carreraService.eliminarCarrera(id);}

}
