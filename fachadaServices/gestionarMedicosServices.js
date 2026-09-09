class GestionarMedicos {
  constructor(repoMedico) {
    this.repoMedico = repoMedico
  }

  registrarMedico({ nombres, apellidos, edad, especialidad, genero, inicioAtencion, finAtencion, aniosDeExperiencia, bibliografia }) {
    const id = this.repoMedico.siguienteId();
    const medico = new Medico(id, nombres, apellidos, edad, especialidad, genero, inicioAtencion, finAtencion, aniosDeExperiencia, bibliografia);
    this.repoMedico.agregar(medico);
    return medico

  }

  listarMedicos() {
   return this.repoMedico.obtenerTodos();
  }

  buscarMedico(id) {
    return this.repoMedico.buscarPorId(id);
  }
}

const gestionarMedicos = new GestionarMedicos(medicoRepo);

