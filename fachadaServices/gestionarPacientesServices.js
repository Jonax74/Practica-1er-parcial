class GestionarPacientes {
  constructor(repoPaciente) {
    this.repoPaciente = repoPaciente;
  }

  registrarPaciente(pacienteData, apellido) {
    const datosPaciente = typeof pacienteData === 'string'
      ? { nombres: pacienteData, apellidos: apellido || '' }
      : pacienteData || {};

    const id = this.repoPaciente.siguienteId();
    const paciente = new Paciente(
      id,
      datosPaciente.tipoIdentificacion || '',
      datosPaciente.numeroIdentificacion || '',
      datosPaciente.nombres || '',
      datosPaciente.apellidos || '',
      datosPaciente.correoElectronico || '',
      datosPaciente.confirmarCorreo || '',
      datosPaciente.genero || '',
      datosPaciente.fechaNacimiento || ''
    );

    this.repoPaciente.agregar(paciente);
    return paciente;
  }

  listarPacientes() {
    return this.repoPaciente.obtenerTodos();
  }

  buscarPaciente(id) {
    return this.repoPaciente.buscarPorId(id);
  }
}

const gestionarPacientes = new GestionarPacientes(pacienteRepo);

