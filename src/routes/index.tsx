import { Camera } from '@/components/test/camera'
import Page404 from '@/pages/common/Page404'
import Home from '@/pages/Index'
import AtomFamily from '@/pages/jotai/AtomFamily'
import ClockOne from '@/pages/jotai/ClockOne'
import ClockTwo from '@/pages/jotai/ClockOneTwo'
import Jotai from '@/pages/jotai/Jotai'
import SwitchArticle from '@/pages/jotai/SwitchArticle'
import TicTacToe from '@/pages/jotai/TicTacToe'
import { ThreeModal } from '@/pages/three'
import { One } from '@/pages/three/one'
import { Webgl2 } from '@/pages/webgl2'
import paths from '@routes/pathMap'
import { Outlet, RouteObject } from 'react-router-dom'

const routes: RouteObject = {
  path: paths.home,
  element: <Outlet />,
  children: [
    {
      path: paths.home,
      element: <Home />
    },
    {
      path: paths.jotai.index,
      element: <Outlet />,
      children: [
        {
          path: paths.jotai.index,
          element: <Jotai />
        },
        {
          path: paths.jotai.clock.index,
          element: <ClockOne />
        },
        {
          path: paths.jotai.clock.about,
          element: <ClockTwo />
        },
        {
          path: paths.jotai.switchArticle,
          element: <SwitchArticle />
        },
        {
          path: paths.jotai.ticTacToe,
          element: <TicTacToe />
        },
        {
          path: paths.jotai.atomFamily,
          element: <AtomFamily />
        }
      ]
    },
    {
      path: paths.webgl2.index,
      element: <Outlet />,
      children: [
        {
          path: paths.webgl2.index,
          element: <Webgl2 />
        }
      ]
    },
    {
      path: paths.three.index,
      element: <Outlet />,
      children: [
        {
          path: paths.three.index,
          element: <ThreeModal />
        },
        {
          path: paths.three.one,
          element: <One />
        }
      ]
    },
    {
      path: paths.test.index,
      element: <Outlet />,
      children: [
        {
          path: paths.test.index,
          element: <Camera />
        }
      ]
    },
    {
      path: paths[404],
      element: <Page404 />
    }
  ]
}

export default routes
