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
  Flex,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { FiTrash2, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Page from '@/components/page'
import Table from '@/components/table'

export const Route = createFileRoute('/departments/')({
  component: RouteComponent,
})

type Department = {
  id: number
  name: string
}

const CACHE_KEY = 'departments_cache'
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutos

function RouteComponent() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    setTotalPages(Math.ceil(departments.length / itemsPerPage))
  }, [departments])

  const fetchDepartments = () => {
    // Tentar pegar do cache primeiro
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setDepartments(data)
          setIsLoading(false)
          return
        }
      } catch {
        // Se cache estiver inválido, ignora
      }
    }

    // Se não tem cache válido, busca da API
    setIsLoading(true)
    fetch('https://professor-allocation-raposa-2.onrender.com/departments')
      .then((response) => response.json())
      .then((result) => {
        const sortedDepartments = result.sort((a: { id: number }, b: { id: number }) => a.id - b.id)
        setDepartments(sortedDepartments)
        // Salvar no cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: sortedDepartments, timestamp: Date.now() }))
      })
      .catch((error) => console.error('Erro ao buscar departamentos:', error))
      .finally(() => setIsLoading(false))
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return
    setIsDeleting(true)
    fetch(`https://professor-allocation-raposa-2.onrender.com/departments/${selectedId}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          // Limpar cache pois dados mudaram
          localStorage.removeItem(CACHE_KEY)
          fetchDepartments()
          toast({
            title: 'Departamento excluído!',
            description: 'O departamento foi removido com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        } else {
          toast({
            title: 'Erro ao excluir departamento!',
            description: 'Não é possível excluir um departamento em uso!',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }
        onClose()
      })
      .catch((error) => {
        console.error('Erro ao deletar departamento:', error)
        toast({
          title: 'Erro ao excluir departamento!',
          description: 'Ocorreu um erro inesperado. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        onClose()
      })
      .finally(() => setIsDeleting(false))
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
    return departments.slice(startIndex, endIndex)
  }

  return (
    <>
      <Page
        title="Departamentos"
        rightElement={
          <Button as={Link} to="/departments/new" colorScheme="blue" isDisabled={isLoading || isDeleting}>
            Adicionar Departamento
          </Button>
        }
      >
        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <>
            <Table
              columns={[
                { label: 'ID', name: 'id' },
                { label: 'Nome', name: 'name' },
                {
                  label: 'Ações',
                  name: 'options',
                 
                  render: (_value: any, row: Department) => (
                    <HStack justify="flex-end">
                      <IconButton
                        icon={<FiEdit />}
                        size="sm"
                        aria-label="Editar"
                        colorScheme="yellow"
                        as={Link}
                        to={`/departments/edit/${row.id}`}
                        isDisabled={isDeleting}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        aria-label="Deletar"
                        colorScheme="red"
                        onClick={() => handleDelete(row.id)}
                        isDisabled={isDeleting}
                      />
                    </HStack>
                  ),
                },
              ]}
              items={getCurrentItems()}
            />

            {/* Controles de Paginação */}
            <Flex justifyContent="space-between" alignItems="center" mt={4}>
              <Box>
                <Text fontSize="sm">
                  Mostrando {departments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} a{' '}
                  {Math.min(currentPage * itemsPerPage, departments.length)} de {departments.length} departamentos
                </Text>
              </Box>
              <HStack>
                <IconButton
                  icon={<FiChevronLeft />}
                  onClick={prevPage}
                  isDisabled={currentPage === 1 || isLoading || isDeleting}
                  aria-label="Página anterior"
                  size="sm"
                />
                <Text mx={2}>
                  Página {currentPage} de {totalPages}
                </Text>
                <IconButton
                  icon={<FiChevronRight />}
                  onClick={nextPage}
                  isDisabled={currentPage === totalPages || totalPages === 0 || isLoading || isDeleting}
                  aria-label="Próxima página"
                  size="sm"
                />
              </HStack>
            </Flex>
          </>
        )}
      </Page>

      {/* Popup de Confirmação */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={isDeleting ? () => {} : onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmar Exclusão</AlertDialogHeader>
            <AlertDialogBody>
              Você tem certeza que deseja excluir este departamento? Esta ação não poderá ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isDeleting}>
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
