// components/public/GallerySection.tsx — Premium minimal
import type { GalleryImage } from '@/types/database'

interface Props { images: GalleryImage[] }

export default function GallerySection({ images }: Props) {
    return (
        <section id="gallery" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold text-[#6366F1] uppercase tracking-wider mb-2">Gallery</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-12">Moments</h2>

                {images.length === 0 ? (
                    <div className="bg-[#FAFAFA] rounded-xl p-12 text-center border border-[#E5E7EB]">
                        <p className="text-[#6B7280]">Gallery images will appear here once uploaded.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-[4/3]">
                                <img src={img.image_url} alt={img.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {img.caption && (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white text-sm">{img.caption}</p>
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
