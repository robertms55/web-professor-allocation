import { Button, IconButton, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { FiTrash2, FiEdit } from 'react-icons/fi'
import Page from '@/components/page'
import Table from '@/components/table'

export const Route = createFileRoute('/departments/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = () => {
    fetch('http://localhost:8080/departments')
      .then((response) => response.json())
      .then((result) => setDepartments(result))
      .catch((error) => console.error('Erro ao buscar departamentos:', error))
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return
    fetch(`http://localhost:8080/departments/${selectedId}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchDepartments()
        onClose()
      })
      .catch((error) => console.error('Erro ao deletar departamento:', error))
  }

  return (
    <>
      <Page
        title="Department"
        rightElement={
          <Button as={Link} to="/departments/new" colorScheme="blue">
            Add Department
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
              render: (item, row) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <IconButton
                    icon={<FiEdit />}
                    size="sm"
                    aria-label="Editar"
                    colorScheme="yellow"
                    as={Link}
                    to={`/departments/${row.id}/edit`}
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
          items={departments}
        />
      </Page>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmar Exclusão</AlertDialogHeader>
            <AlertDialogBody>
              Você tem certeza de que deseja excluir este departamento? Esta ação não poderá ser desfeita.
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
