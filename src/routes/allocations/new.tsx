
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
} from '@chakra-ui/react'
import Page from '@/components/page'

export const Route = createFileRoute('/allocations/new')({
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

function RouteComponent() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [courses, setCourses] = useState<Course[]>([])

  const [day, setDay] = useState('MONDAY')
  const [start, setStart] = useState('08:00:00')
  const [end, setEnd] = useState('17:00:00')
  const [professorId, setProfessorId] = useState('')
  const [courseId, setCourseId] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8080/professors')
      .then((res) => res.json())
      .then((data) => setProfessors(Array.isArray(data) ? data : []))

    fetch('http://localhost:8080/Courses')
      .then((res) => res.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Converte "08:00" ou "08:00:00" sempre para "HH:mm:ss"
    const formatTime = (time: string) => {
      const [h = '00', m = '00', s = '00'] = time.split(':')
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
    }

    const payload = {
      day,
      start: formatTime(start),
      end: formatTime(end),
      professorId: Number(professorId),
      courseId: Number(courseId),
    }

    fetch('http://localhost:8080/allocations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          navigate({ to: '/allocations' })
        } else {
          return res.json().then((err) => {
            throw new Error(err.message)
          })
        }
      })
      .catch((error) => {
        console.error('Erro ao criar alocação:', error)
      })
  }

  return (
    <Page
      title="Nova Alocação"
      rightElement={null}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">

          <FormControl isRequired>
            <FormLabel>Dia</FormLabel>
            <Select value={day} onChange={(e) => setDay(e.target.value)}>
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Hora de Início</FormLabel>
            <Input
              type="time"
              step="1" // permite segundos
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Hora de Término</FormLabel>
            <Input
              type="time"
              step="1" // permite segundos
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
            <Button type="submit" colorScheme="blue">
              Criar Alocação
            </Button>         
          <Button variant="outline" onClick={() => navigate({ to: '/allocations' })}>
            Voltar
          </Button>
        </VStack>
      </form>
    </Page>
  )
}

export default RouteComponent
