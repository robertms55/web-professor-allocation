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
  Spinner,
  Center,
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
  const [professors, setProfessors] = useState<Professor[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [day, setDay] = useState('MONDAY')
  const [start, setStart] = useState('08:00:00')
  const [end, setEnd] = useState('17:00:00')
  const [professorId, setProfessorId] = useState('')
  const [courseId, setCourseId] = useState('')

  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professorsRes, coursesRes] = await Promise.all([
          fetch('https://professor-allocation-raposa-2.onrender.com/professors'),
          fetch('https://professor-allocation-raposa-2.onrender.com/Courses'),
        ])

        const profData = await professorsRes.json()
        const courseData = await coursesRes.json()

        setProfessors(Array.isArray(profData) ? profData : [])
        setCourses(Array.isArray(courseData) ? courseData : [])
      } catch (error) {
        setProfessors([])
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

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

    fetch('https://professor-allocation-raposa-2.onrender.com/allocations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          toast({
            title: 'Alocação criada!',
            description: 'Nova alocação foi criada com sucesso.',
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
        console.error('Erro ao criar alocação:', error)
        toast({
          title: 'Erro ao criar alocação!',
          description: error.message || 'Ocorreu um erro inesperado.',
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

  if (loading) {
    return (
      <Page title="Nova Alocação" rightElement={null}>
        <Center h="60vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      </Page>
    )
  }

  return (
    <Page title="Nova Alocação" rightElement={null}>
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
            <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
              Criar Alocação
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/allocations' })} isDisabled={isSubmitting}>
              Voltar
            </Button>
          </Box>
        </VStack>
      </form>
    </Page>
  )
}

export default RouteComponent
