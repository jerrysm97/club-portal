// components/public/GallerySection.tsx — IIMS Collegiate Public Gallery
'use client'
import { useState } from 'react'
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react'

// Define local GalleryImage type as it's not in the central database types
export interface GalleryImage {
    id: string
    url?: string
    image_url?: string
    caption?: string
    created_at?: string
}

export default function GallerySection({ images }: { images: GalleryImage[] }) {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-poppins text-sm font-bold tracking-wider uppercase mb-6">
                        <ImageIcon className="h-4 w-4" />
                        <span>Digital Archive</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#111827]">
                        Visual <span className="text-[#C3161C]">Records</span>
                    </h2>
                </div>

                {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img, index) => (
                            <div
                                key={img.id}
                                onClick={() => setSelectedImage(img)}
                                className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer border border-[#F3F4F6] bg-gray-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <img
                                    src={img.url || img.image_url || ''}
                                    alt={img.caption || 'Gallery Image'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#58151C]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-md mb-3">
                                        <ZoomIn className="h-6 w-6 text-white" />
                                    </div>
                                    {img.caption && (
                                        <p className="text-white text-xs font-bold leading-tight line-clamp-2">
                                            {img.caption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border-2 border-dashed border-[#E5E7EB] p-20 text-center bg-gray-50">
                        <ImageIcon className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
                        <p className="font-poppins font-bold text-[#4B5563] text-xl">No photographic records found.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-[#58151C]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-up"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                    >
                        <X className="h-10 w-10" />
                    </button>

                    <div className="max-w-5xl w-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                        <div className="relative group w-full">
                            <img
                                src={selectedImage.url || selectedImage.image_url || ''}
                                alt={selectedImage.caption || ''}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 transition-transform"
                            />
                        </div>
                        {selectedImage.caption && (
                            <div className="bg-white/10 backdrop-blur-xl py-3 px-8 rounded-2xl border border-white/10 shadow-lg">
                                <p className="font-poppins font-bold text-white text-lg">
                                    {selectedImage.caption}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
