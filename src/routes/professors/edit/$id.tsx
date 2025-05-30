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
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (id) {
      fetchProfessor(id)
    }
    fetchDepartments()
  }, [id])

  const fetchProfessor = (professorId: string) => {
    setIsLoading(true)
    fetch(`https://professor-allocation-raposa-2.onrender.com/professors/${professorId}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao buscar professor')
        return response.json()
      })
      .then((result) => setProfessor(result))
      .catch((error) => console.error('Erro ao buscar professor:', error))
      .finally(() => setIsLoading(false))
  }

  const fetchDepartments = () => {
    fetch('https://professor-allocation-raposa-2.onrender.com/departments', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((result) => setDepartments(result))
      .catch((error) => console.error('Erro ao buscar departamentos:', error))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (professor) {
      setIsSaving(true)
      const dataToSend = {
        ...professor,
        cpf: professor.cpf.replace(/\D/g, ''), // Envia só números
      }
      fetch(`https://professor-allocation-raposa-2.onrender.com/professors/${professor.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Erro ao salvar professor')
          
 
          if ('caches' in window) {
            caches.keys().then((cacheNames) => {
              cacheNames.forEach((cacheName) => {
                caches.delete(cacheName)
              })
            })
          }

          // Limpa cache do localStorage relacionado a professores
          const keys = Object.keys(localStorage)
          keys.forEach(key => {
            if (key.includes('professor') || key.includes('cache')) {
              localStorage.removeItem(key)
            }
          })

         
          localStorage.setItem('professor_updated', 'true')

          toast({
            title: 'Professor atualizado!',
            description: 'O professor foi alterado com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
          
    
          navigate({ 
            to: '/professors',
            replace: true
          })
        })
        .catch((error) => {
          console.error('Erro ao editar professor:', error)
          toast({
            title: 'Erro ao atualizar professor!',
            description: 'Ocorreu um erro inesperado. Tente novamente.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        })
        .finally(() => setIsSaving(false))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfessor((prev: any) => ({ ...prev, [name]: name === 'cpf' ? formatCPF(value) : value }))
  }

  if (isLoading || !professor) return <div>Carregando...</div>

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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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

          <Button 
            type="submit" 
            colorScheme="blue"
            isLoading={isSaving}
            loadingText="Salvando..."
            disabled={isSaving}
          >
            Salvar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/professors' })}
            disabled={isSaving}
          >
            Voltar
          </Button>
        </Stack>
      </form>
    </Page>
  )
}

export default RouteComponent