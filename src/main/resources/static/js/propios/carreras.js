const urlMas = "/carreras/api";

function listar() {
    $.ajax({
        method: "GET",
        url: urlMas,
        data: {},
        success: function (listaCarreras) {
            let tabla = $.fn.dataTable.isDataTable('#datatable-buttons')
                ? $('#datatable-buttons').DataTable()
                : $('#datatable-buttons').DataTable({ responsive: true, autoWidth: false });

            tabla.clear();

            listaCarreras.forEach(c => {
                let botones = '<button type="button" class="fa btn btn-dark fa-edit" data-toggle="modal" data-target="#modal-ac" onclick="identificaActualizar(' + c.id + ')"> EDITAR</button>';
                botones = botones + ' <button type="button" class="fa btn btn-dark fa-trash-o" data-toggle="modal" data-target="#modal-el" onclick="identificaEliminar(' + c.id + ')"> ELIMINAR</button>';

                tabla.row
                    .add([c.id, c.nombre, c.semestres, botones])
                    .draw(false)
                    .node().id = 'renglon_' + c.id;
            });
        },
        error: function(xhr) {
            console.error("Error al listar las carreras:", xhr);
        }
    });
}

function guardar() {
    let nombreCarrera = document.getElementById('nombrecarrera').value;
    let semestresCarrera = document.getElementById('semestrescarrera').value;
    let observacionesCarrera = document.getElementById('observacionescarrera').value;

    // BLOQUEAMOS LA PANTALLA PARA EVITAR DOBLE CLIC
    Swal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading(); }
    });

    $.ajax({
        method: 'POST',
        url: urlMas,
        contentType: "application/json",
        data: JSON.stringify({
            nombre: nombreCarrera,
            semestres: parseInt(semestresCarrera),
            observaciones: observacionesCarrera
        }),
        success: function (carrera) {
            let botones = '<button type="button" class="fa btn btn-dark fa-edit" data-toggle="modal" data-target="#modal-ac" onclick="identificaActualizar(' +  carrera.id + ')"> EDITAR</button>';
            botones = botones + ' <button type="button" class="fa btn btn-dark fa-trash-o" data-toggle="modal" data-target="#modal-el" onclick="identificaEliminar(' + carrera.id + ')"> ELIMINAR</button>';

            let tabla = $('#datatable-buttons').DataTable();

            tabla.row
                .add([carrera.id, carrera.nombre, carrera.semestres, botones])
                .draw(false)
                .node().id = 'renglon_' + carrera.id;

            $('#modal-ag').modal('hide');
            limpiarFormulario();

            // QUITA LA CARGA Y PONE EL ÉXITO
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'Carrera guardada correctamente',
                confirmButtonColor: '#34495E'
            });
        },
        error: function(xhr) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la carrera.', confirmButtonColor: '#34495E' });
            console.error(xhr);
        }
    });
}

function limpiarFormulario() {
    document.getElementById('nombrecarrera').value = "";
    document.getElementById('semestrescarrera').value = "";
    document.getElementById('observacionescarrera').value = "";
}

function identificaActualizar(id) {
    $.ajax({
        method: 'GET',
        url: urlMas + "/" + id,
        data: {},
        success: function(carrera) {
            document.getElementById('id-ac').value = carrera.id;
            document.getElementById('nombrecarrera-ac').value = carrera.nombre;
            document.getElementById('semestrescarrera-ac').value = carrera.semestres;
            document.getElementById('observacionescarrera-ac').value = carrera.observaciones;
        }
    });
}

function actualizar() {
    let idCarrera = document.getElementById('id-ac').value;
    let nombreCarrera = document.getElementById('nombrecarrera-ac').value;
    let semestresCarrera = document.getElementById('semestrescarrera-ac').value;
    let observacionesCarrera = document.getElementById('observacionescarrera-ac').value;

    // BLOQUEAMOS LA PANTALLA
    Swal.fire({
        title: 'Actualizando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading(); }
    });

    $.ajax({
        method: 'PATCH',
        contentType: 'application/json',
        url: urlMas + "/" + idCarrera,
        data: JSON.stringify({
            nombre: nombreCarrera,
            semestres: parseInt(semestresCarrera),
            observaciones: observacionesCarrera
        }),
        success: function(carrera) {
            let tabla = $('#datatable-buttons').DataTable();
            let datos = tabla.row("#renglon_" + idCarrera).data();

            datos[1] = nombreCarrera;
            datos[2] = semestresCarrera;

            tabla.row("#renglon_" + idCarrera).data(datos).draw(false);
            $('#modal-ac').modal('hide');

            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Carrera actualizada con éxito',
                confirmButtonColor: '#34495E'
            });
        }
    });
}

function identificaEliminar(id) {
    $.ajax({
        method: 'GET',
        url: urlMas + "/" + id,
        data: {},
        success: function(carrera) {
            document.getElementById('id-el').value = carrera.id;
            document.getElementById('nombrecarrera-el').value = carrera.nombre;
            document.getElementById('semestrescarrera-el').value = carrera.semestres;
            document.getElementById('observacionescarrera-el').value = carrera.observaciones;
        }
    });
}

function eliminar() {
    const idEliminar = document.getElementById('id-el').value;

    // BLOQUEAMOS LA PANTALLA
    Swal.fire({
        title: 'Eliminando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading(); }
    });

    $.ajax({
        method: 'DELETE',
        url: urlMas + "/" + idEliminar,
        data: {},
        success: function(carrera) {
            let tabla = $('#datatable-buttons').DataTable();
            tabla.row('#renglon_' + idEliminar).remove().draw(false);
            $('#modal-el').modal('hide');

            Swal.fire({
                icon: 'success',
                title: '¡Eliminada!',
                text: 'La carrera fue eliminada',
                confirmButtonColor: '#34495E'
            });
        }
    });
}

function cargarSelectsDeCarreras() {
    $.ajax({
        method: "GET",
        url: "/carreras/api",
        success: function (carrera) {
            let opcionesHTML = '<option value="">Seleccione una carrera...</option>';
            carrera.forEach(c => {
                opcionesHTML += `<option value="${c.id}">${c.nombre}</option>`;
            });
            $('#carrera, #carrera-ac, #carrera-el').html(opcionesHTML);
        },
        error: function(err) {
            console.error("Error cargando carreras dinámicas:", err);
        }
    });
}

$(document).ready(function() {
    cargarSelectsDeCarreras();
});