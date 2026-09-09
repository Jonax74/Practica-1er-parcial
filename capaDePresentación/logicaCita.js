const formCitas = document.getElementById("formCitas");
const tablaCitas = document.getElementById("tablaCitas");
const btnAgregarCita = document.getElementById("btnAgregarCita");

function horarioValido() {
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;
  return !horaInicio || !horaFin || horaInicio < horaFin;
}

// habilita/deshabilita el botón según la validez del formulario
// ("change" cubre los <select>, que no siempre disparan "input")
formCitas.addEventListener("input", actualizarEstadoBotonCita);
formCitas.addEventListener("change", actualizarEstadoBotonCita);

formCitas.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validarFormularioCita()) {
    return;
  }
  if (!horarioValido()) {
    mostrarNotificacion("El horario de la cita es inválido. Asegúrese de que la hora de inicio sea anterior a la hora de fin.");
    return;
  }
 
  const fecha = document.getElementById("fecha").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;

  const medicoSelect=document.getElementById("medicoSelect");
  const pacienteSelect=document.getElementById("pacienteSelect");

  const medicoId = parseInt(medicoSelect.value); 
  const pacienteId = parseInt(pacienteSelect.value); 

  console.log("Datos para registrar cita:", { fecha, horaInicio, horaFin, medicoId, pacienteId });
  
  try {
    const cita = gestionarCitas.registrarCita(fecha, horaInicio, horaFin, medicoId, pacienteId);
    console.log("Cita registrada:", cita);
    // mostrar en tabla
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cita.fecha}</td>
      <td>${cita.horaInicio}</td>
      <td>${cita.horaFin}</td>
      <td>${cita.medico.nombres} ${cita.medico.apellidos}</td>
      <td>${cita.paciente.nombres} ${cita.paciente.apellidos}</td>
    `;
    tablaCitas.appendChild(fila);

    formCitas.reset();
    btnAgregarCita.disabled = true;

    mostrarNotificacion("Cita registrada con éxito");
  } catch (error) {
    mostrarNotificacion(error.message, "error");
  }
});


