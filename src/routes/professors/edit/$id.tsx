import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Button, FormControl, FormLabel, Input, Select, Stack, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Page from '@/components/page'

export const Route = createFileRoute('/professors/edit/$id')({
  component: RouteComponent,
})

// Função para formatar CPF
function formatCPF(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function RouteComponent() {
  const { id } = useParams({ from: '/professors/edit/$id' })
  const [professor, setProfessor] = useState<any | null>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (id) {
      fetchProfessor(id)
    }
    fetchDepartments()
  }, [id])

  const fetchProfessor = (professorId: string) => {
    fetch(`http://localhost:8080/professors/${professorId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao buscar professor')
        return response.json()
      })
      .then((result) => setProfessor(result))
      .catch((error) => console.error('Erro ao buscar professor:', error))
  }

  const fetchDepartments = () => {
    fetch('http://localhost:8080/departments')
      .then((response) => response.json())
      .then((result) => setDepartments(result))
      .catch((error) => console.error('Erro ao buscar departamentos:', error))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (professor) {
      const dataToSend = {
        ...professor,
        cpf: professor.cpf.replace(/\D/g, ''), // Envia só números
      }
      fetch(`http://localhost:8080/professors/${professor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Erro ao salvar professor')
          toast({
            title: 'Professor atualizado!',
            description: 'O professor foi alterado com sucesso.',
            status: 'success',
            duration: 1000,
            isClosable: true,
            position: 'top-right',
          })
          setTimeout(() => navigate({ to: '/professors' }), 100)
        })
        .catch((error) => console.error('Erro ao editar professor:', error))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfessor((prev: any) => ({ ...prev, [name]: name === 'cpf' ? formatCPF(value) : value }))
  }

  if (!professor) return <div>Carregando...</div>

  return (
    <Page title="Editar Professor" rightElement={null}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="cpf">CPF</FormLabel>
            <Input
              id="cpf"
              name="cpf"
              value={professor.cpf}
              onChange={handleInputChange}
              maxLength={14}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input
              id="name"
              name="name"
              value={professor.name}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="departmentId">Departamento</FormLabel>
            <Select
              id="departmentId"
              name="departmentId"
              value={professor.departmentId}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um departamento</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
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
        </Stack>
      </form>
    </Page>
  )
}

export default RouteComponent
