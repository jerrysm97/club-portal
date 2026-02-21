import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FeedPage from '@/app/portal/(protected)/feed/page'

describe('FeedPage Performance Architecture', () => {
    it('renders the generic page shell correctly', async () => {
        // FeedPage is an async Server Component.
        // We pass the required Next.js searchParams Promise.
        const searchParams = Promise.resolve({})

        // Await the Server Component rendering (resolving the props)
        const ui = await FeedPage({ searchParams })

        // Render the resolved UI into JSDOM
        render(ui)

        // Verify key static layout elements exist (ensuring non-blocking parts render fast)
        expect(screen.getByText(/Community/i)).toBeInTheDocument()
        expect(screen.getByText(/Discussions/i)).toBeInTheDocument()
        expect(screen.getByText(/End of Feed Activity/i)).toBeInTheDocument()
    })
})
