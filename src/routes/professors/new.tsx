import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, Select, VStack, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/professors/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [departmentId, setDepartmentId] = useState<number | string>('') // Inicialmente vazio
  const [departments, setDepartments] = useState<any[]>([]) // Estado para armazenar os departamentos
  const navigate = useNavigate()
  const toast = useToast()

  // Função para buscar os departamentos disponíveis
  useEffect(() => {
    fetch('http://localhost:8080/departments') // Alterar para a URL da sua API de departamentos
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error('Erro ao buscar departamentos:', error))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!departmentId) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione um departamento.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    const professorData = {
      name,
      cpf,
      departmentId: parseInt(departmentId.toString()), // Garantir que o ID seja numérico
    }

    fetch('http://localhost:8080/professors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professorData),
    })
      .then(() => {
        toast({
          title: 'Professor cadastrado!',
          description: 'O novo professor foi adicionado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        navigate({ to: '/professors' })
      })
      .catch((error) => {
        console.error('Erro ao adicionar professor:', error)
        toast({
          title: 'Erro!',
          description: 'Não foi possível adicionar o professor.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
  }

  return (
    <Page title="Novo Professor">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Nome do Professor</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>CPF do Professor</FormLabel>
            <Input
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Digite o CPF"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Departamento</FormLabel>
            <Select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              placeholder="Selecione o departamento"
            >
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Salvar
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/professors' })}>
            Voltar
          </Button>
        </VStack>
      </form>
    </Page>
  )
}
