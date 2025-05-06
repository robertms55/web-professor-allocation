'use client'

import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

interface Column {
  label: string
  name: string
  render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
  columns: Column[]
  items: any[] // Tipar melhor isso dependendo da sua estrutura de dados
}

export default function Table({ columns, items }: TableProps) {
  // Função para formatar hora no formato de 12 horas (exemplo: 12:00 PM)
  const formatTime = (time: string) => {
    if (!time) return 'N/A'

    const [hour, minute] = time.split(':').map(Number)
    const formattedHour = ((hour % 12) || 12).toString().padStart(2, '0')
    const period = hour < 12 ? 'AM' : 'PM'
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  // Verificar se os itens são válidos
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div>Sem dados para mostrar</div> // Aqui você pode adicionar uma mensagem caso os itens não estejam carregados
    )
  }

  return (
    <TableContainer>
      <ChakraTable variant="striped" colorScheme="blue" size="sm">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.name}
                textAlign={column.name === 'options' ? 'right' : 'left'}
                minW={column.name === 'options' ? '120px' : 'auto'}
              >
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => (
            <Tr key={index}>
              {columns.map((column) => (
                <Td
                  key={column.name}
                  textAlign={column.name === 'options' ? 'right' : 'left'}
                >
                  {column.render
                    ? column.render(item[column.name], item) // Usar render personalizado se existir
                    : column.name === 'start_hour' || column.name === 'end_hour'
                    ? formatTime(item[column.name]) // Formatar as horas
                    : item[column.name] || 'N/A'}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  )
}
