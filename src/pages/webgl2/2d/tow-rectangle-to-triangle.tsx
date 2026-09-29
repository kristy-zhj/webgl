import { FC, useEffect, useRef } from "react";

const vertexShaderSource = `#version 300 es

in vec4 a_position;
in vec4 a_color;
out vec4 v_color;

void main() {
  gl_Position = a_position;
  v_color = a_color;
}`;
const fragmentShaderSource = `#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}`;
function createShader(gl: WebGL2RenderingContext, type: any, source: string) {
  const shader = gl.createShader(type) as WebGLShader
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  gl.deleteShader(shader)
  return undefined
}
// 链接两个着色器成一个程序
function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram() as WebGLProgram
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  gl.deleteProgram(program)
  return undefined
}
export const TwoRectangleTriangle: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      const positionLocation = gl.getAttribLocation(program, "a_position")
      const colorLocation = gl.getAttribLocation(program, "a_color")
      const matrixLocation = gl.getUniformLocation(program, "u_matrix")
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      var buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -150, -100,
          150, -100,
          -150, 100,
          150, -100,
          -150, 100,
          150, 100,
        ]),
        gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      var size = 2;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
        ]),
        gl.STATIC_DRAW);
      gl.enableVertexAttribArray(colorLocation);
      var size = 4;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      // const matrix = [1, 2, 3, 4, 5, 6]
      // gl.uniformMatrix3fv(matrixLocation, false, matrix);
      var offset = 0;
      var count = 6;
      gl.drawArrays(gl.TRIANGLES, offset, count);
    }
  }, [])


  return <div style={{ border: "1px solid green" }}>
    <canvas ref={canvasRef}></canvas>
  </div>
}
