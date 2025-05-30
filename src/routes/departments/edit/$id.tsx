import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, Stack, useToast, Spinner, Center } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/departments/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/departments/edit/$id' })
  const [department, setDepartment] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (id) {
      fetchDepartment(id)
    }
  }, [id])

  const fetchDepartment = (departmentId: string) => {
    setIsLoading(true)
    fetch(`https://professor-allocation-raposa-2.onrender.com/departments/${departmentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar departamento')
        }
        return response.json()
      })
      .then((result) => {
        setDepartment(result)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao buscar departamento:', error)
        setIsLoading(false)
        toast({
          title: 'Erro ao carregar departamento!',
          description: 'Não foi possível carregar os dados do departamento.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (department) {
      setIsSaving(true)
      fetch(`https://professor-allocation-raposa-2.onrender.com/departments/${department.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao salvar departamento')
          }

          
          localStorage.setItem('department_updated', 'true')
          
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
        .catch((error) => {
          console.error('Erro ao editar departamento:', error)
          toast({
            title: 'Erro ao salvar departamento!',
            description: 'Ocorreu um erro ao tentar salvar as alterações.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        })
        .finally(() => {
          setIsSaving(false)
        })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDepartment((prev: any) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <Page title="Editar Departamento" rightElement={null}>
        <Center py={10}>
          <Spinner size="xl" />
        </Center>
      </Page>
    )
  }

  if (!department) {
    return (
      <Page title="Editar Departamento" rightElement={null}>
        <Center py={10}>
          <div>Departamento não encontrado</div>
        </Center>
      </Page>
    )
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
              isDisabled={isSaving}
            />
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue"
            isLoading={isSaving}
            loadingText="Salvando..."
          >
            Salvar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/departments' })}
            isDisabled={isSaving}
          >
            Voltar
          </Button>
        </Stack>
      </form>
    </Page>
  )
}