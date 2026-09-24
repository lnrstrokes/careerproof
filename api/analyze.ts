/**
 * Vercel serverless handler for POST /api/analyze.
 * Thin wrapper around runAnalysis: no Vite, no app.listen, no server start,
 * no fallback content. On any failure it returns only the error contract.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runAnalysis } from '../server/analyze';
import { toErrorPayload } from '../server/schema';

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      success: false,
      code: 'INVALID_INPUT',
      message: 'Use POST for this endpoint.',
    });
    return;
  }

  try {
    const brief = await runAnalysis((req.body ?? {}) as Record<string, unknown>);
    res.status(200).json({ success: true, brief });
  } catch (error) {
    const { status, body } = toErrorPayload(error);
    res.status(status).json(body);
  }
}
