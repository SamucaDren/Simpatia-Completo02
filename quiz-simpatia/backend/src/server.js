require('dotenv').config();
const express = require('express');
const cors = require('cors');

const quizRoutes = require('./routes/quiz');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/quiz', quizRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (_, res) => res.json({ status: 'API Simpat.IA rodando.' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando em http://localhost:${PORT}`));
