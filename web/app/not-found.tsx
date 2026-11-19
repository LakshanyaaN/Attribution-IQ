import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="text-6xl font-extrabold font-editorial italic text-slate-900 mb-2">404</div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 mb-6">The page or model you are looking for does not exist in AttributionIQ.</p>
      <Link href="/" className="px-5 py-2.5 bg-[#0D5C3A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#08422A] transition-all shadow-md">
        Return to Overview
      </Link>
    </div>
  );
}
