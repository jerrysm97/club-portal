// components/public/GallerySection.tsx
// Data-driven gallery — receives images from parent page.tsx.
// Handles empty state gracefully.

import type { GalleryImage } from '@/types/database'

export default function GallerySection({ gallery }: { gallery: GalleryImage[] }) {
    return (
        <section className="py-24 px-4 bg-[#0D0D0D]">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 06 — Club Life</p>
                <h2 className="font-[var(--font-orbitron)] font-bold text-3xl md:text-4xl text-white mb-12">
                    Gallery
                </h2>

                {gallery.length === 0 ? (
                    /* Empty state */
                    <div className="glass rounded-2xl p-12 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-[#00B4FF]/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-[#00B4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-[var(--font-orbitron)] font-bold text-white text-xl mb-3">
                            Gallery coming soon
                        </h3>
                        <p className="font-[var(--font-exo2)] text-[#8892A4] mb-4">
                            Follow our journey on Instagram for the latest updates.
                        </p>
                        <a href="https://instagram.com/iimscyberclub" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#00B4FF] hover:text-[#00FF9C] font-[var(--font-mono)] text-sm transition-colors">
                            @iimscyberclub →
                        </a>
                    </div>
                ) : (
                    /* Gallery grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {gallery.map((img) => (
                            <div key={img.id} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
                                <img
                                    src={img.image_url}
                                    alt={img.caption || 'Club gallery'}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Hover overlay with caption */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    {img.caption && (
                                        <p className="font-[var(--font-exo2)] text-white text-sm">{img.caption}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
