import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50', // muda a cor de fundo do body
      },
    },
  },
})

export default theme
