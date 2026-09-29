import Page404 from '@pages/common/Page404'
import { RouteObject } from 'react-router-dom'
import Login from '@/pages/common/Login'
import m from '@routes/pathMap'
import index from '@routes/index'
import ClockOne from '@/pages/jotai/ClockOne'
import ClockTwo from '@/pages/jotai/ClockOneTwo'
const routes: RouteObject[] = [
  index,
  {
    path: m.login,
    element: <Login />
  },
  {
    path: m[404],
    element: <Page404 />
  }
]
export default routes
