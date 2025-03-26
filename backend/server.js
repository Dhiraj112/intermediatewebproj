import express from 'express';
import dotenv from 'dotenv';
import {conectDB} from './config/db.js';
import cors from 'cors';
import productRoutes from './routes/product.route.js';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
const __dirname = path.resolve();
app.use(cors());
app.use(express.json());//allows us to parse json bodies in the request 
app.use('/api/products',productRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
''

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
if(process.env.NODE_ENV !== 'production'){
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend/build/index.html')));
}
server.listen(PORT, () => {
  conectDB();
  console.log(`Server is running on port ${PORT}`);
});

export { io };

