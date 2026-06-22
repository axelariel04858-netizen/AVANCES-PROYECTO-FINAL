package com.upiiz.proyfin.dto;

public class CorreoMasivoResponse {

    private int total;
    private int enviados;
    private int fallidos;

    public CorreoMasivoResponse() {}

    public CorreoMasivoResponse(int total, int enviados, int fallidos) {
        this.total = total;
        this.enviados = enviados;
        this.fallidos = fallidos;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getEnviados() {
        return enviados;
    }

    public void setEnviados(int enviados) {
        this.enviados = enviados;
    }

    public int getFallidos() {
        return fallidos;
    }

    public void setFallidos(int fallidos) {
        this.fallidos = fallidos;
    }
}
