import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Box,
  useToast,
} from '@chakra-ui/react'
import Page from '@/components/page'

export const Route = createFileRoute('/allocations/edit/$id')({
  component: RouteComponent,
})

type Professor = {
  id: number
  name: string
}

type Course = {
  id: number
  name: string
}

type Allocation = {
  id: number
  day: string
  start: string
  end: string
  professor: Professor
  course: Course
}

// Mapeamento de dias da semana de inglês para português
const dayTranslations = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

// Mapeamento de dias da semana de português para inglês (para o select)
const daysOptions = [
  { value: 'MONDAY', label: 'Segunda-feira' },
  { value: 'TUESDAY', label: 'Terça-feira' },
  { value: 'WEDNESDAY', label: 'Quarta-feira' },
  { value: 'THURSDAY', label: 'Quinta-feira' },
  { value: 'FRIDAY', label: 'Sexta-feira' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
]

function RouteComponent() {
  const { id } = Route.useParams()
  const [allocation, setAllocation] = useState<Allocation | null>(null)
  const [professors, setProfessors] = useState<Professor[]>([])
  const [courses, setCourses] = useState<Course[]>([])

  const [day, setDay] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [professorId, setProfessorId] = useState('')
  const [courseId, setCourseId] = useState('')

  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    fetch(`http://localhost:8080/allocations/${id}`)
      .then((res) => res.json())
      .then((data: Allocation) => {
        setAllocation(data)
        setDay(data.day)
        setStart(data.start)
        setEnd(data.end)
        setProfessorId(String(data.professor.id))
        setCourseId(String(data.course.id))
      })

    fetch('http://localhost:8080/professors')
      .then((res) => res.json())
      .then((data) => setProfessors(Array.isArray(data) ? data : []))

    fetch('http://localhost:8080/Courses')
      .then((res) => res.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formatTime = (time: string) => {
      const [h = '00', m = '00', s = '00'] = time.split(':')
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
    }

    const payload = {
      id: Number(id),
      day,  // Mantém o valor em inglês para o backend
      start: formatTime(start),
      end: formatTime(end),
      professorId: Number(professorId),
      courseId: Number(courseId),
    }

    fetch(`http://localhost:8080/allocations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          toast({
            title: 'Alocação atualizada!',
            status: 'success',
            duration: 1000,
            isClosable: true,
            position: 'top-right',
          })
          navigate({ to: '/allocations' })
        } else {
          return res.json().then((err) => {
            throw new Error(err.message)
          })
        }
      })
      .catch((error) => {
        console.error('Erro ao atualizar alocação:', error)
        toast({
          title: 'Erro ao atualizar alocação!',
          description: error.message || 'Ocorreu um erro inesperado.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
  }

  return (
    <Page
      title="Editar Alocação"
      rightElement={null}
    >
      {allocation && (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">

            <FormControl isRequired>
              <FormLabel>Dia</FormLabel>
              <Select value={day} onChange={(e) => setDay(e.target.value)}>
                {daysOptions.map((dayOption) => (
                  <option key={dayOption.value} value={dayOption.value}>
                    {dayOption.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Hora de Início</FormLabel>
              <Input
                type="time"
                step="1"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Hora de Término</FormLabel>
              <Input
                type="time"
                step="1"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Professor</FormLabel>
              <Select
                placeholder="Selecione o professor"
                value={professorId}
                onChange={(e) => setProfessorId(e.target.value)}
              >
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Curso</FormLabel>
              <Select
                placeholder="Selecione o curso"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" gap={3}>
              <Button type="submit" colorScheme="blue">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/allocations' })}>
                Voltar
              </Button>
            </Box>
          </VStack>
        </form>
      )}
    </Page>
  )
}

export default RouteComponent