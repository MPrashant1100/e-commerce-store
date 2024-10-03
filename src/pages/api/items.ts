import { NextApiRequest, NextApiResponse } from 'next';
import { store } from '../../lib/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const items = store.getItems();
    res.status(200).json(items);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}