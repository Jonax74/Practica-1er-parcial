const formPaciente = document.getElementById("formPaciente");
const pacienteSelect = document.getElementById("pacienteSelect");
const btnAgregarPaciente = document.getElementById("btnAgregarPaciente");

// habilita/deshabilita el botón según la validez del formulario
formPaciente.addEventListener("input", () => {
  btnAgregarPaciente.disabled = !formPaciente.checkValidity();
});

formPaciente.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validarFormularioPaciente()) {
    return;
  }
  const nombres = document.getElementById("nombresPaciente").value; 
  const apellidos = document.getElementById("apellidosPaciente").value;

  const paciente = gestionarPacientes.registrarPaciente(nombres, apellidos);
  console.log("Paciente registrado:", paciente);
  // actualizar select
  const option = document.createElement("option");
  option.value = paciente.id;
  option.textContent = `${paciente.nombres} ${paciente.apellidos}`;
  pacienteSelect.appendChild(option);

  formPaciente.reset();
  limpiarMensajesValidacion(formPaciente);
  btnAgregarPaciente.disabled = true;

  mostrarNotificacion(`Paciente ${paciente.nombres} ${paciente.apellidos} registrado con éxito`);
});


