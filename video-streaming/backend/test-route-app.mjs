import express from 'express';
import videoRoutes from './dist/src/routes/video.routes.js';
const app = express();
app.use(express.json());
app.use('/api/videos', videoRoutes);
app.listen(3001, () => console.log('test server 3001'));
setTimeout(() => process.exit(0), 5000);
