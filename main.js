// Simulador de turnos médicos

const especialidades = [
  {
    nombre: "Clínica General",
    medicos: ["Dra. Gonzalez", "Dr. Pírez"],
    turnos: ["Lunes 10:00", "Miércoles 14:00"]
  },
  {
    nombre: "Pediatría",
    medicos: ["Dra. Ferreira", "Dr. Medina"],
    turnos: ["Martes 09:00", "Jueves 15:00"]
  },
  {
    nombre: "Dermatología",
    medicos: ["Dra. Lopez", "Dr. Ramirez"],
    turnos: ["Viernes 11:00", "Sábado 10:00"]
  }
];

let turnosAsignados = JSON.parse(localStorage.getItem("turnos")) || [];

const form = document.getElementById("form-turno");
const lista = document.getElementById("lista-turnos");
const inputBusqueda = document.getElementById("busqueda");


// ✅ Evento: formulario
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const especialidadIndex = parseInt(document.getElementById("especialidad").value);

  if (nombre === "") {
    alert("Por favor ingrese su nombre.");
    return;
  }

  const especialidad = especialidades[especialidadIndex];
  const medico = especialidad.medicos[Math.floor(Math.random() * especialidad.medicos.length)];
  const horario = especialidad.turnos[Math.floor(Math.random() * especialidad.turnos.length)];

  const nuevoTurno = {
    id: Date.now(), // identificador único
    paciente: nombre,
    especialidad: especialidad.nombre,
    medico,
    horario
  };

  turnosAsignados.push(nuevoTurno);
  guardarTurnos();
  form.reset();
  alert("Turno asignado correctamente.");
});

// Evento: búsqueda
inputBusqueda.addEventListener("input", () => {
  const texto = inputBusqueda.value.toLowerCase();
  if (texto === "") {
    lista.innerHTML = ""; // limpiar resultados si no se busca
    return;
  }

  const filtrados = turnosAsignados.filter(t =>
    t.paciente.toLowerCase().includes(texto)
  );

  mostrarTurnos(filtrados);
});

// Mostrar turnos filtrados
function mostrarTurnos(listaTurnos) {
  lista.innerHTML = "";

  if (listaTurnos.length === 0) {
    lista.innerHTML = "<li>No hay turnos para ese nombre.</li>";
    return;
  }

  listaTurnos.forEach(turno => {
    const li = document.createElement("li");
    li.textContent = `${turno.paciente} - ${turno.especialidad} con ${turno.medico} el ${turno.horario}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarTurno(turno.id));

    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });
}

// Eliminar turno por ID
function eliminarTurno(id) {
  turnosAsignados = turnosAsignados.filter(t => t.id !== id);
  guardarTurnos();

  const texto = inputBusqueda.value.toLowerCase();
  const filtrados = turnosAsignados.filter(t =>
    t.paciente.toLowerCase().includes(texto)
  );
  mostrarTurnos(filtrados);
}

//  Guardar en localStorage
function guardarTurnos() {
  localStorage.setItem("turnos", JSON.stringify(turnosAsignados));
}