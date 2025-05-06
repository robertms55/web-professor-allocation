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
} from '@chakra-ui/react'
import { FiTrash2, FiEdit } from 'react-icons/fi'
import Page from '@/components/page'
import Table from '@/components/table'

export const Route = createFileRoute('/allocations/')({
  component: RouteComponent,
})

type Allocation = {
  id: number
  day: string
  start: string
  end: string
  course: {
    id: number
    name: string
  }
  professor: {
    id: number
    name: string
  }
}

function RouteComponent() {
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    fetchAllocations()
  }, [])

  const fetchAllocations = () => {
    fetch('http://localhost:8080/allocations')
      .then((response) => response.json())
      .then((result) => setAllocations(Array.isArray(result) ? result : []))
      .catch((error) => console.error('Erro ao buscar alocações:', error))
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return
    fetch(`http://localhost:8080/allocations/${selectedId}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchAllocations()
        onClose()
      })
      .catch((error) => console.error('Erro ao deletar alocação:', error))
  }

  return (
    <>
      <Page
        title="Allocations"
        rightElement={
          <Button as={Link} to="/allocations/new" colorScheme="blue">
            Add Allocation
          </Button>
        }
      >
        <Table
          columns={[
            { label: 'ID', name: 'id' },
            { label: 'Day', name: 'day' },
            {
              label: 'Start Hour',
              name: 'start',
              render: (value: string) => formatTime(value),
            },
            {
              label: 'End Hour',
              name: 'end',
              render: (value: string) => formatTime(value),
            },
            {
              label: 'Course',
              name: 'course',
              render: (_: any, row: Allocation) => row.course?.name || 'N/A',
            },
            {
              label: 'Professor',
              name: 'professor',
              render: (_: any, row: Allocation) => row.professor?.name || 'N/A',
            },
            {
              label: 'Ações',
              name: 'options',
              render: (_: any, row: Allocation) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <IconButton
                    icon={<FiEdit />}
                    size="sm"
                    aria-label="Editar"
                    colorScheme="yellow"
                    as={Link}
                    to={`/allocations/edit/${row.id}`}
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
          items={allocations}
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
              Você tem certeza de que deseja excluir esta alocação? Esta ação não poderá ser desfeita.
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

function formatTime(time: string) {
  if (!time) return 'N/A'
  const [hour, minute] = time.split(':').map(Number)
  const formattedHour = ((hour % 12) || 12).toString().padStart(2, '0')
  const period = hour < 12 ? 'AM' : 'PM'
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`
}
