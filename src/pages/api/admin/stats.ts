import { NextApiRequest, NextApiResponse } from "next";

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderNumber: number;
  items: Item[];
  totalAmount: number;
  discountedTotal: number | null;
  createdAt: string;
}

let orders: Order[] = [];

const isAdmin = (req: NextApiRequest) => {
  // For the sake of this example, use a static check or header value (replace with actual auth mechanism)
  return req.headers.authorization === "Basic YWRtaW46cGFzc3dvcmQ="; // admin:password
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // If request is a GET request, provide order stats
  if (req.method === "GET") {
    if (!isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const totalPurchased = orders.length;
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalDiscountAmount = orders
      .filter((order) => order.discountedTotal !== null)
      .reduce(
        (sum, order) =>
          sum + (order.totalAmount - (order.discountedTotal || 0)),
        0
      );

    const discountCodes = orders
      .filter((order) => order.discountedTotal !== null)
      .map((order) => `DISCOUNT-${order.orderNumber}`);

    return res.status(200).json({
      totalPurchased,
      totalAmount,
      totalDiscountAmount,
      discountCodes,
    });
  }

  // View All Orders
  if (req.method === "GET" && req.query.view === "orders") {
    if (!isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({ success: true, orders });
  }

  // View specific Order
  if (req.method === "GET" && req.query.view === "order") {
    if (!isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const orderNumber = parseInt(req.query.orderNumber as string, 10);
    const order = orders.find((o) => o.orderNumber === orderNumber);

    if (order) {
      return res.status(200).json({ success: true, order });
    }

    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (req.method === "POST") {
    const { items, totalAmount, discountedTotal } = req.body;

    if (!items || !totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    const orderNumber = orders.length + 1;
    const newOrder: Order = {
      orderNumber,
      items,
      totalAmount,
      discountedTotal,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return res
      .status(201)
      .json({ success: true, message: "Order added", orderNumber });
  }

  return res
    .status(400)
    .json({ success: false, message: "Invalid request method" });
}
