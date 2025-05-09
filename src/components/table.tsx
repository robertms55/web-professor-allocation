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
  items: any[]
}

export default function Table({ columns, items }: TableProps) {
  const formatTime = (time: string) => {
    if (!time) return 'N/A'
    const [hour, minute] = time.split(':').map(Number)
    const formattedHour = ((hour % 12) || 12).toString().padStart(2, '0')
    const period = hour < 12 ? 'AM' : 'PM'
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  if (!Array.isArray(items) || items.length === 0) {
    return <div>Sem dados para mostrar</div>
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
            <Tr key={item.id ?? index}>
              {columns.map((column) => {
                const value = item[column.name]

                return (
                  <Td
                    key={column.name}
                    textAlign={column.name === 'options' ? 'right' : 'left'}
                  >
                    {column.render
                      ? column.render(value, item) // ✅ Agora passa o `row` corretamente
                      : column.name === 'start_hour' || column.name === 'end_hour'
                      ? formatTime(value)
                      : value ?? 'N/A'}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  )
}
