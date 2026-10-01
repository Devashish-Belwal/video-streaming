import express from 'express';
import videoRoutes from './dist/src/routes/video.routes.js';
const app = express();
app.use(express.json());
app.use('/api/videos', videoRoutes);
app.listen(3004, () => console.log('test 3004'));
