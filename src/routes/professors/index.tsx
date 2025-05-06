import { Button, HStack, IconButton } from '@chakra-ui/react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Page from '@/components/page'
import Table from '@/components/table'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

export const Route = createFileRoute('/professors/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [professors, setProfessors] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = () => {
    fetch('http://localhost:8080/professors')
      .then((response) => response.json())
      .then((result) => setProfessors(result))
      .catch((error) => console.error(error))
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      fetch(`http://localhost:8080/professors/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          fetchProfessors()
        })
        .catch((error) => console.error('Erro ao deletar professor:', error))
    }
  }

  return (
    <Page
      title="Professores"
      rightElement={
        <Button as={Link} to="/professors/new" colorScheme="blue">
          Add Professor
        </Button>
      }
    >
      <Table
        columns={[
          { label: 'ID', name: 'id' },
          { label: 'CPF', name: 'cpf' },
          { label: 'Nome', name: 'name' },
          {
            label: 'Ações',
            name: 'options',
            width: '1%', // Faz a coluna ser estreita e alinha à direita
            render: (item) => (
              <HStack justify="flex-end">
                <IconButton
                  aria-label="Editar"
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="yellow"
                  onClick={() => navigate({ to: `/professors/edit/${item.id}` })}
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
        items={professors}
      />
    </Page>
  )
}
