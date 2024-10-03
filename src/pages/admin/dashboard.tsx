import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/stats?view=orders', {
        method: 'GET',
        headers: {
          'Authorization': sessionStorage.getItem('admin-auth') || '',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await res.json();
      setOrders(data.orders);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': sessionStorage.getItem('admin-auth') || '',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await res.json();
      setStats(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem('admin-auth')) {
      router.push('/admin/login'); 
    } else {
      fetchOrders();
      fetchStats();
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Statistics</h2>
          {stats ? (
            <ul>
              <li>Total Orders: {stats.totalPurchased}</li>
              <li>Total Amount: ${stats.totalAmount.toFixed(2)}</li>
              <li>Total Discount Given: ${stats.totalDiscountAmount.toFixed(2)}</li>
              <li>Discount Codes: {stats.discountCodes.join(', ')}</li>
            </ul>
          ) : (
            <p>Loading stats...</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">All Orders</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order: any) => (
                <li key={order.orderNumber}>
                  Order {order.orderNumber} - Total: ${order.totalAmount} {order.discountedTotal ? `(Discounted: $${order.discountedTotal})` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading orders...</p>
          )}
        </div>
      </div>
    </div>
  );
}
