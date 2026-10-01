import express from 'express';
import videoRoutes from './dist/src/routes/video.routes.js';
const app = express();
app.use(express.json());
app.use('/api/videos', videoRoutes);
app.listen(3002, () => console.log('test server 3002'));
