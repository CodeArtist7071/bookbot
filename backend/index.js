require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const whatsappManager = require('./src/services/whatsappManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', (businessId) => {
    socket.join(businessId);
    console.log(`Client ${socket.id} joined room: ${businessId}`);
  });

  socket.on('whatsapp.checkStatus', (businessId) => {
    const session = whatsappManager.getSession(businessId);
    if (session) {
      socket.emit('whatsapp.status', 'connected');
    } else {
      socket.emit('whatsapp.status', 'disconnected');
    }
  });

  socket.on('whatsapp.init', async (businessId) => {
    try {
      console.log(`Initialization request for business: ${businessId}`);
      await whatsappManager.initSession(businessId, io, true); // Force new attempt
    } catch (err) {
      console.error('Failed to init WhatsApp:', err);
      socket.emit('whatsapp.error', 'Initialization failed');
    }
  });

  socket.on('whatsapp.logout', async (businessId) => {
    try {
      console.log(`Logout request for business: ${businessId}`);
      await whatsappManager.logoutSession(businessId, io);
    } catch (err) {
      console.error('Failed to logout WhatsApp:', err);
    }
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.send('BookBot Backend is Running (QR Method)');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Auto-resume existing sessions
  await whatsappManager.loadExistingSessions(io);
});
