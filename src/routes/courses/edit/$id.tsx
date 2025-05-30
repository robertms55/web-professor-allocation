import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, VStack, useToast, Spinner, Center } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/courses/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/courses/edit/$id' })
  const [course, setCourse] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const toast = useToast() 

  useEffect(() => {
    if (id) {
      fetchCourse(id)
    }
  }, [id])

  const fetchCourse = (courseId: string) => {
    setIsLoading(true)
    fetch(`https://professor-allocation-raposa-2.onrender.com/Courses/${courseId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar curso')
        }
        return response.json()
      })
      .then((result) => {
        setCourse(result)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao buscar curso:', error)
        toast({
          title: 'Erro!',
          description: 'Não foi possível carregar os dados do curso.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        setIsLoading(false)
      })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!course?.name?.trim()) {
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

    setIsSubmitting(true)

    fetch(`https://professor-allocation-raposa-2.onrender.com/Courses/${course.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...course, name: course.name.trim() }),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Curso atualizado!',
            description: 'O curso foi alterado com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })

          // Remove o cache para forçar reload da lista
          localStorage.removeItem('coursesCache')
          navigate({ to: '/courses' })
        } else {
          return response.json().then((err) => {
            throw new Error(err.message)
          })
        }
      })
      .catch((error) => {
        console.error('Erro ao editar curso:', error)
        toast({
          title: 'Erro!',
          description: error.message || 'Não foi possível atualizar o curso.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCourse((prev: any) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <Page title="Editar Curso" rightElement={null}>
        <Center py={10}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      </Page>
    )
  }

  if (!course) {
    return (
      <Page title="Editar Curso" rightElement={null}>
        <Center py={10}>
          <div>Curso não encontrado</div>
        </Center>
      </Page>
    )
  }

  return (
    <Page title="Editar Curso" rightElement={null}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel htmlFor="name">Nome do Curso</FormLabel>
            <Input
              id="name"
              name="name"
              value={course.name || ''}
              onChange={handleInputChange}
              placeholder="Digite o nome do curso"
              disabled={isSubmitting}
              maxLength={100}
            />
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            isLoading={isSubmitting}
            loadingText="Salvando..."
          >
            Salvar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/courses' })}
            isDisabled={isSubmitting}
          >
            Voltar
          </Button>
        </VStack>
      </form>
    </Page>
  )
}

export default RouteComponent