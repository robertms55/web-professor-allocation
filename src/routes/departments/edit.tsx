import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, FormControl, FormLabel } from '@chakra-ui/react'

// Defina a rota com TanStack Router
export const Route = createFileRoute('/departments/edit')({
  component: EditDepartmentPage,
})

function EditDepartmentPage() {
  // Aqui você precisa pegar o `id` da URL de forma compatível com TanStack Router
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [department, setDepartment] = useState<any>({ name: '' })

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/departments/${id}`)
        .then((response) => response.json())
        .then((data) => setDepartment(data))
        .catch((error) => console.error('Erro ao buscar departamento:', error))
    }
  }, [id])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    fetch(`http://localhost:8080/departments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(department),
    })
      .then(() => {
        navigate('/departments')
      })
      .catch((error) => console.error('Erro ao editar departamento:', error))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepartment({
      ...department,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <h1>Editar Departamento</h1>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="name">Nome do Departamento</FormLabel>
          <Input
            id="name"
            name="name"
            value={department.name}
            onChange={handleChange}
            placeholder="Digite o nome do departamento"
          />
        </FormControl>
        <Button colorScheme="blue" mt={4} type="submit">
          Salvar
        </Button>
      </form>
    </div>
  )
}
