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
  Flex,
  Box,
  Text,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { FiTrash2, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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

const dayTranslations = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

function RouteComponent() {
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)

  const itemsPerPage = 10
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    fetchAllocations()
  }, [])

  useEffect(() => {
    setTotalPages(Math.ceil(allocations.length / itemsPerPage))
  }, [allocations])

  const fetchAllocations = () => {
    const cached = localStorage.getItem('allocationsCache')
    if (cached) {
      setAllocations(JSON.parse(cached))
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    fetch('https://professor-allocation-raposa-2.onrender.com/allocations')
      .then((response) => response.json())
      .then((result) => {
        const sortedAllocations = result.sort((a: { id: number }, b: { id: number }) => a.id - b.id)
        localStorage.setItem('allocationsCache', JSON.stringify(sortedAllocations))
        setAllocations(sortedAllocations)
      })
      .catch((error) => {
        console.error('Erro ao buscar alocações:', error)
        toast({
          title: 'Erro ao carregar alocações',
          description: 'Não foi possível carregar os dados.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(() => setIsLoading(false))
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedId === null) return
    setIsDeleting(true)

    fetch(`https://professor-allocation-raposa-2.onrender.com/allocations/${selectedId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem('allocationsCache')
          fetchAllocations()
          toast({
            title: 'Alocação excluída!',
            description: 'A alocação foi removida com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        } else {
          toast({
            title: 'Erro ao excluir alocação!',
            description: 'Ocorreu um erro ao excluir a alocação.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }
      })
      .catch((error) => {
        console.error('Erro ao deletar alocação:', error)
        toast({
          title: 'Erro ao excluir alocação!',
          description: 'Ocorreu um erro inesperado. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(() => {
        setIsDeleting(false)
        setSelectedId(null)
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
    return allocations.slice(startIndex, endIndex)
  }

  const translateDay = (day: string) => {
    const lowerCaseDay = day?.toLowerCase()
    return dayTranslations[lowerCaseDay as keyof typeof dayTranslations] || day || 'N/A'
  }

  return (
    <>
      <Page
        title="Quadro de Horários"
        rightElement={
          <Button as={Link} to="/allocations/new" colorScheme="blue" isDisabled={isLoading || isDeleting}>
            Adicionar Alocação
          </Button>
        }
      >
        {isLoading ? (
          <Center py={20}>
            <Spinner size="xl" thickness="4px" color="blue.500" />
          </Center>
        ) : (
          <>
            <Table
              columns={[
                { label: 'ID', name: 'id' },
                {
                  label: 'Dia',
                  name: 'day',
                  render: (value: string) => translateDay(value),
                },
                {
                  label: 'Início',
                  name: 'start',
                  render: (value: string) => formatTime(value),
                },
                {
                  label: 'Fim',
                  name: 'end',
                  render: (value: string) => formatTime(value),
                },
                {
                  label: 'Curso',
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
                        isDisabled={isDeleting}
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
                  {Math.min(currentPage * itemsPerPage, allocations.length)} de {allocations.length}{' '}
                  alocações
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

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmar Exclusão</AlertDialogHeader>
            <AlertDialogBody>
              Você tem certeza de que deseja excluir esta alocação? Esta ação não poderá ser desfeita.
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

function formatTime(time: string) {
  if (!time) return 'N/A'
  const [hour, minute] = time.split(':').map(Number)
  const formattedHour = ((hour % 12) || 12).toString().padStart(2, '0')
  const period = hour < 12 ? 'AM' : 'PM'
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`
}

export default RouteComponent
