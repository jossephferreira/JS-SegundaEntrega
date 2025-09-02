const form = document.getElementById("form-turno");
const listaTurnos = document.getElementById("lista-turnos");
const busqueda = document.getElementById("busqueda");
const selectEspecialidad = document.getElementById("especialidad");

let especialidadesData = [];

// Guardar y cargar desde localStorage
const getTurnos = () => JSON.parse(localStorage.getItem("turnos")) || [];
const saveTurnos = (turnos) => localStorage.setItem("turnos", JSON.stringify(turnos));

//Cargar especialidades desde JSON 
async function cargarEspecialidades() {
  try {
    const response = await fetch("especialidades.json");
    especialidadesData = await response.json();

    selectEspecialidad.innerHTML = "<option value=''>Seleccione una especialidad</option>";

    especialidadesData.forEach(esp => {
      const option = document.createElement("option");
      option.value = esp.id;
      option.textContent = esp.nombre;
      selectEspecialidad.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando especialidades:", error);
    Swal.fire("Error", "No se pudieron cargar las especialidades", "error");
  }
}
cargarEspecialidades();

// Renderizar turnos
function renderTurnos(filtro = "") {
  listaTurnos.innerHTML = "";

  const turnos = getTurnos();
  const filtrados = turnos.filter(t => 
    t.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  if (filtrados.length === 0) {
    listaTurnos.innerHTML = `<li class="placeholder">🔎 No se encontraron turnos</li>`;
    return;
  }

  filtrados.forEach((turno, index) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = `
      <strong>${turno.nombre}</strong>
      <span>Especialidad: ${turno.especialidad}</span>
      <span>Médico: ${turno.medico}</span>
      <span>Horario: ${turno.horario}</span>
    `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarTurno(index));

    li.appendChild(info);
    li.appendChild(btnEliminar);
    listaTurnos.appendChild(li);
  });
}

//Agregar turno
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const especialidadId = parseInt(selectEspecialidad.value);

  if (!nombre || !especialidadId) {
    Swal.fire("Error", "Debes completar todos los campos", "error");
    return;
  }

  const especialidadElegida = especialidadesData.find(esp => esp.id === especialidadId);

  const medicoAleatorio = especialidadElegida.medicos[Math.floor(Math.random() * especialidadElegida.medicos.length)];
  const turnoAleatorio = especialidadElegida.turnos[Math.floor(Math.random() * especialidadElegida.turnos.length)];

  let turnos = getTurnos();

  if (turnos.some(t => 
      t.nombre.toLowerCase() === nombre.toLowerCase() && 
      t.especialidad === especialidadElegida.nombre)) {
    Swal.fire("Atención", "Este paciente ya tiene un turno en esa especialidad", "warning");
    return;
  }

  turnos.push({ 
    nombre, 
    especialidad: especialidadElegida.nombre, 
    medico: medicoAleatorio, 
    horario: turnoAleatorio 
  });
  saveTurnos(turnos);

  Swal.fire("Éxito", `Turno asignado con ${medicoAleatorio} el ${turnoAleatorio}`, "success");

  form.reset();
  document.getElementById("nombre").value = "Juan Pérez";
});

// Buscar turnos
busqueda.addEventListener("input", (e) => {
  renderTurnos(e.target.value);
});

// Eliminar turno
function eliminarTurno(index) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "El turno será eliminado",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let turnos = getTurnos();
      turnos.splice(index, 1);
      saveTurnos(turnos);
      renderTurnos(busqueda.value);
      Swal.fire("Eliminado", "El turno fue eliminado", "success");
    }
  });
}