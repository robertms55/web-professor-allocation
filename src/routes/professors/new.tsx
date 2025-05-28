import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, Select, VStack, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/professors/new')({
  component: RouteComponent,
})


function formatCPF(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function RouteComponent() {
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [departmentId, setDepartmentId] = useState<number | string>('')
  const [departments, setDepartments] = useState<any[]>([])
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    fetch('https://professor-allocation-raposa-2.onrender.com/departments')
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
      cpf: cpf.replace(/\D/g, ''), // Envia só os números
      departmentId: parseInt(departmentId.toString()),
    }

    fetch('https://professor-allocation-raposa-2.onrender.com/professors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professorData),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: 'Professor cadastrado!',
            description: 'O novo professor foi adicionado com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
          navigate({ to: '/professors' })
        } else {
         
          toast({
            title: 'Erro ao cadastrar professor!',
            description: 'O CPF informado já está em uso.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }
      })
      .catch((error) => {
        console.error('Erro ao adicionar professor:', error)
        toast({
          title: 'Erro!',
          description: 'Não foi possível adicionar o professor. Tente novamente.',
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
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              maxLength={14}
              placeholder="000.000.000-00"
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

export default RouteComponent
