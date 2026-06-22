package com.upiiz.proyfin.services;

public interface MailService {

    void enviarCorreo(String destinatario, String asunto, String mensaje);

}
