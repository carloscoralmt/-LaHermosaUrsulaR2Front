const urlApi = 'http://localhost:8080/api/user';

let correo;
let clave;
let mensaje = '';

$("#formularioLogin").on("click", function (event) {
    event.preventDefault();
});

// Validar formulario de login
function verificar() {
    if (validarDatos()) {
        loginUsuario();// login usuario
    } else {  
        mostrarMensaje();//Mostrar mensaje de alerta        
    }
}


// Mostrar alertas en el formulario
function mostrarMensaje() {
    $('#alertaMensaje').removeClass("ocultar");
    $('#alertaMensaje').addClass("mostrar");

    $('#mensaje').html('<strong>' + mensaje + '</strong>');
}


// 
function validarDatos() {
    correo = $('#email').val();
    clave = $('#password').val();

    // validar empty data
    if (correo == '') {
        mensaje = 'Correo es requerido';
        return false;
    }
    if (clave == '') {
        mensaje = 'Contraseña es requerida';
        return false;
    }

    // validar expressions 
    let correoV = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!correoV.test(correo)) {
        mensaje = 'Correo incorrecto';
        return false;
    }
    return true;
}

// login de usuario
function loginUsuario() {

    $.ajax({
        url: urlApi + '/' + correo + '/' + clave,
        type: 'GET',
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            if (response.id != null) {
                sessionStorage.setItem('usuario', JSON.stringify(response));
                window.location.href = "../../usuario/usuario.html";
            } else {
                mensaje = 'Incorrect username or clave.';
                mostrarMensaje();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error login');
        }
    });
}

