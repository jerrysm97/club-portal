// components/ui/MarkdownRenderer.tsx — Render Markdown content safely
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-invert prose-sm max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => <h1 className="font-mono text-xl font-bold text-[#F8FAFC] mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="font-mono text-lg font-bold text-[#F8FAFC] mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="font-mono text-base font-bold text-[#F8FAFC] mb-1">{children}</h3>,
                    p: ({ children }) => <p className="text-[#A1A1AA] text-sm mb-3 leading-relaxed">{children}</p>,
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:underline">
                            {children}
                        </a>
                    ),
                    code: ({ children, className: codeClass }) => {
                        const isBlock = codeClass?.includes('language-')
                        if (isBlock) {
                            return (
                                <pre className="bg-black border border-[#27272A] rounded-sm p-3 overflow-x-auto my-3">
                                    <code className="font-mono text-xs text-[#10B981]">{children}</code>
                                </pre>
                            )
                        }
                        return <code className="font-mono text-xs bg-[#27272A] text-[#10B981] px-1 py-0.5 rounded-sm">{children}</code>
                    },
                    pre: ({ children }) => <>{children}</>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-[#A1A1AA] text-sm space-y-1 mb-3">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-[#A1A1AA] text-sm space-y-1 mb-3">{children}</ol>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-[#10B981] pl-3 text-[#A1A1AA] italic my-3">{children}</blockquote>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-3">
                            <table className="w-full text-sm text-[#A1A1AA] border-collapse">{children}</table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-[#27272A] px-3 py-1.5 text-left font-mono text-[#F8FAFC] bg-[#111113]">{children}</th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-[#27272A] px-3 py-1.5">{children}</td>
                    ),
                    hr: () => <hr className="border-t border-[#27272A] my-4" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
