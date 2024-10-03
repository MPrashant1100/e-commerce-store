import { NextApiRequest, NextApiResponse } from 'next';
import { store } from '../../../lib/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { itemId, quantity } = req.body;
    try {
      store.addToCart(itemId, quantity);
      res.status(200).json({ message: 'Item added to cart' });
    } catch (error : any) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}