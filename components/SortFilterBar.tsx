'use client';
import { useEffect, useState } from 'react';

export default function SortFilterBar({ onChange }:{ onChange:(s:{q:string; sort:'nearby'|'discount'|'new'; openNow:boolean})=>void }){
  const [q,setQ] = useState('');
  const [sort,setSort] = useState<'nearby'|'discount'|'new'>('nearby');
  const [openNow,setOpenNow] = useState(false);

  useEffect(()=>{ onChange({ q, sort, openNow }); }, [q,sort,openNow,onChange]);

  return (
    <div className="card sticky top-2 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5">
      <div className="grid lg:grid-cols-3 gap-3 items-center">
        <input className="input" placeholder="Search restaurants, streets, deals…" value={q} onChange={e=>setQ(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={()=>setSort('nearby')}   className={`btn-ghost ${sort==='nearby'?'ring-1 ring-white/30':''}`}>Nearby</button>
          <button onClick={()=>setSort('discount')} className={`btn-ghost ${sort==='discount'?'ring-1 ring-white/30':''}`}>Best discount</button>
          <button onClick={()=>setSort('new')}      className={`btn-ghost ${sort==='new'?'ring-1 ring-white/30':''}`}>Newest</button>
        </div>
        <label className="inline-flex items-center gap-2 justify-self-end">
          <input type="checkbox" checked={openNow} onChange={e=>setOpenNow(e.target.checked)} />
          <span className="text-sm">Open now</span>
        </label>
      </div>
    </div>
  );
}
