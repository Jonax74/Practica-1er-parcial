const especialidades = {
  "terapia-neural": "La Terapia Neural regula el sistema nervioso mediante anestésicos locales.",
  "quiropraxia": "La Quiropraxia ayuda a corregir desequilibrios musculoesqueléticos y mejora la movilidad corporal.",
  "fisioterapia": "La Fisioterapia fortalece la recuperación funcional, la movilidad y la calidad de vida del paciente.",
  "nutricion": "La Nutrición y Dietética Terapéutica diseña planes personalizados para mejorar la salud y el bienestar."
};

const links = document.querySelectorAll('.especialidad');
const texto = document.getElementById('especialidadTexto');

links.forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    links.forEach(item => item.classList.remove('active'));
    this.classList.add('active');

    const clave = this.dataset.especialidad;
    texto.textContent = especialidades[clave];
  });
});
