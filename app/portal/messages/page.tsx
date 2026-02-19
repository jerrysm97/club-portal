// app/portal/messages/page.tsx — IIMS Collegiate Messaging Placeholder
import { MessageSquare, ShieldCheck } from 'lucide-react'

export default function MessagesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-white/50 backdrop-blur-sm animate-fade-up">
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-[#58151C]/10 rounded-full blur-2xl scale-150 group-hover:scale-[2] transition-transform duration-700 pointer-events-none" />
                <div className="relative p-6 rounded-3xl bg-white shadow-2xl border border-gray-100 group-hover:rotate-12 transition-transform h-24 w-24 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-[#C3161C]" />
                </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#10B981]/5 text-[#10B981] font-black text-[10px] uppercase tracking-[0.2em] mb-4 border border-[#10B981]/10">
                <ShieldCheck className="h-3 w-3" /> Secure Gateway Ready
            </div>

            <h2 className="text-3xl font-poppins font-black text-[#111827] mb-4">
                Sector Communications
            </h2>
            <p className="text-gray-400 font-medium text-base max-w-sm leading-relaxed">
                Select an operative from the mission roster to establish a point-to-point encrypted session.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 opacity-20 filter grayscale">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 w-12 bg-[#58151C] rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
            </div>
        </div>
    )
}
