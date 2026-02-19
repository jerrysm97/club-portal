// components/public/GallerySection.tsx
import type { GalleryImage } from '@/types/database'

interface Props { images: GalleryImage[] }

export default function GallerySection({ images }: Props) {
    return (
        <section id="gallery" className="py-28 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Gallery</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">Moments</h2>
                </div>

                {images.length === 0 ? (
                    <div className="bg-[#F8FAFC] rounded-2xl p-16 text-center border border-[#E2E8F0]">
                        <div className="text-4xl mb-4">📸</div>
                        <p className="text-[#64748B] font-medium">Gallery images will appear here once uploaded.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-xl transition-shadow duration-300">
                                <img src={img.image_url} alt={img.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {img.caption && (
                                    <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <p className="text-white text-sm font-medium">{img.caption}</p>
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
