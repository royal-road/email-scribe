import express from 'express';
import cors from 'cors';
import path from 'path';
import { handleUpload } from './routes/upload';
import {
  handlePresetSave,
  handlePresetList,
  handlePresetLoad,
  handlePresetDelete,
} from './routes/presets';

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// // Debugging middleware
// app.use((req, res, next) => {
//   console.log(`Received request: ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   next();
// });

const router = express.Router();

// Serve static files from the 'public' directory
router.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'public', 'uploads'))
);

// Serve template files
router.use('/templates', express.static(path.join(process.cwd(), 'Templates')));

// API Routes
router.post('/upload', handleUpload);
router.post('/preset', handlePresetSave);
router.get('/presets', handlePresetList);
router.get('/preset', handlePresetLoad);
router.delete('/preset', handlePresetDelete);

// Serve the SPA static files
router.use(express.static(path.join(process.cwd(), 'dist')));

// Catch-all route to serve the SPA for client-side routing
router.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Mount the router under /newsletter-builder
app.use(`/${process.env.VITE_BASE_PATH}`, router);

// 404 handler for requests outside /newsletter-builder
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Unhandled Endpoint: ${req.method} ${req.path}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
