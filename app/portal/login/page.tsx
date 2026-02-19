// app/portal/login/page.tsx — Login page wrapper with Suspense
// Standalone page — NOT wrapped by portal layout.
import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
