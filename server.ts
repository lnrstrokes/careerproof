/**
 * Local dev server only. Express + Vite middleware.
 * Production runs on Vercel via api/analyze.ts + static dist/.
 *
 * Error contract (no exceptions, no fallback content):
 * - 400 { success:false, code:"INVALID_INPUT", fields:[...] }
 * - 413 { success:false, code:"PAYLOAD_TOO_LARGE", message }
 * - 502 { success:false, code:"AI_INVALID_OUTPUT", message }
 * - 503 { success:false, code:"AI_UNAVAILABLE", message }
 */
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { runAnalysis } from './server/analyze';
import { MAX_PAYLOAD_BYTES, toErrorPayload } from './server/schema';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// 1 MB JSON cap. Vercel caps function payloads around 4.5MB; a larger local
// limit would be meaningless.
app.use(express.json({ limit: '1mb' }));

// Map body-parser limit errors to the 413 contract.
app.use(
  (
    err: { type?: string; statusCode?: number; message?: string },
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err?.type === 'entity.too.large') {
      res.status(413).json({
        success: false,
        code: 'PAYLOAD_TOO_LARGE',
        message: `Request body exceeds the ${Math.round(MAX_PAYLOAD_BYTES / 1000)} KB limit.`,
      });
      return;
    }
    if (err?.type === 'entity.parse.failed') {
      res.status(400).json({
        success: false,
        code: 'INVALID_INPUT',
        message: 'Request body is not valid JSON.',
      });
      return;
    }
    next(err);
  },
);

app.post('/api/analyze', async (req, res) => {
  try {
    const brief = await runAnalysis(req.body ?? {});
    res.json({ success: true, brief });
  } catch (error) {
    const { status, body } = toErrorPayload(error);
    res.status(status).json(body);
  }
});

async function startServer() {
  // Serve static assets in production or mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerProof running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
