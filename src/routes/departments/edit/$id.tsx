import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/departments/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/departments/edit/$id' })
  const [department, setDepartment] = useState<any | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (id) {
      fetchDepartment(id)
    }
  }, [id])

  const fetchDepartment = (departmentId: string) => {
    fetch(`http://localhost:8080/departments/${departmentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar departamento')
        }
        return response.json()
      })
      .then((result) => setDepartment(result))
      .catch((error) => console.error('Erro ao buscar departamento:', error))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (department) {
      fetch(`http://localhost:8080/departments/${department.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao salvar departamento')
          }

          toast({
            title: 'Departamento atualizado!',
            description: 'O departamento foi alterado com sucesso.',
            status: 'success',
            duration: 1000,
            isClosable: true,
            position: 'top-right',
          })

          setTimeout(() => {
            navigate({ to: '/departments' })
          }, 100)
        })
        .catch((error) => console.error('Erro ao editar departamento:', error))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDepartment((prev: any) => ({ ...prev, [name]: value }))
  }

  if (!department) {
    return <div>Carregando...</div>
  }

  return (
    <Page title="Editar Departamento" rightElement={null}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input
              id="name"
              name="name"
              value={department.name}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            Salvar
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/departments' })}>
            Voltar
          </Button>
        </Stack>
      </form>
    </Page>
  )
}
