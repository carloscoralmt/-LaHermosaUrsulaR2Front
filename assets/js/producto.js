const urlApi = 'http://localhost:8080/api/cosmetics';

let mensaje = '';

$(document).ready(function () {
    listarTabla();
});

function listarTabla() {
    $.ajax({
        url: urlApi + '/all',
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            let valor="<table>";
            for(i=0;i<response.length;i++){
                valor+="<tr>";
                
                valor+="<td>"+response[i].reference+"</td>";
                valor+="<td>"+response[i].brand+"</td>";
                valor+="<td>"+response[i].category+"</td>";
                valor+="<td>"+response[i].description+"</td>";
                valor+="<td>"+response[i].price+"</td>";
                valor+="<td>"+response[i].quantity+"</td>";
                valor+="<td>"+response[i].photography+"</td>";
                valor+="<td> <button onclick='consultar("+JSON.stringify(response[i].reference)+")'  data-bs-toggle='modal' data-bs-target='#modelId' class='btn btn-warning'>Editar</button>";
                valor+="<td> <button onclick='borrarProducto("+JSON.stringify(response[i].reference)+")' class='btn btn-danger'>Eliminar</button>";
                valor+="</tr>";
            }
            valor+="</table>";

            $('#tbody').html(valor);
        }
    });
}


$("#formularioProducto").on("click", function (event) {
    event.preventDefault();
});

// validar datos del formulario
function validarFormulario() {
    if (validarDatos()) {
        registrarProducto(); // registrar producto
    } else {
        $('#alerta').html('<p id="mensaje">' + mensaje + '</p>'); //Mostrar alerta
    }
}

// Validar formulario
function validarDatos() {

    let referencia = $('#referencia').val();
    let marca = $('#brand').val();
    let categoria = $('#category').val();
    let descripcion = $('#description').val();
    let precio = $('#price').val();
    let cantidad = $('#quantity').val();
    let foto = $('#photography').val();

    // validar campos vacios   
    if (referencia == '') {
        mensaje = 'Referencia es requerido ';
        return false;
    }
    if (marca == '') {
        mensaje = 'Marca es requerido ';
        return false;
    }
    if (categoria == '') {
        mensaje = 'Categoria es requerido ';
        return false;
    }
    if (descripcion == '') {
        mensaje = 'Descripción es requerido';
        return false;
    }
    if (precio == '') {
        mensaje = 'Precio es requerido';
        return false;
    }
    if (cantidad == '') {
        mensaje = 'Cantidad es requerido ';
        return false;
    }
    if (foto == '') {
        mensaje = 'Fotografia es requerido ';
        return false;
    }
    return true;
}

// Agregar nuevo producto
function registrarProducto() {
    var dataForm = {
        reference: $("#reference").val(),
        brand: $("#brand").val(),
        category: $("#category").val(),
        description: $("#description").val(),
        price: $("#price").val(),
        quantity: $("#quantity").val(),
        photography: $("#photography").val()
    };

    var dataJson = JSON.stringify(dataForm);

    $.ajax({
        url: urlApi + '/new',
        type: 'POST',
        data: dataJson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            listarTabla();
            alert('producto registrado');
            limpiarFormulario();
            $('#modelId').modal('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error al registrar');
        }
    });

}

function borrarProducto(reference) {
    console.log(reference);
    let myData = {
        id: reference
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: urlApi+"/"+reference,
        type: "DELETE",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (response) {
            alert("se elimino correctamente");
            listarTabla();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error');
        }
    });
}


function consultar(reference) {
    $.ajax({
        url: urlApi + '/' + reference,
        type: 'GET',
        datatype: 'JSON',
        success: function (response) {
            $("#reference").val(response.reference);
            $("#brand").val(response.brand);
            $("#category").val(response.category);
            $("#description").val(response.description);
            $("#price").val(response.price);
            $("#quantity").val(response.quantity);
            $("#photography").val(response.photography);

            let valor = "<input class='btn form-control btn btn-warning' data-bs-dismiss='modal'  id='botonActualizar' type='submit' value='Actualizar' onclick='update(" + JSON.stringify(response.reference) + ")'>";
            $('#botonFormulario').html(valor);
            $("#botonRegistrar").remove();
        }
    });
}

function update(referenceId) {
    var dataForm = {
        reference: referenceId,
        brand: $("#brand").val(),
        category: $("#category").val(),
        description: $("#description").val(),
        price: $("#price").val(),
        quantity: $("#quantity").val(),
        photography: $("#photography").val()
    };

    var dataJson = JSON.stringify(dataForm);

    $.ajax({
        url: urlApi + '/update',
        type: 'PUT',
        data: dataJson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            alert('Producto: ' + response.brand + ' actualizazdo');
            limpiarFormulario();
            listarTabla();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error al actualizar');
        }
    });

}

function limpiarFormulario() {
    $('#formularioProducto')[0].reset();

    let valor = '<input class="btn form-control btn btn-success"  id="botonRegistrar" type="submit" value="Registrar" onclick="validarFormulario()">';
    $('#botonFormulario').html(valor);
    $("#botonActualizar").remove();
}