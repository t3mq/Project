interface HumidityPoint { day: string; value: number }

interface HumidityChartProps {
  data: HumidityPoint[]
  color?: string
  height?: number
}

export const HumidityChart = ({ data, color = '#059669', height = 140 }: HumidityChartProps) => {
  const W = 320, H = height
  const pad = { l: 30, r: 14, t: 18, b: 24 }
  const max = 60, min = 30
  const xs = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r)
  const ys = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b)

  // Smooth curve using cubic bezier
  const points = data.map((d, i) => ({ x: xs(i), y: ys(d.value) }))
  let curvePath = `M${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    curvePath += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`
  }
  const areaPath = `${curvePath} L${points[points.length - 1].x},${H - pad.b} L${points[0].x},${H - pad.b} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.2" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[30, 40, 50, 60].map(v => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={ys(v)} y2={ys(v)} stroke="var(--border-subtle)" strokeWidth="1" />
          <text x={pad.l - 8} y={ys(v) + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)" fontFamily="inherit">{v}%</text>
        </g>
      ))}
      {/* Area */}
      <path d={areaPath} fill="url(#humGrad)" />
      {/* Curve */}
      <path d={curvePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Points + labels */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={xs(i)} cy={ys(d.value)} r="3.5" fill="var(--bg-surface)" stroke={color} strokeWidth="2" />
          <text x={xs(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="inherit" fontWeight="500">{d.day}</text>
        </g>
      ))}
      {/* Last value badge */}
      <g transform={`translate(${xs(data.length - 1) + 10}, ${ys(data[data.length - 1].value) - 8})`}>
        <rect x="-4" y="-12" width="38" height="20" rx="6" fill={color} />
        <text x="15" y="1" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="inherit">{data[data.length - 1].value}%</text>
      </g>
    </svg>
  )
}
