import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/departments/new')({
  component: NewDepartmentPage,
})

function NewDepartmentPage() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)

    fetch('https://professor-allocation-raposa-2.onrender.com/departments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ name }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar departamento')
        return response.json()
      })
      .then(() => {
  
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName)
            })
          })
        }
        

        navigate({ 
          to: '/departments',
          replace: true
        })
      })
      .catch((error) => {
        console.error(error)
        alert('Erro ao criar departamento')
        setIsLoading(false)
      })
  }

  return (
    <Page title="Novo Departamento" rightElement={null}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nome do Departamento</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome"
              disabled={isLoading}
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Salvando..."
            disabled={isLoading}
          >
            Salvar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/departments' })}
            disabled={isLoading}
          >
            Voltar
          </Button>
        </VStack>
      </form>
    </Page>
  )
}