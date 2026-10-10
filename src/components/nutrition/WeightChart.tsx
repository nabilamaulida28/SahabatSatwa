import React, { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts'
import { WeightRecord } from '../../types'

interface WeightChartProps {
  records: WeightRecord[]
  petName: string
}

export const WeightChart: React.FC<WeightChartProps> = ({ records, petName }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#FAF6EF]/50 rounded-2xl border border-[#E9E4DC]">
        <p className="text-xs text-[#718078]">Menyiapkan grafik berat badan...</p>
      </div>
    )
  }

  // Format records for Recharts
  const chartData = records
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => {
      // Format short date (e.g. "15 Mei", "10 Okt")
      const dateObj = new Date(r.date)
      const formattedDate = dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      })
      return {
        date: formattedDate,
        rawDate: r.date,
        berat: r.weight,
        notes: r.notes || '',
      }
    })

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-[#FAF6EF]/50 rounded-2xl border border-[#E9E4DC] text-center p-6">
        <p className="text-sm font-semibold text-[#24312C]">Belum ada riwayat berat badan</p>
        <p className="text-xs text-[#718078] mt-1">
          Klik tombol "+ Catat Berat Badan" untuk mulai memantau pertumbuhan {petName}.
        </p>
      </div>
    )
  }

  // Calculate min and max for nicely padded Y axis
  const weights = chartData.map((d) => d.berat)
  const minWeight = Math.max(0, Math.floor(Math.min(...weights) - 0.5))
  const maxWeight = Math.ceil(Math.max(...weights) + 0.5)

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#21845F" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#21845F" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DC" vertical={false} />

          <XAxis
            dataKey="date"
            stroke="#718078"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E9E4DC' }}
          />

          <YAxis
            domain={[minWeight, maxWeight]}
            stroke="#718078"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E9E4DC' }}
            unit=" kg"
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-3 rounded-xl shadow-soft-lg border border-[#E9E4DC] text-xs space-y-1">
                    <p className="font-bold text-[#718078]">{label}</p>
                    <p className="text-sm font-extrabold text-[#21845F]">
                      {data.berat} kg
                    </p>
                    {data.notes && (
                      <p className="text-[11px] text-[#24312C] italic">{data.notes}</p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />

          <Area
            type="monotone"
            dataKey="berat"
            stroke="#21845F"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#weightGrad)"
            activeDot={{ r: 6, fill: '#21845F', stroke: '#FFFFFF', strokeWidth: 2 }}
            dot={{ r: 4, fill: '#FFFFFF', stroke: '#21845F', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
