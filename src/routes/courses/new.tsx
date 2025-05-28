import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/courses/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    fetch('https://professor-allocation-raposa-2.onrender.com/Courses', {
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
      .catch((error) => {
        console.error('Erro ao adicionar curso:', error)
        toast({
          title: 'Erro!',
          description: 'Não foi possível adicionar o curso.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
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
              disabled={isLoading}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Salvar
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/courses' })}
            isDisabled={isLoading}
          >
            Voltar
          </Button>
        </VStack>
      </form>
    </Page>
  )
}

export default RouteComponent
