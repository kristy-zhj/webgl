import TextureImg from '@assets/img/f-texture.png'
import { FC, useEffect, useMemo, useRef } from 'react'
import { createProgram, createShader, degToRad } from '..'
import { m4 } from '../3d'

const vertexShaderSource = `#version 300 es

in vec4 a_position;
// 从顶点着色器中传入的值
in vec2 a_texcoord;
// 转换位置的矩阵
uniform mat4 u_matrix;
// 将纹理坐标传递给片段着色器
out vec2 v_texcoord;
void main(){
  gl_Position = u_matrix * a_position;
  v_texcoord = a_texcoord;
}
`
const fragmentShaderSource = `#version 300 es

  precision highp float;
  // 从顶点着色器中传入的值
  in vec2 v_texcoord;
  // 纹理
  uniform sampler2D u_texture;
  out vec4 outColor;
  void main(){
    outColor = texture(u_texture, v_texcoord);
  }
`

//  定义一个传递到片段着色器的纹理坐标变量
export const Texcoord: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext('webgl2')
      if (!gl) return
      // 使用我们的样板实用工具将着色器和链接编译到程序中
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      // 查找顶点数据需要放在哪里
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
      const texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord')
      // 查找统一位置
      const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
      const positionBuffer = gl.createBuffer()
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      setGeometry(gl)
      const size = 3
      const type = gl.FLOAT
      const normalize = false
      const stride = 0
      const offset = 0
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      const texcoordBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
      setTexcoords(gl)
      gl.enableVertexAttribArray(texcoordAttributeLocation)
      var size1 = 2
      var type1 = gl.FLOAT
      var normalize1 = true
      var stride1 = 0
      var offset1 = 0
      gl.vertexAttribPointer(texcoordAttributeLocation, size1, type1, normalize1, stride1, offset1)

      const texture = gl.createTexture()
      gl.activeTexture(gl.TEXTURE + 0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
      const image = new Image()
      image.src = TextureImg
      image.addEventListener('load', function () {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.generateMipmap(gl.TEXTURE_2D)
        drawScene(
          gl,
          now,
          then,
          modelXRotationRadians,
          modelYRotationRadians,
          program,
          vao,
          fieldOfViewRadians,
          matrixLocation
        )
      })
      var fieldOfViewRadians = degToRad(60)
      var modelXRotationRadians = degToRad(0)
      var modelYRotationRadians = degToRad(0)
      var then = 0
      var now = 1

      drawScene(
        gl,
        now,
        then,
        modelXRotationRadians,
        modelYRotationRadians,
        program,
        vao,
        fieldOfViewRadians,
        matrixLocation
      )


    }
  }, [])
  useEffect(() => { }, [TextureImg])

  return (
    <div style={{ border: '1px solid pink' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid red' }}></canvas>
    </div>
  )
}
function setGeometry(gl: WebGL2RenderingContext) {
  var positions = new Float32Array([
    // left column front
    0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

    // top rung front
    30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

    // middle rung front
    30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

    // left column back
    0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

    // top rung back
    30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

    // middle rung back
    30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

    // top
    0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

    // top rung right
    100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

    // under top rung
    30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

    // between top rung and middle
    30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

    // top of middle rung
    30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

    // right of middle rung
    67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

    // bottom of middle rung.
    30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

    // right of bottom
    30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

    // bottom
    0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

    // left side
    0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0
  ])
  var matrix = m4.translate(m4.xRotation(Math.PI), -50, -75, -15)
  //var matrix = m4.xRotate(m4.translation(-50, -75, -15), Math.PI);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.transformPoint(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], [])
    positions[ii + 0] = vector[0]
    positions[ii + 1] = vector[1]
    positions[ii + 2] = vector[2]
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
}
function setTexcoords(gl: WebGL2RenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column front
      0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

      // top rung front
      0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

      // middle rung front
      0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

      // left column back
      0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,

      // top rung back
      0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,

      // middle rung back
      0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,

      // top
      0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,

      // top rung right
      0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,

      // under top rung
      0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,

      // between top rung and middle
      0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

      // top of middle rung
      0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

      // right of middle rung
      0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

      // bottom of middle rung.
      0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,

      // right of bottom
      0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

      // bottom
      0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,

      // left side
      0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0
    ]),
    gl.STATIC_DRAW
  )
}
function drawScene(
  gl: WebGL2RenderingContext,
  now: number,
  then: number,
  modelXRotationRadians: number,
  modelYRotationRadians: number,
  program: WebGLProgram,
  vao: WebGLVertexArrayObject | null,
  fieldOfViewRadians: number,
  matrixLocation: WebGLUniformLocation | null
) {
  now *= 0.001
  var deltaTime = now - then
  then = now
  modelXRotationRadians += 1.2 * deltaTime
  modelYRotationRadians += 0.7 * deltaTime
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.useProgram(program)
  gl.bindVertexArray(vao)
  var aspect = gl.canvas.width / gl.canvas.height
  var zNear = 1
  var zFar = 2000
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
  var cameraPosition = [0, 0, 200]
  var up = [0, 1, 0]
  var target = [0, 0, 0]
  var cameraMatrix = m4.lookAt(cameraPosition, target, up)
  var viewMatrix = m4.inverse(cameraMatrix)
  var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
  var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians)
  matrix = m4.yRotate(matrix, modelYRotationRadians)
  gl.uniformMatrix4fv(matrixLocation, false, matrix)
  var primitiveType = gl.TRIANGLES
  var offset1 = 0
  var count = 16 * 6
  gl.drawArrays(primitiveType, offset1, count)

}
