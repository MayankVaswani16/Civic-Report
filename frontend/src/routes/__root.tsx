import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Outlet } from '@tanstack/react-router'


export function RouteComponent() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />

        </div>
    )
}
