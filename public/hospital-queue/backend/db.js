const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'patients.json');

function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
  }
}

function readPatients() {
  ensureStorage();

  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writePatients(patients) {
  ensureStorage();
  fs.writeFileSync(filePath, JSON.stringify(patients, null, 2), 'utf8');
}

function getPatients() {
  return readPatients();
}

function addPatient(name) {
  const patients = readPatients();
  patients.push({ name, priority: false });
  writePatients(patients);
  return patients;
}

function addPriorityPatient(name) {
  const patients = readPatients();
  patients.unshift({ name, priority: true });
  writePatients(patients);
  return patients;
}

function removePatient(index) {
  const patients = readPatients();
  const validIndex = Number(index);

  if (Number.isNaN(validIndex) || validIndex < 0 || validIndex >= patients.length) {
    return patients;
  }

  patients.splice(validIndex, 1);
  writePatients(patients);
  return patients;
}

function clearPatients() {
  writePatients([]);
  return [];
}

module.exports = {
  getPatients,
  addPatient,
  addPriorityPatient,
  removePatient,
  clearPatients,
  readPatients,
  writePatients
};
