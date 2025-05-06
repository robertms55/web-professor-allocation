import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/courses/new"!</div>
}
