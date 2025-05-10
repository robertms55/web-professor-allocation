import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import Header from '@/components/header'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header title={
        <Link to="/" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          Allocation System
        </Link>
      } />
      
      <Outlet />
    </>
  ),
})