import { Box, Container, Heading } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface PageProps {
  rightElement: ReactNode
  children: ReactNode
  title: string
}

export default function Page(props: PageProps) {
  return (
    <Container maxWidth="4xl" marginTop={10}>
      <Box display="flex" justifyContent="space-between">
        <Heading>{props.title}</Heading>

        {props.rightElement}
      </Box>

      <Box marginTop={10}>{props.children}</Box>
    </Container>
  )
}
