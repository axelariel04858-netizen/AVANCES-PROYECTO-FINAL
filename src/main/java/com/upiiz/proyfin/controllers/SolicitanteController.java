package com.upiiz.proyfin.controllers;

import com.upiiz.proyfin.dto.CorreoMasivoRequest;
import com.upiiz.proyfin.dto.CorreoMasivoResponse;
import com.upiiz.proyfin.dto.CorreoRequest;
import com.upiiz.proyfin.entities.SolicitanteEntity;
import com.upiiz.proyfin.services.MailServiceImpl;
import com.upiiz.proyfin.services.SolicitanteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
public class SolicitanteController {

    @GetMapping("/solicitante")
    public String solicitante() {return "solicitante";}

    @Autowired
    private SolicitanteService solicitanteService;

    @Autowired
    private MailServiceImpl mailService;

    //USANDO AJAX
    //C - CREATE - CREAR MASCOTA USANDO AJAX
    @PostMapping("/solicitantes/api")
    @ResponseBody
    public ResponseEntity<SolicitanteEntity> crearSolicitanteAJAX(@Valid @RequestBody SolicitanteEntity solicitante){
        return ResponseEntity.ok(solicitanteService.agregarSolicitante(solicitante));
    }


    //R - READ - LISTADO PRODUCTOS USANDO AJAX
    @GetMapping("/solicitantes/api")
    @ResponseBody
    public ResponseEntity<List<SolicitanteEntity>> listadoSolicitanteJAX(){return ResponseEntity.ok(solicitanteService.listado());}


    // R - LEER UNA SOLA MASCOTA USANDO AJAX
    @GetMapping("/solicitantes/api/{id}")
    @ResponseBody
    public ResponseEntity<SolicitanteEntity> solicitanteByIdAJAX(@PathVariable Long id) {
        return ResponseEntity.ok(solicitanteService.solicitanteById(id).orElse(null));
    }

    // ENVIAR CORREO PERSONAL A UN SOLO ASPIRANTE
    @PostMapping("/solicitantes/api/{id}/correo")
    @ResponseBody
    public ResponseEntity<?> enviarCorreoPersonal(@PathVariable Long id, @RequestBody CorreoRequest correo) {
        if (correo.getAsunto() == null || correo.getAsunto().isBlank()
                || correo.getMensaje() == null || correo.getMensaje().isBlank()) {
            return ResponseEntity.badRequest().body("El asunto y el mensaje son obligatorios");
        }

        Optional<SolicitanteEntity> solicitante = solicitanteService.solicitanteById(id);

        if (solicitante.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String mensajePersonalizado = correo.getMensaje().replace("{{nombre}}", solicitante.get().getNombre());
        mailService.enviarCorreo(solicitante.get().getEmail(), correo.getAsunto(), mensajePersonalizado);

        return ResponseEntity.ok().build();
    }

    // ENVIAR CORREO MASIVO A LOS ASPIRANTES INDICADOS (O A TODOS SI NO SE ENVÍAN IDS)
    @PostMapping("/solicitantes/api/correo-masivo")
    @ResponseBody
    public ResponseEntity<?> enviarCorreoMasivo(@RequestBody CorreoMasivoRequest correo) {
        if (correo.getAsunto() == null || correo.getAsunto().isBlank()
                || correo.getMensaje() == null || correo.getMensaje().isBlank()) {
            return ResponseEntity.badRequest().body("El asunto y el mensaje son obligatorios");
        }

        List<SolicitanteEntity> destinatarios;

        if (correo.getIds() == null || correo.getIds().isEmpty()) {
            destinatarios = solicitanteService.listado();
        } else {
            destinatarios = correo.getIds().stream()
                    .map(id -> solicitanteService.solicitanteById(id))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .toList();
        }

        int enviados = 0;
        int fallidos = 0;

        for (SolicitanteEntity solicitante : destinatarios) {
            try {
                String mensajePersonalizado = correo.getMensaje().replace("{{nombre}}", solicitante.getNombre());
                mailService.enviarCorreo(solicitante.getEmail(), correo.getAsunto(), mensajePersonalizado);
                enviados++;
            } catch (Exception e) {
                fallidos++;
            }
        }

        return ResponseEntity.ok(new CorreoMasivoResponse(destinatarios.size(), enviados, fallidos));
    }

}
