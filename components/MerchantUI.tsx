'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MerchantUI({ restaurant, deals }: { restaurant:any, deals:any[] }) {
  const router = useRouter();
  const [discount, setDiscount] = useState(30);
  const [duration, setDuration] = useState(120);
  const [title, setTitle] = useState('Happy Hour');
  const [desc, setDesc] = useState('');

  if (!restaurant) {
    return (
      <main className="grid gap-4">
        <div className="card"><h1 className="text-xl font-semibold">Welcome</h1><p className="text-white/70">Let’s onboard your restaurant.</p></div>
        <Link href={"/merchant/onboarding" as any} className="btn w-fit">Start Onboarding</Link>
      </main>
    );
  }

  async function createDeal() {
    const res = await fetch('/api/merchant/deal', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title, description: desc, discountPercent: discount })
    });
    if (res.ok) { toast.success('Deal created'); router.refresh(); } else toast.error('Failed to create');
  }

  async function activate(id:string, dur:number=duration) {
    const res = await fetch('/api/merchant/activate', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ dealId: id, durationMinutes: dur })
    });
    const data = await res.json();
    if (data.ok) { toast.success('Deal activated'); router.refresh(); } else toast.error('Activation failed');
  }

  async function extend(id:string, extraMin:number=30) { await activate(id, extraMin); }
  async function deactivate(id:string) {
    await fetch('/api/merchant/deactivate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ dealId: id }) });
    toast('Turned off'); router.refresh();
  }

  return (
    <main className="grid gap-4">
      <div className="card">
        <h1 className="text-xl font-semibold mb-1">{restaurant.name}</h1>
        <p className="text-white/70 text-sm">{restaurant.address}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Create a deal</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input md:col-span-2" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <input className="input" type="number" min={5} max={90} value={discount} onChange={e=>setDiscount(Number(e.target.value||30))} />
        </div>
        <button className="btn mt-3" onClick={createDeal}>Create deal</button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Your deals</h2>
          <div className="flex gap-3 items-end">
            <label className="text-xs">Activate for (min)</label>
            <input className="input w-24" type="number" value={duration} onChange={e=>setDuration(Number(e.target.value||120))} />
          </div>
        </div>
        {deals.length === 0 ? <p>No deals yet.</p> : (
          <div className="grid gap-3">
            {deals.map((d:any) => (
              <div key={d.id} className="border border-white/10 rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.title} <span className="badge">{d.discountPercent}%</span></div>
                    <div className="text-sm text-white/60">
                      {d.isActive ? `Active${d.expiresAt ? ` until ${new Date(d.expiresAt).toLocaleTimeString()}` : ''}` : 'Inactive'}
                      {typeof d.redemptionsCount === 'number' ? ` • ${d.redemptionsCount} redemptions` : ''}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {d.isActive ? (
                      <>
                        <button className="btn-ghost" onClick={()=>extend(d.id, 30)}>Extend +30m</button>
                        <Link className="btn-ghost" href={`/redeem/${d.id}`} title="Preview QR">Preview QR</Link>
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
