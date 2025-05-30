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
  useToast,
  Flex,
  Box,
  Text,
  HStack,
  Spinner,
} from '@chakra-ui/react'
import { FiTrash2, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Page from '@/components/page'
import Table from '@/components/table'

export const Route = createFileRoute('/professors/')({
  component: RouteComponent,
})

type Professor = {
  id: number
  cpf: string
  name: string
  department: {
    id: number
    name: string
  }
}

function formatCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return cpf
}

const CACHE_KEY = 'professorsCache'
const CACHE_EXPIRATION_MS = 5 * 60 * 1000

function RouteComponent() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    fetchProfessors()
  }, [])

  useEffect(() => {
    setTotalPages(Math.ceil(professors.length / itemsPerPage))
  }, [professors])

  const fetchProfessors = () => {
    setIsLoading(true)

    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached)
        const { data, timestamp } = parsedCache
        const now = Date.now()

        if (now - timestamp < CACHE_EXPIRATION_MS) {
          setProfessors(data)
          setIsLoading(false)
          return
        } else {
          localStorage.removeItem(CACHE_KEY)
        }
      } catch (e) {
        console.warn('Erro ao ler cache:', e)
        localStorage.removeItem(CACHE_KEY)
      }
    }

    fetch('https://professor-allocation-raposa-2.onrender.com/professors')
      .then((response) => response.json())
      .then((result) => {
        const sortedProfessors = result.sort((a: Professor, b: Professor) => a.id - b.id)
        setProfessors(sortedProfessors)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: sortedProfessors, timestamp: Date.now() }))
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Erro ao buscar professores:', error)
        setIsLoading(false)
      })
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return

    setIsDeleting(true)
    fetch(`https://professor-allocation-raposa-2.onrender.com/professors/${selectedId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem(CACHE_KEY)
          fetchProfessors()
          toast({
            title: 'Professor excluído!',
            description: 'O professor foi removido com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        } else {
          toast({
            title: 'Erro ao excluir professor!',
            description: 'Não é possível excluir um professor em uso!',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }
      })
      .catch((error) => {
        console.error('Erro ao deletar professor:', error)
        toast({
          title: 'Erro ao excluir professor!',
          description: 'Ocorreu um erro inesperado. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(() => {
        setIsDeleting(false)
        onClose()
      })
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return professors.slice(startIndex, endIndex)
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
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <>
            <Table
              columns={[
                { label: 'ID', name: 'id' },
                {
                  label: 'CPF',
                  name: 'cpf',
                  render: (_: any, row: Professor) => formatCPF(row.cpf),
                },
                { label: 'Nome', name: 'name' },
                {
                  label: 'Departamento',
                  name: 'department',
                  render: (_: any, row: Professor) =>
                    row.department?.name || 'Sem Departamento',
                },
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
              items={getCurrentItems()}
            />

            <Flex justifyContent="space-between" alignItems="center" mt={4}>
              <Box>
                <Text fontSize="sm">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                  {Math.min(currentPage * itemsPerPage, professors.length)} de {professors.length} professores
                </Text>
              </Box>
              <HStack>
                <IconButton
                  icon={<FiChevronLeft />}
                  onClick={prevPage}
                  isDisabled={currentPage === 1}
                  aria-label="Página anterior"
                  size="sm"
                />
                <Text mx={2}>
                  Página {currentPage} de {totalPages}
                </Text>
                <IconButton
                  icon={<FiChevronRight />}
                  onClick={nextPage}
                  isDisabled={currentPage === totalPages || totalPages === 0}
                  aria-label="Próxima página"
                  size="sm"
                />
              </HStack>
            </Flex>
          </>
        )}
      </Page>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
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
              <Button colorScheme="red" onClick={confirmDelete} ml={3} isLoading={isDeleting}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default RouteComponent
