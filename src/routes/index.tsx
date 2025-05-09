import { createFileRoute, Link } from '@tanstack/react-router'
import { Box, Heading, Text, Stack, Button, Image, Container } from '@chakra-ui/react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Box bg="white" minH="100vh" py={20}>
      <Container maxW="6xl">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={10} align="center">
          {/* Texto */}
          <Box flex="1">
            <Text color="blue.600" fontWeight="bold" mb={2}>
              Gestão Acadêmica Simplificada
            </Text>
            <Heading as="h1" size="2xl" mb={6} color="gray.800">
              Prof Allocation
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
              O Prof Allocation é uma solução integrada para a gestão acadêmica, 
              permitindo o cadastro e gerenciamento de cursos, departamentos, 
              professores e a alocação docente de forma eficiente e transparente.
            </Text>

            {/* Botão que redireciona para /allocations */}
            <Button as={Link} to="/allocations" colorScheme="blue" size="lg">
              Comece Agora
            </Button>
          </Box>

          {/* Imagem */}
          <Box flex="1">
            <Image
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Prof Allocation"
              borderRadius="xl"
              shadow="md"
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
