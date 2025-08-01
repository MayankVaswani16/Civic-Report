import {
    createRouter,
    createRootRoute,
    Route,
    useLocation,
} from '@tanstack/react-router'
import { RouteComponent } from './routes/__root'
import { Home } from './routes/Home'    
import Signup  from './routes/Signup'
import { Outlet } from '@tanstack/react-router'
import Login from './routes/Login'
import Track from './routes/Track'
import Report from './routes/Report'
import AdminPanel from './routes/AdminPanel'
import AdminReportDetail from './routes/AdminReportDetail'

// Root route with conditional layout
const rootRoute = createRootRoute({
    component: () => {
        const location = useLocation()
        // Show layout for all routes except signup
        if (location.pathname === '/signup' || location.pathname === '/login') {
            return <Outlet />
        }
        return <RouteComponent />
    }, 
})

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
})

// Signup route without layout
const signupRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: Signup,
})

const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
})

const reportRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/report',
    component: Report,
})

const trackRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/track',
    component: Track,
})

const adminRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminPanel,
})

const adminReportDetailRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/admin/report/$id',
    component: AdminReportDetail,
})

const routeTree = rootRoute.addChildren([indexRoute, signupRoute, loginRoute, trackRoute, reportRoute, adminRoute, adminReportDetailRoute])

export const router = createRouter({ routeTree })
