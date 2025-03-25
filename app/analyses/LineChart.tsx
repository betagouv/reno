'use client'

import { 
  LineChart, 
  XAxis, 
  CartesianGrid, 
  Line, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

// DPE colors
const dpeColors = {
  'A': '#319834',
  'B': '#5eb92d',
  'C': '#cdcf00',
  'D': '#fecb02',
  'E': '#ee8100',
  'F': '#e84b0f',
  'G': '#d7221f'
}

export function OurLineChart({ data }) {
  // Get unique revenue values for X axis
  const allDataPoints = data.flatMap(series => series.data)
  const uniqueRevenues = [...new Set(allDataPoints.map(item => item.revenue))]
    .sort((a, b) => a - b)
  
  // Transform data for Recharts
  const transformedData = uniqueRevenues.map(revenue => {
    const dataPoint = { revenue }
    
    // Add a property for each DPE series
    data.forEach(series => {
      const matchingPoint = series.data.find(point => point.revenue === revenue)
      if (matchingPoint) {
        dataPoint[`DPE ${series.label}`] = matchingPoint.montant
      }
    })
    
    return dataPoint
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={transformedData}>
        <XAxis 
          dataKey="revenue" 
          tickFormatter={(value) => `${(value/1000).toFixed(0)}k€`}
          label={{ value: 'Revenu du ménage', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: 'Montant de l\'aide (€)', angle: -90, position: 'insideLeft' }}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip 
          formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, 'Montant']}
          labelFormatter={(value) => `Revenu: ${value.toLocaleString('fr-FR')} €`}
        />
        <Legend />
        
        {data.map(series => (
          <Line
            key={series.id}
            type="monotone"
            dataKey={`DPE ${series.label}`}
            name={`DPE ${series.label}`}
            stroke={dpeColors[series.label] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
