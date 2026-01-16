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
    return String(o.displayId || o.id).includes(q) || (o.customerName || '').toLowerCase().includes(q) || (o.phone || '').includes(q);
  });

  const totalOrders = orders.length;
  const pendingCount = orders.filter((o: Order) => o.status === 'pending').length;
  const completedCount = orders.filter((o: Order) => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum: number, o: Order) => sum + (Number(o.total) || 0), 0);

  return (
    <div className={adminStyles.adminContainer}>
      <div className={adminStyles.adminHeader}>
        <div className={adminStyles.headerLeft}>
          <div className={adminStyles.adminTitle}>Dashboard</div>
          <div className={adminStyles.adminInfo}>Orders — view and manage incoming orders</div>
        </div>

        <div className={adminStyles.adminSearch}>
          <input className={adminStyles.adminInput} placeholder="Search by id, name, phone" value={query} onChange={e=>setQuery(e.target.value)} />
        </div>

        <div className={adminStyles.adminControls}>
          <div className={adminStyles.controlButtons}>
            {!loggedIn ? (
              <button className="btn" onClick={goToLogin}>Login</button>
            ) : (
              <span>
                <button className="btn secondary" onClick={() => { localStorage.removeItem('admin_password'); setLoggedIn(false); setOrders([]); }}>Logout</button>
                <button className="btn" onClick={fetchOrders}>Refresh</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <div className={adminStyles.statsGrid}>
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statValue}>৳{totalRevenue.toFixed(2)}</div>
          <div className={adminStyles.statLabel}>Total Revenue</div>
        </div>
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statValue}>{totalOrders}</div>
          <div className={adminStyles.statLabel}>Total Orders</div>
        </div>
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statValue}>{pendingCount}</div>
          <div className={adminStyles.statLabel}>Pending</div>
        </div>
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statValue}>{completedCount}</div>
          <div className={adminStyles.statLabel}>Completed</div>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className={adminStyles.ordersList}>
          {filtered.length === 0 && <div>No orders</div>}
          {filtered.map((o: Order) => (
            <div key={o.id} className={`${adminStyles.orderCard} ${o.status === 'pending' ? adminStyles.pendingCard : adminStyles.completedCard}`}>
              <div className={adminStyles.orderThumbnail}>
                <img src={'/toy07.jpg'} alt="product" />
              </div>

              <div className={adminStyles.orderDetails}>
                <div className={adminStyles.orderHeaderRow}>
                  <div>
                    <div className={adminStyles.orderId}>#{o.displayId || o.id}</div>
                    <div className={adminStyles.orderDate}>{o.createdAt}</div>
                  </div>
                  <div className={adminStyles.badge + ' ' + (o.status === 'pending' ? 'pending' : 'completed')}>{o.status}</div>
                </div>

                <div>
                  <div className={adminStyles.orderCustomer}>{o.customerName} • {o.phone}</div>
                  <div className={adminStyles.orderAddress}>{o.address}</div>
                  <div style={{ marginTop: 8, fontWeight: 700 }}>{o.productName}</div>

                  <div className={adminStyles.metaTags}>
                    <div className={adminStyles.metaTag}>Area: {o.area || 'inside'}</div>
                    <div className={adminStyles.metaTag}>Shipping: ৳{o.shipping || 0}</div>
                  </div>
                </div>
              </div>

              <div className={adminStyles.orderRight}>
                <div className={adminStyles.orderDateBox}>
                  <div className="dateMain">{String(o.createdAt || '').split(',')[0]}</div>
                  <div className="dateTime">{String(o.createdAt || '').split(',')[1]}</div>
                </div>

                <div className={adminStyles.orderPriceBox}>
                  <div className="price">৳{Number(o.total || 0).toFixed(2)}</div>
                  <div className="qty">Qty: {o.quantity}</div>
                </div>

                <div className={adminStyles.orderActions}>
                  {o.status !== 'completed' ? (
                    <button className={`${adminStyles.actionBtn} ${adminStyles.complete}`} onClick={async () => {
                      try {
                        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
                        const stored = localStorage.getItem('admin_password'); if (stored) headers['x-admin-password']=stored;
                        await fetch('/api/admin/orders', { method: 'POST', headers, body: JSON.stringify({ id: o.id, action: 'complete' }) });
                        fetchOrders();
                      } catch (e) { setError('Action failed'); }
                    }}>
                      <svg className="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{marginRight:6}}>
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Mark as Delivered
                    </button>
                  ) : (
                    <button className={`${adminStyles.actionBtn} ${adminStyles.pending}`} onClick={async () => {
                      try {
                        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
                        const stored = localStorage.getItem('admin_password'); if (stored) headers['x-admin-password']=stored;
                        await fetch('/api/admin/orders', { method: 'POST', headers, body: JSON.stringify({ id: o.id, action: 'pending' }) });
                        fetchOrders();
                      } catch (e) { setError('Action failed'); }
                    }}>
                      <svg className="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{marginRight:6}}>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Mark as Pending
                    </button>
                  )}
                  <button className={`${adminStyles.actionBtn} ${adminStyles.delete}`} onClick={async () => {
                    if (!confirm('Delete this order?')) return;
                    try {
                      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
                      const stored = localStorage.getItem('admin_password'); if (stored) headers['x-admin-password']=stored;
                      await fetch('/api/admin/orders', { method: 'POST', headers, body: JSON.stringify({ id: o.id, action: 'delete' }) });
                      fetchOrders();
                    } catch (e) { setError('Action failed'); }
                  }}>
                    <svg className="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{marginRight:6}}>
                      <path d="M3 6h18M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
