export function shortWorkerName(fullName) {
  const nameWords = fullName.split(" ");
  if (nameWords.length < 3) return fullName;
  else {
    return [nameWords[0], nameWords[1].slice(0, 1) + ".", nameWords[2].slice(0, 1) + "."].join(" ");
  }
}

export function formatRolePath(role) {
  if (role === "admin") return "admin";
  else if (role === "flight dispatcher") return "flight-dispatcher";
  else if (role === "engineer") return "engineer";
  else if (role === "shift supervisor") return "shift-supervisor";
  else if (role === "technician") return "technician";
}

export function translateRole(role) {
  if (role === "admin") return "адміністратор";
  else if (role === "flight dispatcher") return "диспетчер";
  else if (role === "engineer") return "інженер";
  else if (role === "shift supervisor") return "бригадир";
  else if (role === "technician") return "технік";
}
