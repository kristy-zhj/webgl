import { Link } from 'react-router-dom'
import m from '@routes/pathMap'
export default function Home() {
  return (
    <>
      <div>home</div>
      <div>
        <Link to={m.jotai.index}>jotai</Link>
      </div>
      <div>
        <Link to={m.webgl2.index}>webgl2</Link>
      </div>
      <div>
        <Link to={m.test.index}>camera</Link>
      </div>
      <div>
        <Link to={m.three.index}>three</Link>
      </div>
    </>
  )
}
