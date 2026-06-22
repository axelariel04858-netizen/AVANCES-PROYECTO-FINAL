package com.upiiz.proyfin.dto;

import java.util.List;

public class CorreoMasivoRequest {

    private String asunto;
    private String mensaje;

    // Si viene vacía o nula, el correo se envía a TODOS los solicitantes registrados.
    private List<Long> ids;

    public CorreoMasivoRequest() {}

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}
