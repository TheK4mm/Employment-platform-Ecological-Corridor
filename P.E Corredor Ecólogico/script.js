
// Simulación de registro de usuarios y ofertas usando localStorage

document.addEventListener("DOMContentLoaded", () => {
  const registroForm = document.getElementById("registroForm");
  const ofertaForm = document.getElementById("ofertaForm");
  const ofertasLista = document.getElementById("ofertasLista");

  // Cargar ofertas guardadas
  mostrarOfertas();

  // Registro de usuario
  if (registroForm) {
    registroForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const correo = document.getElementById("correo").value;
      const clave = document.getElementById("clave").value;

      const usuario = { nombre, correo, clave };
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios.push(usuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      alert("Registro exitoso. Bienvenido, " + nombre + "!");
      registroForm.reset();
    });
  }

  // Publicar oferta
  if (ofertaForm) {
    ofertaForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const titulo = document.getElementById("titulo").value;
      const descripcion = document.getElementById("descripcion").value;

      const oferta = { titulo, descripcion };
      let ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];
      ofertas.push(oferta);
      localStorage.setItem("ofertas", JSON.stringify(ofertas));

      mostrarOfertas();
      ofertaForm.reset();
      alert("Oferta publicada exitosamente.");
    });
  }

  // Mostrar ofertas en el HTML
  function mostrarOfertas() {
    if (!ofertasLista) return;

    ofertasLista.innerHTML = "";
    const ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];

    if (ofertas.length === 0) {
      ofertasLista.innerHTML = "<p>No hay ofertas disponibles por ahora.</p>";
      return;
    }

    ofertas.forEach((oferta) => {
      const div = document.createElement("div");
      div.classList.add("oferta");
      div.innerHTML = `
        <h3>${oferta.titulo}</h3>
        <p>${oferta.descripcion}</p>
      `;
      ofertasLista.appendChild(div);
    });
  }
});
