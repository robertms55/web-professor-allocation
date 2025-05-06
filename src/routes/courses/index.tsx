import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, HStack, IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Page from '@/components/page'
import Table from '@/components/table'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

export const Route = createFileRoute('/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = () => {
    fetch('http://localhost:8080/Courses')
      .then((response) => response.json())
      .then((result) => setCourses(result))
      .catch((error) => console.error(error))
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      fetch(`http://localhost:8080/Courses/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          fetchCourses()
        })
        .catch((error) => console.error('Erro ao deletar curso:', error))
    }
  }

  return (
    <Page
      title="Cursos"
      rightElement={
        <Button as={Link} to="/courses/new" colorScheme="blue">
          Add Course
        </Button>
      }
    >
      <Table
        columns={[
          { label: 'ID', name: 'id' },
          { label: 'Nome', name: 'name' },
          {
            label: 'Ações',
            name: 'options',
            width: '1%',
            render: (item) => (
              <HStack justify="flex-end">
                <IconButton
                  aria-label="Editar"
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="yellow"
                  onClick={() => navigate({ to: `/courses/edit/${item.id}` })}
                />
                <IconButton
                  aria-label="Apagar"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(item.id)}
                />
              </HStack>
            ),
          },
        ]}
        items={courses}
      />
    </Page>
  )
}
