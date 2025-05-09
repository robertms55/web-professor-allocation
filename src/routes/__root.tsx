import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import Header from '@/components/header'

export const Route = createRootRoute({
  component: () => (
    <>
      {}
      <Link to="/">
        <Header title="Allocation System" />
      </Link>

      <Outlet />
    </>
  ),
})
