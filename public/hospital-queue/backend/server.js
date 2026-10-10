const express = require('express');
const cors = require('cors');
const path = require('path');
const net = require('net');
const dotenv = require('dotenv');
const { getPatients, addPatient, addPriorityPatient, removePatient, clearPatients } = require('./db');

dotenv.config();

const app = express();

function getAvailablePort(port) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(getAvailablePort(port + 1));
      } else {
        reject(error);
      }
    });

    tester.once('listening', () => {
      tester.once('close', () => resolve(port));
      tester.close();
    });

    tester.listen(port);
  });
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hospital queue API is running' });
});

app.get('/api/patients', (req, res) => {
  const patients = getPatients();
  res.json({ patients });
});

app.post('/api/patients', (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Patient name is required' });
  }

  const patients = addPatient(name.trim());
  return res.status(201).json({ patients });
});

app.post('/api/patients/priority', (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Priority patient name is required' });
  }

  const patients = addPriorityPatient(name.trim());
  return res.status(201).json({ patients });
});

app.delete('/api/patients/:index', (req, res) => {
  const { index } = req.params;
  const patients = removePatient(index);
  return res.json({ patients });
});

app.delete('/api/patients', (req, res) => {
  const patients = clearPatients();
  return res.json({ patients });
});

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const availablePort = await getAvailablePort(PORT);

  app.listen(availablePort, () => {
    console.log(`Hospital queue server running on http://localhost:${availablePort}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start hospital queue server:', error);
  process.exit(1);
});
