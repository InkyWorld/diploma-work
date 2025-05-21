export function shortWorkerName(fullName) {
  const nameWords = fullName.split(" ");
  if (nameWords.length < 3) return fullName;
  else {
    return [nameWords[0], nameWords[1].slice(0, 1) + ".", nameWords[2].slice(0, 1) + "."].join(" ");
  }
}
