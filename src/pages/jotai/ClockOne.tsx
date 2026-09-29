import { Link } from 'react-router-dom'
import m from '@routes/pathMap'
import Clock from '@/components/jotai/Clock'
export default function ClockOne() {
  return (
    <>
      <div>
        <Link to={m.jotai.index}>jotai</Link>
      </div>
      <div>
        <Link to={m.jotai.clock.about}>about</Link>
      </div>
      <Clock />
    </>
  )
}
