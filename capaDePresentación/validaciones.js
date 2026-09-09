
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
    const numeroIdentificacion = document.getElementById('numero-identificacion');
    const nombres = document.getElementById('nombres');
    const apellidos = document.getElementById('apellidos');
    const fechaNacimiento = document.getElementById('fecha-nacimiento');
    const errorNumeroIdentificacion = document.getElementById('errorNumeroIdentificacion');
    const errorNombres = document.getElementById('errorNombres');
    const errorApellidos = document.getElementById('errorApellidos');
    const errorFechaNacimiento = document.getElementById('errorFechaNacimiento');

    const camposConMensaje = {
        identificacion: 'errorTipoIdentificacion',
        'numero-identificacion': 'errorNumeroIdentificacion',
        nombres: 'errorNombres',
        apellidos: 'errorApellidos',
        'fecha-nacimiento': 'errorFechaNacimiento'
    };

    Object.entries(camposConMensaje).forEach(([id, errorId]) => {
        const campo = document.getElementById(id);
        if (errorId && campo) {
            const errorElement = document.getElementById(errorId);
            if (campo.id === 'nombres' || campo.id === 'apellidos') {
                const longitudValida = validarLongitud(campo, errorElement, 2, 50, 'Debe tener entre 2 y 50 caracteres.');
                if (!longitudValida) {
                    return;
                }
            } else if (campo.id === 'fecha-nacimiento') {
                const hoy = new Date();
                const fechaIngresada = new Date(campo.value + 'T00:00:00');
                const fechaValida = campo.value !== '' && fechaIngresada <= hoy;
                errorElement.textContent = fechaValida ? '' : 'La fecha de nacimiento no puede ser mayor a la actual.';
                return;
            } else {
                errorElement.textContent = campo.checkValidity() ? '' : 'Este campo es obligatorio.';
            }
        }
    });

    const cedulaValida = numeroIdentificacion.value.trim() !== '' && /^\d{1,10}$/.test(numeroIdentificacion.value.trim());
    errorNumeroIdentificacion.textContent = numeroIdentificacion.value.trim() === ''
        ? 'Este campo es obligatorio.'
        : !cedulaValida
            ? 'La cédula debe contener solo números y máximo 10 caracteres.'
            : '';

    const nombresValidos = validarLongitud(nombres, errorNombres, 2, 50, 'El nombre debe tener entre 2 y 50 caracteres.');
    const apellidosValidos = validarLongitud(apellidos, errorApellidos, 2, 50, 'El apellido debe tener entre 2 y 50 caracteres.');

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

    const fechaValida = fechaNacimiento.value !== '' && new Date(fechaNacimiento.value + 'T00:00:00') <= new Date();
    errorFechaNacimiento.textContent = fechaNacimiento.value === ''
        ? 'La fecha de nacimiento es obligatoria.'
        : !fechaValida
            ? 'La fecha de nacimiento no puede ser mayor a la actual.'
            : '';

    const camposObligatoriosValidos = [...formulario.querySelectorAll('input[required]:not([name="genero"]), select[required]')]
        .every((campo) => campo.checkValidity());
    const generoValido = validarGenero(
        document.getElementsByName('genero'),
        document.getElementById('errorGenero'),
        'Seleccione un género.'
    );

    return camposObligatoriosValidos && cedulaValida && nombresValidos && apellidosValidos && correoValido && confirmarCorreoValido && generoValido && fechaValida;
}

function configurarValidacionFormularioContacto() {
    const formulario = document.getElementById('formularioContacto');
    if (!formulario) return;

    const numeroIdentificacion = document.getElementById('numero-identificacion');
    if (numeroIdentificacion) {
        numeroIdentificacion.addEventListener('input', () => {
            numeroIdentificacion.value = numeroIdentificacion.value.replace(/\D/g, '').slice(0, 10);
            validarFormulario();
        });
    }

    formulario.querySelectorAll('input, select').forEach((campo) => {
        campo.addEventListener('input', () => validarFormulario());
        campo.addEventListener('change', () => validarFormulario());
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
    const errorElement = campo.id === 'nombres' ? document.getElementById('errorNombres') :
        campo.id === 'apellidos' ? document.getElementById('errorApellidos') :
        campo.id === 'numero-identificacion' ? document.getElementById('errorNumeroIdentificacion') :
        campo.id === 'correo-electronico' ? document.getElementById('errorCorreo') :
        campo.id === 'confirmar-correo' ? document.getElementById('errorConfirmarCorreo') :
        campo.id === 'fecha-nacimiento' ? document.getElementById('errorFechaNacimiento') : null;

    if (!errorElement) return;

    if (campo.id === 'nombres' || campo.id === 'apellidos') {
        validarLongitud(campo, errorElement, 2, 50, campo.id === 'nombres' ? 'El nombre debe tener entre 2 y 50 caracteres.' : 'El apellido debe tener entre 2 y 50 caracteres.');
    } else if (campo.id === 'numero-identificacion') {
        const valor = campo.value.trim();
        errorElement.textContent = valor === '' ? 'Este campo es obligatorio.' : !/^\d{1,10}$/.test(valor) ? 'La cédula debe contener solo números y máximo 10 caracteres.' : '';
    } else if (campo.id === 'correo-electronico') {
        validarCorreo(campo, errorElement, 'Ingrese un correo electrónico válido.');
    } else if (campo.id === 'confirmar-correo') {
        const correo = document.getElementById('correo-electronico');
        const obligatorio = validarCampoObligatorio(campo, errorElement, 'Confirme su correo electrónico.');
        if (obligatorio && correo.value !== campo.value) {
            errorElement.textContent = 'Los correos electrónicos deben coincidir.';
        }
    } else if (campo.id === 'fecha-nacimiento') {
        const valor = campo.value;
        const fechaValida = valor !== '' && new Date(valor + 'T00:00:00') <= new Date();
        errorElement.textContent = valor === '' ? 'La fecha de nacimiento es obligatoria.' : !fechaValida ? 'La fecha de nacimiento no puede ser mayor a la actual.' : '';
    }
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

