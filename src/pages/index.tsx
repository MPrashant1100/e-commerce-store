import { useState } from "react";
import Link from "next/link";

interface Item {
  name: string;
  price: number;
  quantity: number;
}

const itemsCatalog: { [key: string]: Item } = {
  item1: { name: "Item 1", price: 100, quantity: 0 },
  item2: { name: "Item 2", price: 200, quantity: 0 },
  item3: { name: "Item 3", price: 300, quantity: 0 },
  item4: { name: "Item 4", price: 400, quantity: 0 },
};

export default function Home() {
  const [cart, setCart] = useState<Item[]>([]);
  const [message, setMessage] = useState("");

  const addItemToCart = async (item: { name: string; price: number }) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      const data = await res.json();

      if (data.success) {
        setCart(data.cart);
        setMessage("Item added to the cart!");
      } else {
        setMessage(data.message || "Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setMessage("Error adding item");
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Simple E-commerce Store
        </h1>

        <div className="flex justify-between mb-6">
          <Link href="/cart">
            <button className="relative bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Cart
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                  {cartItemCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        <div className="flex justify-around mb-6">
          {Object.values(itemsCatalog).map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-200 p-4 rounded-lg shadow-md mb-4"
            >
              <p className="font-bold">{item.name}</p>
              <p className="text-green-600">${item.price}</p>
              <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => addItemToCart(item)}
              >
                {cart.some((cartItem) => cartItem.name === item.name)
                  ? "Item Added"
                  : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
