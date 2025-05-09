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

export const Route = createFileRoute('/courses/')({
  component: RouteComponent,
})

type Course = {
  id: number
  name: string
}

function RouteComponent() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = () => {
    fetch('http://localhost:8080/Courses')
      .then((response) => response.json())
      .then((result) => {
        const sortedCourses = result.sort((a, b) => a.id - b.id)
        setCourses(sortedCourses)
      })
      .catch((error) => console.error('Erro ao buscar cursos:', error))
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return
    fetch(`http://localhost:8080/Courses/${selectedId}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          fetchCourses()
          toast({
            title: 'Curso excluído!',
            description: 'O curso foi removido com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        } else {
          toast({
            title: 'Erro ao excluir curso!',
            description: 'Não é possível excluir um curso em uso!',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }
        // Fechar o popup de confirmação após a tentativa de exclusão
        onClose()
      })
      .catch((error) => {
        console.error('Erro ao deletar curso:', error)
        toast({
          title: 'Erro ao excluir curso!',
          description: 'Ocorreu um erro inesperado. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        // Fechar o popup de confirmação após falha
        onClose()
      })
  }

  return (
    <>
      <Page
        title="Cursos"
        rightElement={
          <Button as={Link} to="/courses/new" colorScheme="blue">
            Adicionar Curso
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
              render: (_value: any, row: Course) => (
                <HStack justify="flex-end">
                  <IconButton
                    icon={<FiEdit />}
                    size="sm"
                    aria-label="Editar"
                    colorScheme="yellow"
                    as={Link}
                    to={`/courses/edit/${row.id}`}
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
          items={courses}
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
              Você tem certeza que deseja excluir este curso? Esta ação não poderá ser desfeita.
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
