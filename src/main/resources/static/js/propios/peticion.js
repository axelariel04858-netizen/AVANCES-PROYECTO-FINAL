<!DOCTYPE html>
<html lang="es">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Constancia | SiReSe IPN</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body {
        font-family: 'Montserrat', sans-serif;
        background-color: #6A1C32; /* Fondo Guinda IPN */
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
    }

        .container-card {
        display: flex;
        width: 100%;
        max-width: 1000px;
        background-color: #ffffff;
        border-radius: 12px;
        /* LA ESTELA BLANCA ESTILO NEÓN / RESPLANDOR */
        box-shadow: 0 0 30px 8px rgba(255, 255, 255, 0.4), 0 15px 35px rgba(0,0,0,0.6);
        overflow: hidden;
        position: relative;
    }

        .left-content {
        flex: 1;
        background: #4A1322; /* Guinda oscuro para contraste */
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
        text-align: center;
    }
        .left-content h1 {
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0 0 10px 0;
    }
        .left-content p {
        font-size: 1.1rem;
        font-weight: 400;
        margin: 0;
    }

        .form-box {
        flex: 1;
        padding: 40px;
        position: relative;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
        .form-box::before {
        content: "";
        background-image: url('/images/Escudo_ipn.png');
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.08;
        position: absolute;
        top: 0; left: 0; bottom: 0; right: 0;
        pointer-events: none;
        z-index: 0;
    }

        .form-wrapper {
        position: relative;
        z-index: 1;
    }
        .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 18px;
    }
        label {
        margin-bottom: 6px;
        font-weight: 600;
        color: #333;
        font-size: 0.9rem;
    }
        input, select {
        padding: 12px;
        border: 1px solid #bbb;
        border-radius: 6px;
        background-color: #fafafa;
        font-family: inherit;
        font-size: 1rem;
        transition: all 0.3s;
    }
        input:focus, select:focus {
        border-color: #6A1C32;
        background-color: #ffffff;
        box-shadow: 0 0 5px rgba(106, 28, 50, 0.3);
        outline: none;
    }
        button {
        width: 100%;
        margin-top: 10px;
        padding: 14px;
        background: #6A1C32;
        border: none;
        border-radius: 6px;
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s;
    }
        button:hover {
        background: #4A1322;
    }
    </style>
</head>
<body>

<div class="container-card">
    <div class="left-content">
        <h1>INSTITUTO POLITÉCNICO NACIONAL</h1>
        <p>Enfrenta un nuevo reto. Tú nos inspiras.</p>
    </div>

    <div class="form-box">
        <div class="form-wrapper">
            <h2 style="text-align: center; color: #6A1C32; margin-bottom: 25px;">Registro de Aspirante</h2>

            <form onsubmit="event.preventDefault(); enviar();">
                <div class="form-group">
                    <label for="nombre-pet">Nombre completo:</label>
                    <input type="text" id="nombre-pet" placeholder="Nombre completo" required>
                </div>
                <div class="form-group">
                    <label for="tel-pet">Teléfono (10 dígitos):</label>
                    <input type="text" id="tel-pet" placeholder="1234567890" maxlength="10" pattern="\d{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required>
                </div>
                <div class="form-group">
                    <label for="email-pet">Correo Electrónico:</label>
                    <input type="email" id="email-pet" placeholder="correo@ejemplo.com" required>
                </div>
                <div class="form-group">
                    <label for="carrera">Selecciona una carrera:</label>
                    <select id="carrera" required>
                        <option value="">Cargando carreras...</option>
                    </select>
                </div>
                <button type="submit">Solicitar Constancia</button>
            </form>
        </div>
    </div>
</div>

<script src="/plugins/jquery/dist/jquery.min.js"></script>
<script src="/js/propios/carreras.js"></script>
<script src="/js/propios/peticion.js"></script>

<script>
    let oldAjax = $.ajax;
    $.ajax = function(options) {
    if(options.url === "/solicitantes/api" && options.method === 'POST') {
    let oldSuccess = options.success;
    options.success = function(data) {
    oldSuccess(data);
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Solicitud enviada correctamente', confirmButtonColor: '#6A1C32' });
};
}
    return oldAjax(options);
};
</script>

</body>
</html>