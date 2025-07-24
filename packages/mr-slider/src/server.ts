import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3030;

// Serve dist at /dist
app.use('/dist', express.static(path.join(rootDir, 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'test', 'index.html'));
});

app.listen(port, () => console.log(`Test server running at http://localhost:${port}`));
