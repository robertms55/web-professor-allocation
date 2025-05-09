import { useEffect, useState, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Button,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  useToast,
} from '@chakra-ui/react'
import { FiTrash2, FiEdit } from 'react-icons/fi'
import Page from '@/components/page'
import Table from '@/components/table'

export const Route = createFileRoute('/professors/')({
  component: RouteComponent,
})

type Professor = {
  id: number
  cpf: string
  name: string
}

function RouteComponent() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = () => {
    fetch('http://localhost:8080/professors')
      .then((response) => response.json())
      .then((result) => {
        const sortedProfessors = result.sort((a, b) => a.id - b.id)
        setProfessors(sortedProfessors)
      })
      .catch((error) => console.error('Erro ao buscar professores:', error))
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return
    fetch(`http://localhost:8080/professors/${selectedId}`, { method: 'DELETE' })
      .then(() => {
        fetchProfessors()
        onClose()
        toast({
          title: 'Professor excluído!',
          description: 'O professor foi removido com sucesso.',
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .catch((error) => console.error('Erro ao deletar professor:', error))
  }

  return (
    <>
      <Page
        title="Professores"
        rightElement={
          <Button as={Link} to="/professors/new" colorScheme="blue">
            Adicionar Professor
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
              render: (_: any, row: Professor) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <IconButton
                    icon={<FiEdit />}
                    size="sm"
                    aria-label="Editar"
                    colorScheme="yellow"
                    as={Link}
                    to={`/professors/edit/${row.id}`}
                  />
                  <IconButton
                    icon={<FiTrash2 />}
                    size="sm"
                    aria-label="Deletar"
                    colorScheme="red"
                    onClick={() => handleDelete(row.id)}
                  />
                </div>
              ),
            },
          ]}
          items={professors}
        />
      </Page>

      {/* Popup de Confirmação */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmar Exclusão</AlertDialogHeader>
            <AlertDialogBody>
              Você tem certeza que deseja excluir este professor? Esta ação não poderá ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
