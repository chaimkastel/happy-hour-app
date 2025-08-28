export default function SkeletonCard(){
  return (
    <div className="card animate-pulse">
      <div className="h-4 w-40 bg-white/10 rounded mb-2" />
      <div className="h-3 w-56 bg-white/10 rounded mb-1" />
      <div className="h-3 w-24 bg-white/10 rounded" />
    </div>
  );
}
