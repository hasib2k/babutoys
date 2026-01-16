"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Login failed');
      } else {
        // store password locally to use as header for admin API
        localStorage.setItem('admin_password', password);
        router.push('/admin/orders');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px 10px' }}
        />
        <button type="submit" style={{ padding: '8px 12px' }} disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
