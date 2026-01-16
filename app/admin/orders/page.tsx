"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import adminStyles from '../Admin.module.css';

type Order = any;

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const headers: Record<string,string> = {};
      const stored = (typeof window !== 'undefined') ? localStorage.getItem('admin_password') : null;
      const pwd = stored || password;
      if (pwd) headers['x-admin-password'] = pwd;
      const res = await fetch('/api/admin/orders', { headers });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Failed to load orders');
        setOrders([]);
      } else {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin_password');
      if (stored) {
        setPassword(stored);
        setLoggedIn(true);
      }
    }
    fetchOrders();
  }, []);

  const goToLogin = () => router.push('/admin/login');

  const filtered = orders.filter((o: Order) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return String(o.id).includes(q) || (o.customerName || '').toLowerCase().includes(q) || (o.phone || '').includes(q);
  });

  return (
    <div className={adminStyles.adminContainer}>
      <div className={adminStyles.adminHeader}>
        <div>
          <div className={adminStyles.adminTitle}>Orders Dashboard</div>
          <div style={{ color: '#666', fontSize: 13 }}>Live orders — view and manage your orders</div>
        </div>
        <div className={adminStyles.adminControls}>
          <input className={adminStyles.adminInput} placeholder="Search by id, name, phone" value={query} onChange={e=>setQuery(e.target.value)} />
          {!loggedIn ? (
            <button className="btn" onClick={goToLogin}>Login</button>
          ) : (
            <>
              <button className="btn secondary" onClick={() => { localStorage.removeItem('admin_password'); setLoggedIn(false); setOrders([]); }}>Logout</button>
              <button className="btn" onClick={fetchOrders}>Refresh</button>
            </>
          )}
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className={adminStyles.ordersList}>
          {filtered.length === 0 && <div>No orders</div>}
          {filtered.map((o: Order) => (
            <div key={o.id} className={adminStyles.orderCard}>
              <div className={adminStyles.orderTop}>
                <div className={adminStyles.orderId}>#{o.id}</div>
                <div className={adminStyles.orderDate}>{o.createdAt}</div>
              </div>
              <div className={adminStyles.orderCustomer}>{o.customerName} • {o.phone}</div>
              <div className={adminStyles.orderAddress}>{o.address}</div>
              <div style={{ marginTop: 8 }}><strong>{o.productName}</strong></div>
              <div className={adminStyles.orderMeta}>
                <div>Qty: {o.quantity} · ৳{o.total}</div>
                <div className={`${adminStyles.badge} ${o.status === 'pending' ? 'pending' : 'completed'}`}>{o.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
