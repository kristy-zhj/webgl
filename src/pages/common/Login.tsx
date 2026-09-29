import { Button } from 'antd'
import React from 'react'
interface Props {}

export default function Login(): React.ReactElement<Props> {
  return (
    <div>
      <Button type="primary">登录</Button>
    </div>
  )
}
