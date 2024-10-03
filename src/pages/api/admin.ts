import { NextApiRequest, NextApiResponse } from 'next';
import { orders, discountCodes } from '../../utils/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req.query.action === 'stats') {
    const totalItemsPurchased = orders.reduce((acc, order) => acc + order.items.length, 0);
    const totalPurchaseAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalDiscountAmount = orders.reduce((acc, order) => acc + (order.totalAmount - order.discountedTotal), 0);

    return res.status(200).json({
      totalItemsPurchased,
      totalPurchaseAmount,
      discountCodes,
      totalDiscountAmount,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
