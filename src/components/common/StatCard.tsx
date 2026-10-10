import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  summary: string
  icon: React.ReactNode
  bgColor: string // e.g. '#E6F3E7', '#EEE6FA', '#FCE7E5', '#FFF1CC'
  iconBgColor?: string
  textColor?: string
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  summary,
  icon,
  bgColor,
  iconBgColor = 'rgba(255, 255, 255, 0.7)',
  textColor = '#24312C',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
      className={`rounded-2xl p-5 border border-[#E9E4DC]/60 transition-all duration-200 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-[#718078] tracking-wide uppercase">
          {title}
        </span>
        <div
          style={{ backgroundColor: iconBgColor }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#21845F] shadow-xs"
        >
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <h3
          style={{ color: textColor }}
          className="text-3xl font-extrabold tracking-tight font-sans"
        >
          {value}
        </h3>
        <p className="mt-1 text-xs font-medium text-[#718078] truncate">{summary}</p>
      </div>
    </div>
  )
}
