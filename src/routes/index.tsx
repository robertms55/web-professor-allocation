import { createFileRoute } from '@tanstack/react-router'
import { Heading } from '@chakra-ui/react'
import Hero from '@/components/hero'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="App">
      <Hero
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        imageURL="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subtitle="Use everywhere"
        title="Allocation"
      >
        <Heading>Test...</Heading>
      </Hero>
    </div>
  )
}
