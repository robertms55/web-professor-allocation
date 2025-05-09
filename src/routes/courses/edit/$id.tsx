import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/courses/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/courses/edit/$id' })
  const [course, setCourse] = useState<any | null>(null)
  const navigate = useNavigate()
  const toast = useToast()  // Hook do Chakra para mostrar toasts

  useEffect(() => {
    if (id) {
      fetchCourse(id)
    }
  }, [id])

  const fetchCourse = (courseId: string) => {
    fetch(`http://localhost:8080/Courses/${courseId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar curso')
        }
        return response.json()
      })
      .then((result) => setCourse(result))
      .catch((error) => console.error('Erro ao buscar curso:', error))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (course) {
      fetch(`http://localhost:8080/Courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao salvar curso')
          }

        
          toast({
            title: 'Curso atualizado!',
            description: 'O curso foi alterado com sucesso.',
            status: 'success',
            duration: 1000,
            isClosable: true,
            position: 'top-right',
          })

          // Redireciona após 1s
          setTimeout(() => {
            navigate({ to: '/courses' })
          }, 100)
        })
        .catch((error) => console.error('Erro ao editar curso:', error))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCourse((prev: any) => ({ ...prev, [name]: value }))
  }

  if (!course) {
    return <div>Carregando...</div>
  }

  return (
    <Page title="Editar Curso" rightElement={null}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input
              id="name"
              name="name"
              value={course.name}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            Salvar
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/courses' })}>
                      Voltar
                    </Button>
        </Stack>
      </form>
    </Page>
  )
}
