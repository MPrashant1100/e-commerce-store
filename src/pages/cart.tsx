import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Item {
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Item[]>([]);
  const [message, setMessage] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        setCart(data.cart || []);
        calculateTotal(data.cart || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setMessage('Error loading cart data.');
      }
    };

    fetchCart();
  }, []);

  // Calculate total amount and discount
  const calculateTotal = (cartItems: Item[]) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isDiscountEligible = cartItems.length >= 1 && cartItems.length % 3 === 0; 
    const discount = isDiscountEligible ? total * 0.1 : 0; 

    setTotalAmount(total);
    setDiscountAmount(discount);
    setDiscountApplied(isDiscountEligible);
    setDiscountCode(isDiscountEligible ? `DISCOUNT-${totalAmount}` : null);
  };

  // Handle checkout
  const checkout = async () => {
    if (cart.length === 0) {
      setMessage('There is nothing to checkout.');
      return;
    }

    const res = await fetch('/api/cart?action=checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data.success) {
      const successMessage = data.discountApplied
        ? `Order successfully placed! Total after discount: $${data.totalAmount.toFixed(2)} (10% discount applied)`
        : `Order successfully placed! Total: $${data.totalAmount.toFixed(2)}`;

      setMessage(successMessage);
      setCart([]); 
    } else {
      setMessage('Error during checkout, please try again.');
    }
  };

  // Go back to home page
  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {/* Cart items */}
        <div className="mb-6">
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {/* Show total amount and discount information */}
        {cart.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between py-2">
              <span className="font-bold">Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {discountApplied ? (
              <>
                <div className="flex justify-between py-2">
                  <span className="font-bold">Discount Applied (10%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-green-600">
                  <span>Amount to Pay:</span>
                  <span>${(totalAmount - discountAmount).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-2">
                  <span className="font-bold">Discount:</span>
                  <span className="text-gray-400">No discount available</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-green-600">
                  <span>Amount to Pay:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        )}

        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          onClick={checkout}
        >
          Checkout
        </button>

        {message && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
            <p>{message}</p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={goHome}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
