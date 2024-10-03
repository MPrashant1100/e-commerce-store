import { NextApiRequest, NextApiResponse } from 'next';
import { store } from '../../lib/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { discountCode } = req.body;
    try {
      const result = store.checkout(discountCode);
      res.status(200).json(result);
    } catch (error : any) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}