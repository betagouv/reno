'use client'

const mockData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

import { LineChart, XAxis, CartesianGrid, Line, YAxis } from 'recharts'

export function OurLineChart({ data }) {
  console.log('cyan', data)
  return (
    <LineChart width={700} height={400} data={data}>
      <XAxis dataKey="revenue" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Line
        type="monotone"
        dataKey="montant"
        stroke="#000091"
        strokeWidth={'2px'}
      />
    </LineChart>
  )
}
