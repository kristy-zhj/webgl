import { clockAtom } from '@/store'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { css } from '@emotion/css'

const pad = (n: number) => (n < 10 ? `0${n}` : n)
const format = (t: Date) => `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`

export default function Clock() {
  const [{ light, lastUpdate }, setClock] = useAtom(clockAtom)
  const timeString = format(new Date(lastUpdate))
  useEffect(() => {
    const timer = setInterval(() => {
      setClock({ light: true, lastUpdate: Date.now() })
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [setClock])
  return <div className={light ? lightStyle : ''}>{timeString}</div>
}
const lightStyle = css`
  padding: 15px;
  color: #82fa58;
  display: inline-block;
  font: 50px menlo, monaco, monospace;
  background-color: #000;
  .light {
    background-color: #999;
  }
`
