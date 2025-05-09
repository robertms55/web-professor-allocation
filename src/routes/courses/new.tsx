import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/courses/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch('http://localhost:8080/Courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        toast({
          title: 'Curso cadastrado!',
          description: 'O novo curso foi adicionado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right', 
        })
        navigate({ to: '/courses' })
      })
      .catch((error) => console.error('Erro ao adicionar curso:', error))
  }

  return (
    <Page title="Novo Curso">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nome do Curso</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Salvar
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/courses' })}>
            Voltar
          </Button>
        </VStack>
      </form>
    </Page>
  )
}
