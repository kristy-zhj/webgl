import { FC, useEffect, useRef } from "react";
import { createProgram, createShader } from "../index";

export const OneRectangle: FC<{}> = ({ }) => {
  const refCanvas = useRef<HTMLCanvasElement>(null)
  // 顶点着色器
  const vertexShaderSource = `#version 300 es
  in vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
  `;
  // 片段着色器
  var fragmentShaderSource = `#version 300 es
  precision highp float;
  out vec4 outColor;
  void main() {
    outColor = vec4(1, 0, 0.5, 1);
  }
  `;

  useEffect(() => {
    const canvas = refCanvas.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      // 创建两个着色器
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      // 链接两个着色器成一个程序并调用它
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      // 查找顶点数据放在哪里
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
      // 创建缓冲区
      const positionBuffer = gl.createBuffer()
      // 绑定缓冲区
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      // 通过绑定点把数据存放到缓冲区
      const positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
      ]
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
      // 创建属性状态集合：顶点数组对象
      const vao = gl.createVertexArray()
      // 绑定这个顶点数组到webgl
      gl.bindVertexArray(vao)
      // 启用属性
      gl.enableVertexAttribArray(positionAttributeLocation)
      // 需要设置属性值如何从缓存区取出数据
      const size = 2 //迭代两个组件
      const type = gl.FLOAT //数据类型
      const normalize = false //不要规范化数据
      const stride = 0 //向前移动大小size，每次迭代以获得下一个位置
      const offset = 0 //从缓冲区的开头开始
      // 绑定当前的ARRAY_BUFFER到这个属性；这个属性被绑定到positionBuffer
      // 从GLSL顶点着色器的角度看，属性a_position是vec4
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      // webglUtils.resizeCanvasToDisplaySize(gl.canvas)
      // 将其传递给画布的当前大小
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      // 清除画布
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      // 使用程序
      gl.useProgram(program)
      // 绑定想要的属性/缓冲区
      gl.bindVertexArray(vao)
      const primitiveType = gl.TRIANGLES
      const offset1 = 0
      const count = 3
      gl.drawArrays(primitiveType, offset1, count)
    }
  }, [])

  return <canvas ref={refCanvas}
    style={{
      border: "1px solid red"
    }}
  ></canvas>
}