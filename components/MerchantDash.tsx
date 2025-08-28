'use client';
import { useState } from 'react';
import MapPicker from '@/components/MapPicker';
import { useRouter } from 'next/navigation';

export default function MerchantDash({ restaurants, deals }:{ restaurants:any[]; deals:any[] }) {
  const router = useRouter();

  // add restaurant
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pos, setPos] = useState<{lat:number,lng:number}|null>(null);
  const [msg, setMsg] = useState('');

  // add deal
  const [rId, setRId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [pct, setPct] = useState(30);
  const [duration, setDuration] = useState(120);

  async function createRestaurant(){
    const res = await fetch('/api/merchant/restaurant', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, address, lat: pos?.lat, lng: pos?.lng })
    });
    const data = await res.json();
    setMsg(res.ok ? 'Restaurant created!' : (data.error || 'Error'));
    router.refresh();
  }

  async function createDeal(){
    const res = await fetch('/api/merchant/deal', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ restaurantId: rId || restaurants?.[0]?.id, title, description: desc, discountPercent: pct })
    });
    if (res.ok) { setTitle(''); setDesc(''); router.refresh(); }
  }

  async function activate(id:string){
    const res = await fetch('/api/merchant/activate', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ dealId: id, durationMinutes: duration })
    });
    if (res.ok) router.refresh();
  }
  async function deactivate(id:string){
    await fetch('/api/merchant/deactivate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ dealId:id }) });
    router.refresh();
  }

  return (
    <main className="grid gap-4">
      <div className="card">
        <h1 className="text-xl font-semibold">Merchant Console</h1>
        <p className="text-white/70 text-sm">Add restaurants, create deals, activate them and generate QR codes.</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Add Restaurant</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Street address" value={address} onChange={e=>setAddress(e.target.value)} />
        </div>
        <div className="mt-3"><MapPicker value={pos} onChange={(p) => setPos(Array.isArray(p) ? {lat: p[0], lng: p[1]} : p)} format="object" /></div>
        <button className="btn mt-3" onClick={createRestaurant} disabled={!name || !address || !pos}>Create</button>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Create Deal</h2>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <select className="input" value={rId} onChange={e=>setRId(e.target.value)}>
            <option value="">Select restaurant</option>
            {restaurants.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input md:col-span-2" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <div><span className="text-xs">Discount %</span><input className="input" type="number" value={pct} onChange={e=>setPct(Number(e.target.value||30))} /></div>
        </div>
        <button className="btn mt-3" onClick={createDeal} disabled={!title || (!rId && !restaurants?.length)}>Create Deal</button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Your Deals</h2>
          <div><span className="text-xs">Default duration (min)</span><input className="input" type="number" value={duration} onChange={e=>setDuration(Number(e.target.value||120))} /></div>
        </div>
        {deals.length === 0 ? <p>No deals yet.</p> : (
          <div className="grid gap-3">
            {deals.map(d => (
              <div key={d.id} className="border border-white/10 rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.title} <span className="badge">{d.discountPercent}%</span></div>
                    <div className="text-sm text-white/60">{restaurants.find(r=>r.id===d.restaurantId)?.name}</div>
                    <div className="text-xs text-white/50">{d.isActive ? `Active until ${d.expiresAt ? new Date(d.expiresAt).toLocaleTimeString() : ''}` : 'Inactive'}</div>
                  </div>
                  <div className="flex gap-2">
                    {d.isActive ? (
                      <>
                        <a className="btn-ghost" href={`/redeem/${d.id}`}>Get QR</a>
                        <button className="btn" onClick={()=>deactivate(d.id)}>Turn Off</button>
                      </>
                    ) : (
                      <button className="btn" onClick={()=>activate(d.id)}>Turn On</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
