
function validarCampoObligatorio(campo, errorElement, mensaje) {
    if (campo.value.trim() === '') {
        errorElement.textContent = mensaje;
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validarLongitud(campo, errorElement, min, max, mensaje) {
    if (campo.value.length < min || campo.value.length > max) {
        errorElement.textContent = mensaje;
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function limpiarMensajesValidacion(formulario) {
    formulario.querySelectorAll('.mensaje-error').forEach((mensaje) => {
        mensaje.textContent = '';
    });
}

function validarCorreo(campo, errorElement,mensaje) {
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!correoRegex.test(campo.value)) {
        errorElement.textContent = mensaje;
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validarGenero(genero, errorElement, mensaje) {
    let seleccionado = false;
    for (let i = 0; i < genero.length; i++) {
        if (genero[i].checked) {
            seleccionado = true;
            break;
        }
    }

    if (!seleccionado) {
        errorElement.textContent = mensaje;
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validarFormulario() {
    const formulario = document.getElementById('formularioContacto');
    const correo = document.getElementById('correo-electronico');
    const confirmarCorreo = document.getElementById('confirmar-correo');
    const camposConMensaje = {
        identificacion: 'errorTipoIdentificacion',
        'numero-identificacion': 'errorNumeroIdentificacion',
        nombres: 'errorNombres',
        apellidos: 'errorApellidos',
        'fecha-nacimiento': null
    };

    Object.entries(camposConMensaje).forEach(([id, errorId]) => {
        const campo = document.getElementById(id);
        if (errorId) {
            document.getElementById(errorId).textContent = campo.checkValidity() ? '' : 'Este campo es obligatorio.';
        }
    });

    const correoValido = validarCorreo(correo, document.getElementById('errorCorreo'), 'Ingrese un correo electrónico válido.');
    const errorConfirmarCorreo = document.getElementById('errorConfirmarCorreo');
    const confirmarCorreoObligatorio = validarCampoObligatorio(
        confirmarCorreo,
        errorConfirmarCorreo,
        'Confirme su correo electrónico.'
    );
    const confirmarCorreoValido = confirmarCorreoObligatorio && confirmarCorreo.value === correo.value;

    if (confirmarCorreoObligatorio && !confirmarCorreoValido) {
        errorConfirmarCorreo.textContent = 'Los correos electrónicos deben coincidir.';
    }

    const camposObligatoriosValidos = [...formulario.querySelectorAll('input[required]:not([name="genero"]), select[required]')]
        .every((campo) => campo.checkValidity());
    const generoValido = validarGenero(
        document.getElementsByName('genero'),
        document.getElementById('errorGenero'),
        'Seleccione un género.'
    );

    return camposObligatoriosValidos && correoValido && confirmarCorreoValido && generoValido;
}

function configurarValidacionFormularioContacto() {
    const formulario = document.getElementById('formularioContacto');
    if (!formulario) return;

    formulario.querySelectorAll('input, select').forEach((campo) => {
        campo.addEventListener('blur', () => validarFormulario());
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        if (validarFormulario()) {
            guardarUsuarioLocalmente(formulario);
            mostrarMensajeExito();
            formulario.reset();
        }
    });
}

function guardarUsuarioLocalmente(formulario) {
    const datosFormulario = new FormData(formulario);
    const usuario = Object.fromEntries(datosFormulario.entries());
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosClinica') || '[]');

    usuario.fechaRegistro = new Date().toISOString();
    usuariosGuardados.push(usuario);
    localStorage.setItem('usuariosClinica', JSON.stringify(usuariosGuardados));

    console.log('Usuario guardado correctamente:', usuario);
    console.table(usuariosGuardados);
}

function mostrarMensajeExito() {
    Toastify({
        text: "Registro exitoso. Usuario guardado localmente.",
        duration: 3000,            // Duración: 3 segundos
        gravity: "top",             // Posición: arriba
        position: "right",          // Alineación: derecha
        style: {
            background: "rgba(0, 128, 0, 0.8)",  // Verde con transparencia
            color: "#fff",                      // Texto blanco
            borderRadius: "12px",               // Esquinas redondeadas
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Sombra ligera
            padding: "12px 20px"               // Más relleno
        },
        stopOnFocus: true, // No desaparecer al pasar el mouse
    }).showToast();
}

function validarFormularioMedico() {
    const nombres = document.getElementById('nombresMedico');
    const apellidos = document.getElementById('apellidosMedico');
    const edad = document.getElementById('edadMedico');
    const especialidad = document.getElementById('especialidadMedico');
    const inicio = document.getElementById('inicioAtencionMedico');
    const fin = document.getElementById('finAtencionMedico');
    const experiencia = document.getElementById('aniosDeExperienciaMedico');
    const genero = document.getElementsByName('genero');

    const nombresValidos = validarLongitud(nombres, document.getElementById('errorNombresMedico'), 1, 20, 'El nombre debe tener entre 1 y 20 caracteres.');
    const apellidosValidos = validarLongitud(apellidos, document.getElementById('errorApellidosMedico'), 1, 20, 'El apellido debe tener entre 1 y 20 caracteres.');
    const edadValida = edad.checkValidity();
    const especialidadValida = validarCampoObligatorio(especialidad, document.getElementById('errorEspecialidadMedico'), 'La especialidad es obligatoria.');
    const generoValido = validarGenero(genero, document.getElementById('errorGeneroMedico'), 'El género es obligatorio.');
    const horarioValido = inicio.value < fin.value;
    const experienciaValida = experiencia.checkValidity();

    document.getElementById('errorEdadMedico').textContent = edadValida ? '' : 'La edad debe estar entre 1 y 120 años.';
    document.getElementById('errorInicioAtencionMedico').textContent = horarioValido ? '' : 'La hora de inicio debe ser anterior a la hora de fin.';
    document.getElementById('errorFinAtencionMedico').textContent = horarioValido ? '' : 'La hora de fin debe ser posterior a la hora de inicio.';
    document.getElementById('errorExperienciaMedico').textContent = experienciaValida ? '' : 'Los años de experiencia no pueden ser negativos.';

    return nombresValidos && apellidosValidos && edadValida && especialidadValida && generoValido && horarioValido && experienciaValida;
}

function validarCampoMedico(campo) {
    const mensajes = {
        nombresMedico: ['errorNombresMedico', 'El nombre debe tener entre 1 y 20 caracteres.'],
        apellidosMedico: ['errorApellidosMedico', 'El apellido debe tener entre 1 y 20 caracteres.'],
        especialidadMedico: ['errorEspecialidadMedico', 'La especialidad es obligatoria.'],
        inicioAtencionMedico: ['errorInicioAtencionMedico', 'La hora de inicio es obligatoria.'],
        finAtencionMedico: ['errorFinAtencionMedico', 'La hora de fin es obligatoria.']
    };

    if (campo.id === 'nombresMedico' || campo.id === 'apellidosMedico') {
        const [idError, mensaje] = mensajes[campo.id];
        validarLongitud(campo, document.getElementById(idError), 1, 20, mensaje);
    } else if (mensajes[campo.id]) {
        const [idError, mensaje] = mensajes[campo.id];
        validarCampoObligatorio(campo, document.getElementById(idError), mensaje);
    } else if (campo.id === 'edadMedico') {
        document.getElementById('errorEdadMedico').textContent = campo.checkValidity() ? '' : 'La edad debe estar entre 1 y 120 años.';
    } else if (campo.id === 'aniosDeExperienciaMedico') {
        document.getElementById('errorExperienciaMedico').textContent = campo.checkValidity() ? '' : 'Los años de experiencia no pueden ser negativos.';
    } else if (campo.name === 'genero') {
        validarGenero(document.getElementsByName('genero'), document.getElementById('errorGeneroMedico'), 'El género es obligatorio.');
    }
}

function validarFormularioPaciente() {
    const nombres = document.getElementById('nombresPaciente');
    const apellidos = document.getElementById('apellidosPaciente');
    const nombresValidos = validarLongitud(nombres, document.getElementById('errorNombresPaciente'), 1, 20, 'El nombre debe tener entre 1 y 20 caracteres.');
    const apellidosValidos = validarLongitud(apellidos, document.getElementById('errorApellidosPaciente'), 1, 20, 'El apellido debe tener entre 1 y 20 caracteres.');

    return nombresValidos && apellidosValidos;
}

function validarCampoPaciente(campo) {
    const errorElement = document.getElementById(campo.id === 'nombresPaciente' ? 'errorNombresPaciente' : 'errorApellidosPaciente');
    const mensaje = campo.id === 'nombresPaciente'
        ? 'El nombre debe tener entre 1 y 20 caracteres.'
        : 'El apellido debe tener entre 1 y 20 caracteres.';

    validarLongitud(campo, errorElement, 1, 20, mensaje);
}

function validarFormularioCita() {
    const fecha = document.getElementById('fecha');
    const horaInicio = document.getElementById('horaInicio');
    const horaFin = document.getElementById('horaFin');
    const hoy = obtenerFechaActual();
    const fechaValida = fecha.value !== '' && fecha.value >= hoy;
    const horarioValido = horaInicio.value !== '' && horaFin.value !== '' && horaInicio.value < horaFin.value;

    document.getElementById('errorFechaCita').textContent = fecha.value !== '' && !fechaValida ? 'No se puede agendar una cita en una fecha pasada.' : '';
    document.getElementById('errorHoraInicioCita').textContent = horaInicio.value !== '' && horaFin.value !== '' && !horarioValido ? 'La hora de inicio debe ser anterior a la hora de fin.' : '';
    document.getElementById('errorHoraFinCita').textContent = horaInicio.value !== '' && horaFin.value !== '' && !horarioValido ? 'La hora de fin debe ser posterior a la hora de inicio.' : '';

    return fechaValida && horarioValido;
}

function obtenerFechaActual() {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function actualizarEstadoBotonCita() {
    const formulario = document.getElementById('formCitas');
    const fecha = document.getElementById('fecha');
    const horaInicio = document.getElementById('horaInicio');
    const horaFin = document.getElementById('horaFin');
    const fechaValida = fecha.value !== '' && fecha.value >= obtenerFechaActual();
    const horarioValido = horaInicio.value !== '' && horaFin.value !== '' && horaInicio.value < horaFin.value;

    document.getElementById('btnAgregarCita').disabled = !(formulario.checkValidity() && fechaValida && horarioValido);
}

function configurarValidacionesCita() {
    const formulario = document.getElementById('formCitas');
    if (!formulario) return;

    const fecha = document.getElementById('fecha');
    const hoy = obtenerFechaActual();
    fecha.min = hoy;

    ['fecha', 'horaInicio', 'horaFin'].forEach((id) => {
        const campo = document.getElementById(id);
        const validarCita = () => {
            validarFormularioCita();
            actualizarEstadoBotonCita();
        };
        campo.addEventListener('input', validarCita);
        campo.addEventListener('change', validarCita);
        campo.addEventListener('blur', validarCita);
    });

    formulario.querySelectorAll('select').forEach((campo) => {
        campo.addEventListener('input', actualizarEstadoBotonCita);
        campo.addEventListener('change', actualizarEstadoBotonCita);
        campo.addEventListener('blur', actualizarEstadoBotonCita);
    });
}

function validarCamposAlCambiarFoco() {
    const formulario = document.getElementById('formMedico');
    if (!formulario) return;

    formulario.querySelectorAll('input, textarea').forEach((campo) => {
        const validarMedico = () => validarCampoMedico(campo);
        campo.addEventListener('input', validarMedico);
        campo.addEventListener('change', validarMedico);
        campo.addEventListener('blur', validarMedico);
    });

    const formularioPaciente = document.getElementById('formPaciente');
    if (!formularioPaciente) return;
    formularioPaciente.querySelectorAll('input').forEach((campo) => {
        const validarPaciente = () => validarCampoPaciente(campo);
        campo.addEventListener('input', validarPaciente);
        campo.addEventListener('change', validarPaciente);
        campo.addEventListener('blur', validarPaciente);
    });
}

document.addEventListener('DOMContentLoaded', validarCamposAlCambiarFoco);
document.addEventListener('DOMContentLoaded', configurarValidacionesCita);
document.addEventListener('DOMContentLoaded', configurarValidacionFormularioContacto);

