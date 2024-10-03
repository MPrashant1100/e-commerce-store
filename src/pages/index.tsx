// pages/index.tsx
import { useState, useEffect } from 'react';
import { Item, CartItem, Order } from '../lib/store';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchItems();
    fetchCart();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data);
  };

  const fetchCart = async () => {
    const res = await fetch('/api/cart/get');
    const data = await res.json();
    setCart(data);
  };

  const addToCart = async (itemId: string) => {
    await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity: 1 }),
    });
    fetchCart();
  };

  const checkout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discountCode }),
    });
    const data: Order = await res.json();
    setOrder(data);
    fetchCart();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">E-commerce Store</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} - ${item.price}</span>
                <button
                  onClick={() => addToCart(item.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="mb-2">
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Discount Code"
              className="border p-2 mr-2"
            />
            <button
              onClick={checkout}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {order && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p>Order ID: {order.id}</p>
          <p>Total: ${order.total}</p>
          {order.discountAmount && (
            <p>Discount Applied: ${order.discountAmount}</p>
          )}
        </div>
      )}
    </div>
  );
}