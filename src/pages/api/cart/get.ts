import { NextApiRequest, NextApiResponse } from 'next';
import { store } from '../../../lib/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const cart = store.getCart();
    res.status(200).json(cart);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}