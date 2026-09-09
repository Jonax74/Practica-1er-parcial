const formPaciente = document.getElementById("formPaciente") || document.getElementById("formularioContacto");
const pacienteSelect = document.getElementById("pacienteSelect");
const btnAgregarPaciente = document.getElementById("btnAgregarPaciente");

const obtenerDatosPacienteDesdeFormulario = () => ({
  tipoIdentificacion: document.getElementById("identificacion")?.value || document.getElementById("tipoIdentificacionPaciente")?.value || "",
  numeroIdentificacion: document.getElementById("numero-identificacion")?.value || document.getElementById("numeroIdentificacionPaciente")?.value || "",
  nombres: document.getElementById("nombres")?.value || document.getElementById("nombresPaciente")?.value || "",
  apellidos: document.getElementById("apellidos")?.value || document.getElementById("apellidosPaciente")?.value || "",
  correoElectronico: document.getElementById("correo-electronico")?.value || document.getElementById("correoElectronicoPaciente")?.value || "",
  confirmarCorreo: document.getElementById("confirmar-correo")?.value || document.getElementById("confirmarCorreoPaciente")?.value || "",
  genero: document.querySelector('input[name="genero"]:checked')?.value || document.getElementById("generoPaciente")?.value || "",
  fechaNacimiento: document.getElementById("fecha-nacimiento")?.value || document.getElementById("fechaNacimientoPaciente")?.value || ""
});

const actualizarEstadoBotonPaciente = () => {
  const formularioValido = typeof validarFormulario === 'function' && formPaciente?.id === 'formularioContacto'
    ? validarFormulario()
    : formPaciente?.checkValidity() ?? false;

  if (btnAgregarPaciente) {
    btnAgregarPaciente.disabled = !formularioValido;
  }
};

if (formPaciente) {
  formPaciente.addEventListener("input", actualizarEstadoBotonPaciente);
  formPaciente.addEventListener("change", actualizarEstadoBotonPaciente);

  formPaciente.addEventListener("submit", (e) => {
    e.preventDefault();

    const validacionCorrecta = formPaciente.id === "formPaciente"
      ? validarFormularioPaciente()
      : validarFormulario();

    if (!validacionCorrecta) {
      return;
    }

    const datosPaciente = obtenerDatosPacienteDesdeFormulario();
    const paciente = gestionarPacientes.registrarPaciente(datosPaciente);
    console.log("Paciente registrado:", paciente);

    if (pacienteSelect) {
      const option = document.createElement("option");
      option.value = paciente.id;
      option.textContent = `${paciente.nombres} ${paciente.apellidos}`;
      pacienteSelect.appendChild(option);
    }

    formPaciente.reset();
    if (typeof limpiarMensajesValidacion === 'function') {
      limpiarMensajesValidacion(formPaciente);
    }

    if (btnAgregarPaciente) {
      btnAgregarPaciente.disabled = true;
    }

    if (typeof mostrarNotificacion === 'function') {
      mostrarNotificacion(`Paciente ${paciente.nombres} ${paciente.apellidos} registrado con éxito`);
    } else {
      console.log(`Paciente ${paciente.nombres} ${paciente.apellidos} registrado con éxito`);
    }
  });
}


