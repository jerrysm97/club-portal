export default function MessagesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="p-4 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                <svg className="h-8 w-8 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Secure Channel Ready</h2>
            <p className="text-[#A1A1AA] font-mono text-sm max-w-md">
                Select an operative from the list to establish encrypted communication uplink.
            </p>
        </div>
    )
}
