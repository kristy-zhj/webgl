import { Slider } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader } from "../index";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

// all shaders have a main function
void main() {

  // 将矩形从像素转换为 0.0 到 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

// 需要声明片段着色器的输出
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

export const Translation: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [rotate, setRotate] = useState(0)
  const [maxX, setMaxX] = useState(20)
  const [maxY, setMaxY] = useState(20)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
      const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
      const colorLocation = gl.getUniformLocation(program, "u_color")
      const positionBuffer = gl.createBuffer()
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      const size = 2
      const type = gl.FLOAT
      const normalize = false
      const stride = 0
      const offset = 0
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      const translation = [x, y]
      const width = 100
      const height = 30
      const color = [1, 0.5, 0.5, 1]
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        translation[0], translation[1],
        translation[0] + width, translation[1],
        translation[0], translation[1] + height,
        translation[0], translation[1] + height,
        translation[0] + width, translation[1],
        translation[0] + width, translation[1] + height,
      ]), gl.STATIC_DRAW)
      gl.uniform4fv(colorLocation, color);
      var primitiveType = gl.TRIANGLES;
      var offsets = 0;
      var count = 6;
      gl.drawArrays(primitiveType, offsets, count);
      setMaxX(gl.canvas.width - 100)
      setMaxY(gl.canvas.height - 30)
    }
  }, [x, y])

  return <div style={{ width: 500, border: "1px solid blue" }}>
    <div>
      <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    </div>
    <div style={{ width: 300, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>translate x: </div>
        <div style={{ flex: 1 }}>
          <Slider min={0} max={maxX} onChange={setX} value={x} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>translate y: </div>
        <div style={{ flex: 1 }}>
          <Slider min={0} max={maxY} onChange={setY} value={y} />
        </div>
      </div>
    </div>
  </div>
}
