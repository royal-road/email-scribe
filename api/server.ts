import express from 'express';
import cors from 'cors';
import path from 'path';
import { handleUpload } from './routes/upload';
import { handleAuth } from './routes/auth';
import {
  handlePresetSave,
  handlePresetList,
  handlePresetLoad,
} from './routes/presets';

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'public', 'uploads'))
);

// Serve template files
app.use('/templates', express.static(path.join(process.cwd(), 'Templates')));

// Routes
app.post('/upload', handleUpload);
app.get('/auth', handleAuth);
app.post('/preset', handlePresetSave);
app.get('/presets', handlePresetList);
app.get('/preset', handlePresetLoad);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Unhandled Endpoint: ${req.method} ${req.path}` });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
