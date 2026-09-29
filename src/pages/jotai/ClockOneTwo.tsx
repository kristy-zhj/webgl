import { Link } from 'react-router-dom'
import m from '@routes/pathMap'
import Clock from '@/components/jotai/Clock'

export default function ClockTwo() {
  return (
    <>
      <div>
        <Link to={m.jotai.clock.index}>index</Link>
      </div>
      <Clock />
    </>
  )
}
