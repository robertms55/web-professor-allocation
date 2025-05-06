import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/departments/new')({
  component: NewDepartmentPage,
})

function NewDepartmentPage() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://localhost:8080/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar departamento')
        return response.json()
      })
      .then(() => {
        navigate({ to: '/departments' }) // Redireciona de volta para a lista
      })
      .catch((error) => {
        console.error(error)
        alert('Erro ao criar departamento')
      })
  }

  return (
    <Page title="Novo Departamento">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nome do Departamento</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Salvar
          </Button>
        </VStack>
      </form>
    </Page>
  )
}
