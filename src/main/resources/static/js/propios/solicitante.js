const urlSol = "/solicitantes/api";
const urlCarrerasSol = "/carreras/api";
let opcionesHTML = '<option value="">Seleccione una carrera...</option>';

// Mapa id -> nombre de carrera, usado para mostrar el nombre de la carrera
// en la tabla y en los modales de visualizar/correo/PDF del panel de admin.
let carrerasMap = {};

// Aspirante actualmente cargado en el modal de "Generar PDF".
let solicitanteParaPDF = null;

function listar() {
    $.ajax({
        method: "GET",
        url: urlCarrerasSol,
        data: {},
        success: function (listaCarreras) {
            carrerasMap = {};
            listaCarreras.forEach(c => { carrerasMap[c.id] = c.nombre; });
            cargarSolicitantes();
        },
        error: function(xhr) {
            console.error("Error al cargar las carreras:", xhr);
            // Aun si falla, intentamos mostrar la tabla de solicitantes.
            cargarSolicitantes();
        }
    });
}

function cargarSolicitantes() {
    $.ajax({
        method: "GET",
        url: urlSol,
        data: {},
        success: function (listaSolicitante) {

            let tabla = $.fn.dataTable.isDataTable('#datatable-buttons')
                ? $('#datatable-buttons').DataTable()
                : $('#datatable-buttons').DataTable({ responsive: true, autoWidth: false });

            tabla.clear();
            document.getElementById('check-todos').checked = false;

            listaSolicitante.forEach(s => {
                let nombreCarrera = carrerasMap[s.carrera] || 'N/D';

                let check = '<input type="checkbox" class="check-aspirante" value="' + s.id + '" onclick="actualizarContadorSeleccionados()">';

                let botones = '<button type="button" class="fa btn btn-dark fa-paper-plane" title="Enviar correo" data-toggle="modal" data-target="#modal-cor" onclick="identificaCorreo(' + s.id + ')"></button>';
                botones = botones + ' <button type="button" class="fa btn btn-dark fa-eye" title="Visualizar aspirante" data-toggle="modal" data-target="#modal-obs" onclick="identificaVisualizar(' + s.id + ')"></button>';
                botones = botones + ' <button type="button" class="fa btn btn-dark fa-file-pdf-o" title="Generar PDF" data-toggle="modal" data-target="#modal-const" onclick="identificaPDF(' + s.id + ')"></button>';

                tabla.row
                    .add([check, s.id, s.nombre, s.email, nombreCarrera, botones])
                    .draw(false)
                    .node().id = 'renglon_' + s.id;
            });
        },
        error: function(xhr) {
            console.error("Error al listar los solicitantes:", xhr);
        }
    });
}

/* ===================== SELECCIÓN DE ASPIRANTES (para correo masivo) ===================== */

function toggleSeleccionTodos(origen) {
    $('.check-aspirante').prop('checked', origen.checked);
    actualizarContadorSeleccionados();
}

function actualizarContadorSeleccionados() {
    let total = $('.check-aspirante').length;
    let seleccionados = $('.check-aspirante:checked').length;
    let contador = document.getElementById('contador-masivo');

    if (contador) {
        contador.textContent = seleccionados > 0
            ? 'Se enviará el correo a ' + seleccionados + ' aspirante(s) seleccionado(s).'
            : 'No hay aspirantes seleccionados: si envías, se mandará a los ' + total + ' aspirantes listados.';
    }
}

/* ===================== CORREO MASIVO ===================== */

function abrirCorreoMasivo() {
    document.getElementById('asunto-masivo').value = '';
    document.getElementById('mensaje-masivo').value = '';
    actualizarContadorSeleccionados();
}

function enviarCorreoMasivo() {
    let asunto = document.getElementById('asunto-masivo').value.trim();
    let mensaje = document.getElementById('mensaje-masivo').value.trim();

    if (!asunto || !mensaje) {
        alert("Debes capturar un asunto y un mensaje antes de enviar el correo masivo.");
        return;
    }

    let ids = $('.check-aspirante:checked').map(function () { return parseInt(this.value); }).get();

    if (ids.length === 0) {
        ids = $('.check-aspirante').map(function () { return parseInt(this.value); }).get();

        if (ids.length === 0) {
            alert("No hay aspirantes registrados para enviar el correo.");
            return;
        }
        if (!confirm("No seleccionaste ningún aspirante. ¿Deseas enviar el correo a los " + ids.length + " aspirantes listados?")) {
            return;
        }
    }

    $.ajax({
        method: 'POST',
        url: urlSol + "/correo-masivo",
        contentType: "application/json",
        data: JSON.stringify({ asunto: asunto, mensaje: mensaje, ids: ids }),
        success: function (resultado) {
            let texto = 'Correos enviados: ' + resultado.enviados + ' de ' + resultado.total + '.';
            if (resultado.fallidos > 0) {
                texto += ' Fallidos: ' + resultado.fallidos + '.';
            }
            alert(texto);
            $('#modal-mas').modal('hide');
        },
        error: function (xhr) {
            alert("No fue posible enviar los correos masivos. Verifica la configuración de correo o la consola.");
            console.error(xhr);
        }
    });
}

/* ===================== CORREO PERSONAL ===================== */

function identificaCorreo(id) {
    $.ajax({
        method: 'GET',
        url: urlSol + "/" + id,
        data: {},
        success: function (solicitante) {
            document.getElementById('id-correo').value = solicitante.id;
            document.getElementById('nombre-correo').value = solicitante.nombre;
            document.getElementById('email-correo').value = solicitante.email;
            document.getElementById('asunto-correo').value = '';
            document.getElementById('mensaje-correo').value = '';
        },
        error: function (xhr) {
            alert("No fue posible cargar los datos del aspirante.");
            console.error(xhr);
        }
    });
}

function enviarCorreoPersonal() {
    let id = document.getElementById('id-correo').value;
    let asunto = document.getElementById('asunto-correo').value.trim();
    let mensaje = document.getElementById('mensaje-correo').value.trim();

    if (!asunto || !mensaje) {
        alert("Debes capturar un asunto y un mensaje antes de enviar el correo.");
        return;
    }

    $.ajax({
        method: 'POST',
        url: urlSol + "/" + id + "/correo",
        contentType: "application/json",
        data: JSON.stringify({ asunto: asunto, mensaje: mensaje }),
        success: function () {
            alert("Correo enviado correctamente.");
            $('#modal-cor').modal('hide');
        },
        error: function (xhr) {
            alert("No fue posible enviar el correo. Verifica la configuración de correo o la consola.");
            console.error(xhr);
        }
    });
}

/* ===================== VISUALIZAR ASPIRANTE ===================== */

function identificaVisualizar(id) {
    $.ajax({
        method: 'GET',
        url: urlSol + "/" + id,
        data: {},
        success: function (solicitante) {
            document.getElementById('id-ver').value = solicitante.id;
            document.getElementById('nombre-ver').value = solicitante.nombre;
            document.getElementById('tel-ver').value = solicitante.tel;
            document.getElementById('email-ver').value = solicitante.email;
            document.getElementById('carrera-ver').value = carrerasMap[solicitante.carrera] || 'N/D';
        },
        error: function (xhr) {
            alert("No fue posible cargar los datos del aspirante.");
            console.error(xhr);
        }
    });
}

/* ===================== GENERAR PDF (constancia de solicitud) ===================== */

function identificaPDF(id) {
    $.ajax({
        method: 'GET',
        url: urlSol + "/" + id,
        data: {},
        success: function (solicitante) {
            solicitanteParaPDF = solicitante;
            document.getElementById('nombre-pdf').textContent = solicitante.nombre;
            document.getElementById('carrera-pdf').textContent = carrerasMap[solicitante.carrera] || 'N/D';
        },
        error: function (xhr) {
            alert("No fue posible cargar los datos del aspirante.");
            console.error(xhr);
        }
    });
}

function generarPDF() {
    if (!solicitanteParaPDF) {
        alert("Primero selecciona un aspirante.");
        return;
    }

    const nombreCarrera = carrerasMap[solicitanteParaPDF.carrera] || 'N/D';
    const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    const docDefinition = {
        content: [
            { text: 'INSTITUTO POLITÉCNICO NACIONAL', style: 'header' },
            { text: 'UPIIZ', style: 'subheader' },
            { text: 'CONSTANCIA DE SOLICITUD', style: 'subheader', margin: [0, 10, 0, 20] },
            {
                text: 'Se hace constar que ' + solicitanteParaPDF.nombre + ' ha realizado una solicitud de ' +
                    'información referente a la carrera de ' + nombreCarrera + '.',
                margin: [0, 0, 0, 15]
            },
            { text: 'Teléfono de contacto: ' + (solicitanteParaPDF.tel || 'N/D') },
            { text: 'Correo electrónico: ' + solicitanteParaPDF.email },
            { text: ' ', margin: [0, 20] },
            { text: 'Fecha de emisión: ' + fecha, alignment: 'right' }
        ],
        styles: {
            header: { fontSize: 16, bold: true, alignment: 'center' },
            subheader: { fontSize: 13, bold: true, alignment: 'center' }
        }
    };

    pdfMake.createPdf(docDefinition).download('constancia_' + solicitanteParaPDF.nombre.replace(/\s+/g, '_') + '.pdf');

    $('#modal-const').modal('hide');
}

/* ===================== FORMULARIO PÚBLICO DE SOLICITUD (peticion.html) ===================== */

function enviar() {
    let carreraVal = document.getElementById('carrera').value;

    if (!carreraVal || carreraVal === "0") {
        alert("Por favor, selecciona una carrera válida.");
        return; // Detiene el envío
    }
    if (carreraVal === "") {
        alert("¡Error! Debes seleccionar una carrera.");
        return; // Detiene la ejecución aquí
    }
    let nombreSolicitante = document.getElementById('nombre-pet').value;
    let telSolicitante = document.getElementById('tel-pet').value;
    let emailSolicitante = document.getElementById('email-pet').value;
    let carreraSolicitante = document.getElementById('carrera').value;

    $.ajax({
        method: 'POST',
        url: urlSol,
        contentType: "application/json",
        data: JSON.stringify({
            nombre: nombreSolicitante,
            tel: telSolicitante,
            email: emailSolicitante,
            carrera: parseInt(carreraSolicitante)
        }),
        success: function (solicitante) {
            let botones = '<button type="button" class="fa btn btn-dark fa-paper-plane" data-toggle="modal" data-target="#modal-cor" onclick="identificaActualizar(' + solicitante.id + ')"></button>';
            botones = botones + ' <button type="button" class="fa btn btn-dark fa-eye" data-toggle="modal" data-target="#modal-obs" onclick="identificaEliminar(' + solicitante.id + ')"></button>';
            botones = botones + ' <button type="button" class="fa btn btn-dark fa-file-pdf-o" data-toggle="modal" data-target="#modal-const" onclick="identificaEliminar(' + solicitante.id + ')"></button>';

            let tabla = $('#datatable-buttons').DataTable();

            let fila = tabla.row.add([
                solicitante.id,
                solicitante.nombre,
                solicitante.email,
                solicitante.carrera,
                botones
            ]).draw(false).node();

            // Asignar el ID al nodo creado
            if (fila) {
                $(fila).attr('id', 'renglon_' + solicitante.id);
            }
            limpiarFormulario();
            alert("SOLICITUD ENVIADA CORRECTAMENTE")
        },
        error: function(xhr) {
            alert("Error al guardar la solicitud. Verifica los datos o la consola.");
            console.error(xhr);
        }
    });
}

function limpiarFormulario() {
    document.getElementById('nombre-pet').value = "";
    document.getElementById('tel-pet').value = "";
    document.getElementById('email-pet').value = "";
    document.getElementById('carrera').value = "";
}
