import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/courses/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  // Limpa o formulário ao montar o componente
  useEffect(() => {
    setName('')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: 'Erro de validação!',
        description: 'Por favor, digite o nome do curso.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    setIsLoading(true)

    fetch('https://professor-allocation-raposa-2.onrender.com/Courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
      .then((res) => {
        if (res.ok) {
          toast({
            title: 'Curso cadastrado!',
            description: 'O novo curso foi adicionado com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
          
          // Remove o cache dos cursos - mesma lógica da alocação
          localStorage.removeItem('coursesCache')
          navigate({ to: '/courses' })
        } else {
          return res.json().then((err) => {
            throw new Error(err.message)
          })
        }
      })
      .catch((error) => {
        console.error('Erro ao adicionar curso:', error)
        toast({
          title: 'Erro!',
          description: error.message || 'Não foi possível adicionar o curso.',
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
    <Page title="Novo Curso" rightElement={null}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nome do Curso</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do curso"
              disabled={isLoading}
              maxLength={100}
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="blue" 
            isLoading={isLoading}
            loadingText="Salvando..."
          >
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