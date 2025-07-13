// Simulador de turnos médicos

const turnosAsignados = [];

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

// Función para mostrar especialidades
function mostrarEspecialidades() {
  let mensaje = "Especialidades disponibles:\n";
  for (let i = 0; i < especialidades.length; i++) {
    mensaje += `${i + 1} - ${especialidades[i].nombre}\n`;
  }
  return mensaje;
}

// Validación de nombre
function solicitarNombre() {
  let nombre;
  do {
    nombre = prompt("Ingrese su nombre:");
    if (!nombre || nombre.trim() === "") {
      alert("El nombre es obligatorio");
    }
  } while (!nombre || nombre.trim() === "");
  return nombre.trim();
}

// Función principal
function simularTurno() {
  alert("Bienvenidos al sistema de turnos médicos");

  const nombrePaciente = solicitarNombre();

  const opcion = parseInt(prompt(mostrarEspecialidades()));

  if (isNaN(opcion) || opcion < 1 || opcion > especialidades.length) {
    alert("Opción inválida");
    return;
  }

  const especialidadElegida = especialidades[opcion - 1];
  const medico = especialidadElegida.medicos[Math.floor(Math.random() * especialidadElegida.medicos.length)];
  const turno = especialidadElegida.turnos[Math.floor(Math.random() * especialidadElegida.turnos.length)];

  const nuevoTurno = {
    paciente: nombrePaciente,
    especialidad: especialidadElegida.nombre,
    medico: medico,
    horario: turno
  };

  turnosAsignados.push(nuevoTurno);

  alert(`Turno asignado a ${nombrePaciente}:\nEspecialidad: ${especialidadElegida.nombre}\nMédico: ${medico}\nHorario: ${turno}`);

  console.log("=== Turnos Asignados ===");
  turnosAsignados.forEach((t, i) => {
    console.log(`${i + 1}. ${t.paciente} - ${t.especialidad} con ${t.medico} el ${t.horario}`);
  });
}