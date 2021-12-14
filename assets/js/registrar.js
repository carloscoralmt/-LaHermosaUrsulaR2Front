const urlApi = 'http://localhost:8080/api/user';

$(document).ready(function () {
    bienvenidaUsuario();
});

function bienvenidaUsuario() {
    const usuarios = JSON.parse(sessionStorage.getItem('usuario'));
    console.log(usuarios);
    $('#usuarioBienvenido').html('<h3> Bienvenido ' + usuarios.name +'- Email:' + usuarios.email+'</h3>');

    listarTabla();
}

let mensaje = '';

$("#formularioRegistro").on("click", function (event) {
    event.preventDefault();
});

// validar datos del formulario
function validarFormulario() {
    if (validarDatos()) {
        registrarUsuario(); // registrar usuario
    } else {
        $('#alerta').html('<p id="mensaje">' + mensaje + '</p>'); //Mostrar alerta
    }
}

// Validar formulario
function validarDatos() {

    let idUsuario = $('#id').val();
    let identificacion = $('#identification').val();
    let nombreUsuario = $('#name').val();
    let direccion = $('#direction').val();
    let telefono = $('#cellPhone').val();
    let correo = $('#email').val();
    let clave = $('#password').val();
    let confirmarClave = $('#password2').val();
    let zona = $('#zone').val();
    let tipoUsuario = $('#type').val();

    // validar campos vacios   
    if (idUsuario == '') {
        mensaje = 'Id Usuario es requerido ';
        return false;
    }
    if (tipoUsuario == '') {
        mensaje = 'Tipo Usuario es requerido ';
        return false;
    }
    if (zona == '') {
        mensaje = 'Zona es requerido ';
        return false;
    }
    if (identificacion == '') {
        mensaje = 'Identificación es requerido ';
        return false;
    }
    if (nombreUsuario == '') {
        mensaje = 'Nombre es requerido ';
        return false;
    }
    if (direccion == '') {
        mensaje = 'Dirección es requerido ';
        return false;
    }
    if (correo == '') {
        mensaje = 'Correo es requerido';
        return false;
    }
    if (telefono == '') {
        mensaje = 'Teléfono es requerido';
        return false;
    }
    if (clave == '') {
        mensaje = 'Contraseña es requerida';
        return false;
    }
    if (confirmarClave == '') {
        mensaje = 'Confirmar contraseña';
        return false;
    }

    // Expresiones
    let correoV = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    let claveV = /^.{4,25}$/;
    // validar expresiones
    if (!correoV.test(correo)) {
        mensaje = 'Correo incorrecto';
        return false;
    }
    if (!claveV.test(clave)) {
        mensaje = 'Contraseña entre 4 y 25 caracteres';
        return false;
    }
    // confirmación de contraseña
    if (clave != confirmarClave) {
        mensaje = 'La contraseña no coincide';
        return false;
    }

    return true;
}

// Agregar nuevo usuario
function registrarUsuario() {
    console.log('Registro');
    var dataForm = {
        id : $("#id").val(),
        identification : $("#identification").val(),
        name : $("#name").val(),
        address : $("#address").val(),
        cellPhone : $("#cellPhone").val(),
        email : $("#email").val(),
        password : $("#password").val(),
        zone : $("#zone").val(),
        type : $("#type").val()
    };
    
    var dataJson = JSON.stringify(dataForm);
    
    $.ajax({
        url: urlApi + '/new',
        type: 'POST',
        data: dataJson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            alert('Usuario registrado');
            limpiarFormulario();
            $('#modelId').modal('hide');
            listarTabla();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('El correo se encuentra registrado');
        }
    });

}


function listarTabla() {
    $.ajax({
        url: urlApi + '/all',
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            var valor = '';
            for (i = 0; i < response.length; i++) {
                valor += '<tr>' +
                    '<td>' + response[i].id + '</td>' +
                    '<td>' + response[i].identification + '</td>' +
                    '<td>' + response[i].name + '</td>' +
                    '<td>' + response[i].address + '</td>' +
                    '<td>' + response[i].cellPhone + '</td>' +
                    '<td>' + response[i].email + '</td>' +
                    '<td>' + response[i].password + '</td>' +
                    '<td>' + response[i].zone + '</td>' +
                    '<td>' + response[i].type + '</td>' +
                    '<td><button data-bs-toggle="modal" data-bs-target="#modelId" onclick="consultar(' + response[i].id + ')" class="btn btn-warning">Editar</button>' +
                    '<button onclick="borrar(' + response[i].id + ')" class="btn btn-danger">Eliminar</button></td>' +
                    '</tr>';
            }
            $('#tbody').html(valor);
        }
    });
}

function borrar(id) {
    var bool = confirm("Seguro de eliminar el registro?");
    if (bool) {
        $.ajax({
            url: urlApi + '/' + id,
            type: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                alert("se elimino correctamente");
                listarTabla();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error');
            }
        });        
    } 
}

function consultar(id) {
    $.ajax({
        url: urlApi + '/' + id,
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            $('#id').val(response.id);
            $('#name').val(response.name);
            $('#identification').val(response.identification);
            $('#cellPhone').val(response.cellPhone);
            $('#address').val(response.address);
            $('#email').val(response.email);
            $('#password').val(response.password);
            $('#password2').val(response.password);
            $('#zone').val(response.zone);
            $('#type').val(response.type);

            let valor = '<input class="btn form-control btn btn-warning" data-bs-dismiss="modal"  id="botonActualizar" type="submit" value="Actualizar" onclick="actualizar(' + id + ')">';
            $('#botonFormulario').html(valor);
            $("#botonRegistrar").remove();
        }
    });
}

function actualizar(idUsuario) {
    var dataForm = {
        id: idUsuario,
        identification: $("#identification").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cellPhone").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        zone: $("#zone").val(),
        type: $("#type").val()
    };

    var dataJson = JSON.stringify(dataForm);

    $.ajax({
        url: urlApi + '/update',
        type: 'PUT',
        data: dataJson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            alert('Usuario: ' + response.name + ' actualizazdo');
            limpiarFormulario();
            listarTabla();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al actualizar');
        }
    });
    let valor = '<input class="btn form-control btn btn-success"  id="botonRegistrar" type="submit" value="Registrar" onclick="validarFormulario()">';
    $('#botonFormulario').html(valor);
    $("#botonActualizar").remove();
}

function limpiarFormulario() {
    $('#formularioRegistro')[0].reset();
}




