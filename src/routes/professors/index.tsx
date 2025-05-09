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
  department: {
    id: number
    name: string
  }
}

// Função simples para formatar CPF
function formatCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return cpf
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
        const sortedProfessors = result.sort((a: Professor, b: Professor) => a.id - b.id)
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
      .then((response) => {
        if (response.ok) {
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
        onClose()
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
        onClose()
      })
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
            { 
              label: 'CPF', 
              name: 'cpf', 
              render: (_: any, row: Professor) => formatCPF(row.cpf) 
            },
            { label: 'Nome', name: 'name' },
            { 
              label: 'Departamento', 
              name: 'department',
              render: (_: any, row: Professor) => row.department?.name || 'Sem Departamento'
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

export default RouteComponent
