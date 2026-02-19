// components/public/GallerySection.tsx — Stealth Terminal Gallery
'use client'

import { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'
import type { GalleryImage } from '@/types/database'

export default function GallerySection({ images }: { images: GalleryImage[] }) {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

    return (
        <section className="py-24 bg-black border-b border-[#27272A]">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-mono font-bold text-[#F8FAFC] mb-12 text-center">
                    Visual <span className="text-[#10B981]">Records</span>
                </h2>

                {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => setSelectedImage(img)}
                                className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer border border-[#27272A] hover:border-[#10B981]/50 transition-colors"
                            >
                                <img
                                    src={img.url || img.image_url || ''}
                                    alt={img.caption || 'Gallery Image'}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="h-8 w-8 text-[#10B981]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-[#52525B] font-mono">No visual records found in database.</p>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div className="max-w-4xl max-h-[90vh] w-full relative" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage.url || selectedImage.image_url || ''}
                            alt={selectedImage.caption || ''}
                            className="w-full h-auto max-h-[85vh] object-contain rounded-sm border border-[#27272A]"
                        />
                        {selectedImage.caption && (
                            <p className="font-mono text-center text-[#A1A1AA] mt-4 bg-black/50 py-2 px-4 rounded-full inline-block">
                                {selectedImage.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
