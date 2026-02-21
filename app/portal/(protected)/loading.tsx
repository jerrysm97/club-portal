import { Loader2 } from 'lucide-react'

export default function PortalLoading() {
    return (
        <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-4 animate-fade-in opacity-50">
            <div className="p-4 rounded-full bg-white shadow-sm border border-[#E0E0E0] shadow-[#111111]/5">
                <Loader2 className="h-6 w-6 text-[#111111] animate-spin" />
            </div>
            <p className="text-xs font-bold text-[#9E9E9E] uppercase tracking-widest">Accessing Secure Records...</p>
        </div>
    )
}
