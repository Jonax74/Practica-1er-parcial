const formMedico = document.getElementById("formMedico");
const medicoSelect = document.getElementById("medicoSelect");
const btnAgregarMedico = document.getElementById("btnAgregarMedico");

function horarioValido(){
  const inicio = document.getElementById("inicioAtencionMedico").value;
  const fin = document.getElementById("finAtencionMedico").value;
  return !inicio || !fin || inicio < fin;
}

// habilita/deshabilita el botón según la validez del formulario
formMedico.addEventListener("input", () => {
  btnAgregarMedico.disabled = !formMedico.checkValidity();
});

formMedico.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validarFormularioMedico()) {
    return;
  }
  if (!horarioValido()) {
    mostrarNotificacion("El horario de atención es inválido. Asegúrese de que la hora de inicio sea anterior a la hora de fin.");
    return;
  }
  const nombres = document.getElementById("nombresMedico").value;
  const apellidos = document.getElementById("apellidosMedico").value;
  const edad = document.getElementById("edadMedico").value;
  const genero = document.querySelector('input[name="genero"]:checked').value;
  const especialidad = document.getElementById("especialidadMedico").value;
  const inicioAtencion = document.getElementById("inicioAtencionMedico").value;
  const finAtencion = document.getElementById("finAtencionMedico").value;
  const aniosDeExperiencia = document.getElementById("aniosDeExperienciaMedico").value;
  const bibliografia = document.getElementById("bibliografiaMedico").value;

  const medico = gestionarMedicos.registrarMedico({
    nombres,
    apellidos,
    edad,
    especialidad,
    genero,
    inicioAtencion,
    finAtencion,
    aniosDeExperiencia,
    bibliografia
  });
  console.log("Médico registrado:", medico);
  // actualizar select
  const option = document.createElement("option");
  option.value = medico.id;
  option.textContent = `${medico.nombres} ${medico.apellidos}`;
  medicoSelect.appendChild(option);

  formMedico.reset();
  limpiarMensajesValidacion(formMedico);
  btnAgregarMedico.disabled = true;

  mostrarNotificacion(`Médico ${medico.nombres} ${medico.apellidos} registrado con éxito`);
});

