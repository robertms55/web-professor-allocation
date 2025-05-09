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

export const Route = createFileRoute('/departments/')({
  component: RouteComponent,
})

type Department = {
  id: number
  name: string
}

function RouteComponent() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = () => {
    fetch('http://localhost:8080/departments')
      .then((response) => response.json())
      .then((result) => {
        const sortedDepartments = result.sort((a, b) => a.id - b.id)
        setDepartments(sortedDepartments)
      })
      .catch((error) => console.error('Erro ao buscar departamentos:', error))
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return
    fetch(`http://localhost:8080/departments/${selectedId}`, { method: 'DELETE' })
      .then(() => {
        fetchDepartments()
        onClose()
        toast({
          title: 'Departamento excluído!',
          description: 'O departamento foi removido com sucesso.',
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .catch((error) => console.error('Erro ao deletar departamento:', error))
  }

  return (
    <>
      <Page
        title="Departamentos"
        rightElement={
          <Button as={Link} to="/departments/new" colorScheme="blue">
            Adicionar Departamento
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
              render: (_value: any, row: Department) => (
                <HStack justify="flex-end">
                  <IconButton
                    icon={<FiEdit />}
                    size="sm"
                    aria-label="Editar"
                    colorScheme="yellow"
                    as={Link}
                    to={`/departments/edit/${row.id}`}
                  />
                  <IconButton
                    icon={<FiTrash2 />}
                    size="sm"
                    aria-label="Deletar"
                    colorScheme="red"
                    onClick={() => handleDelete(row.id)}
                  />
                </HStack>
              ),
            },
          ]}
          items={departments}
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
              Você tem certeza que deseja excluir este departamento? Esta ação não poderá ser desfeita.
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
