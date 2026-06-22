package com.upiiz.proyfin.controllers;

import com.upiiz.proyfin.entities.AuthAdminEntity;
import com.upiiz.proyfin.repositories.AuthAdminRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Controller
public class AuthAdminController {

    @Autowired
    private AuthAdminRepository authAdminRepository;

    @GetMapping("/")
    public String index() {return "redirect:/login";}

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/peticion")
    public String peticion() {
        return "peticion";
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password, HttpServletRequest request) {
        Optional<AuthAdminEntity> admin = authAdminRepository.findByUsernameAndPassword(username, password);

        if(admin.isPresent()) {
            // MAGIA: Aquí se crea la variable de sesión
            request.getSession().setAttribute("adminLogueado", true);
            return ResponseEntity.ok().body("{\"success\": true}");
        }
        return ResponseEntity.status(401).body("{\"success\": false, \"message\": \"Usuario o contraseña incorrectos\"}");
    }

    // MAGIA: Este es el nuevo botón de salida que destruye la sesión
    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // Destruye todas las variables de sesión creadas
        }
        return "redirect:/login"; // Te regresa al login
    }
}