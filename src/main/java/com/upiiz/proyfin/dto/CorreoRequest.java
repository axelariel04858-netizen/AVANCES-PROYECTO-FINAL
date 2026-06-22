package com.upiiz.proyfin.dto;

public class CorreoRequest {

    private String asunto;
    private String mensaje;

    public CorreoRequest() {}

    public CorreoRequest(String asunto, String mensaje) {
        this.asunto = asunto;
        this.mensaje = mensaje;
    }

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
}
