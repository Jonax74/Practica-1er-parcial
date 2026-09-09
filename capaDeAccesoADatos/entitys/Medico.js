class Medico {
  constructor(id, nombres, apellidos, edad, especialidad,genero, inicioAtencion, finAtencion, aniosDeExperiencia, bibliografia) {
    this.id = id;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.edad = edad;
    this.especialidad = especialidad;
    this.genero = genero;
    this.horarioDeAtencion = {
      inicio: inicioAtencion,
      fin: finAtencion
    };
    this.aniosDeExperiencia = aniosDeExperiencia;
    this.bibliografia = bibliografia;
  }
}



