// components/public/GallerySection.tsx
// Data-driven gallery — Stealth Terminal with terminal empty state.

import type { GalleryImage } from '@/types/database'

export default function GallerySection({ gallery }: { gallery: GalleryImage[] }) {
    return (
        <section className="py-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3 uppercase">{'>'} 06_GALLERY</p>
                <h2 className="font-[var(--font-mono)] font-bold text-3xl md:text-4xl text-[#F8FAFC] mb-12">
                    Gallery
                </h2>

                {gallery.length === 0 ? (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-md p-12 text-center max-w-lg mx-auto">
                        <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3">{'>'} GALLERY_EMPTY</p>
                        <p className="text-[#A1A1AA] text-sm">Images coming soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gallery.map((img) => (
                            <div key={img.id} className="relative h-64 rounded-md overflow-hidden group bg-[#09090B] border border-[#27272A] hover:border-[#10B981] transition-colors duration-200">
                                <img src={img.image_url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" />
                                {img.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                        <p className="text-[#F8FAFC] text-sm">{img.caption}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
