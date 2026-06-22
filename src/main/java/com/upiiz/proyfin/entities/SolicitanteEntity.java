package com.upiiz.proyfin.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity
public class SolicitanteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String nombre;
    public String tel;
    public String email;
    @NotNull(message = "La carrera no puede ser nula")
    public Integer carrera;

    public SolicitanteEntity() {}

    public SolicitanteEntity(Long id, String nombre, String tel, String email, Integer carrera) {
        this.id = id;
        this.nombre = nombre;
        this.tel = tel;
        this.email = email;
        this.carrera = carrera;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getCarrera() {
        return carrera;
    }

    public void setCarrera(Integer carrera) {
        this.carrera = carrera;
    }
}
