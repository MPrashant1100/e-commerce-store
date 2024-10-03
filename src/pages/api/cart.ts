import { NextApiRequest, NextApiResponse } from "next";

interface Item {
  name: string;
  price: number;
  quantity: number;
}

let cart: Item[] = [];
let orders: {
  orderNumber: number;
  items: Item[];
  totalAmount: number;
  discountedTotal: number | null;
}[] = [];
let nextOrderNumber = 1;
const NTH_ORDER_FOR_DISCOUNT = 3;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Add item to the cart
  if (method === "POST" && req.body && !req.query.action) {
    const { name, price }: { name: string; price: number } = req.body;

    // Find if the item is already in the cart
    const existingItemIndex = cart.findIndex((item) => item.name === name);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    return res
      .status(200)
      .json({ success: true, message: "Item added to the cart", cart });
  }

  // Checkout action
  if (method === "POST" && req.query.action === "checkout") {
    if (cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    let discountedTotal = totalAmount;
    let discountApplied = false;

    // Apply discount on every nth order
    if (nextOrderNumber % NTH_ORDER_FOR_DISCOUNT === 0) {
      discountedTotal = totalAmount * 0.9;
      discountApplied = true;
    }

    // Save the order
    orders.push({
      orderNumber: nextOrderNumber,
      items: [...cart],
      totalAmount,
      discountedTotal: discountApplied ? discountedTotal : null,
    });

    const newDiscountCode = discountApplied
      ? `DISCOUNT-${nextOrderNumber}`
      : null;

    cart = [];
    nextOrderNumber++;

    return res.status(200).json({
      success: true,
      totalAmount: discountedTotal,
      discountApplied,
      newDiscountCode,
      message: discountApplied
        ? "Order placed with discount!"
        : "Order placed without discount!",
    });
  }

  if (method === "GET") {
    return res.status(200).json({ success: true, cart });
  }

  return res.status(400).json({ success: false, message: "Invalid request" });
}
