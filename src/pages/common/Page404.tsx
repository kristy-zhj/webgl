import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import paths from '@routes/pathMap'
interface Props {}

export default function Page404(): React.ReactElement<Props> {
  return (
    <div>
      <div>404</div>
      <div>抱歉，你访问的页面不存在</div>
      <Button type="primary">
        <Link to={paths.home}>返回首页</Link>
      </Button>
    </div>
  )
}
