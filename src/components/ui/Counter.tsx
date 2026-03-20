'use client'

import { useEffect, useState } from 'react'

interface CounterProps {
  value: number
  duration?: number
  suffix?: string
}

export function Counter({ value, duration = 2000, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [value, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}
