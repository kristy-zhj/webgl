import { atom } from 'jotai'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import './App.css'
import routes from './routes/app'
function WarpRoute() {
  const element = useRoutes(routes)
  return element
}
const textAtom = atom('hello')
function App() {
  return (
    <BrowserRouter>
      <WarpRoute />
    </BrowserRouter>
  )
}

export default App
