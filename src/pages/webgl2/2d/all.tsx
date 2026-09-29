import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader, m3 } from "..";
import { Slider } from "antd";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

// A matrix to transform the positions by
uniform mat3 u_matrix;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = position / u_resolution;

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

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

export const All: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [translation, setTranslation] = useState([0, 0])
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState([0.5, 0.5])
  const [color, setColor] = useState([Math.random(), Math.random(), Math.random(), 1])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
      const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
      const colorLocation = gl.getUniformLocation(program, "u_color");
      const matrixLocation = gl.getUniformLocation(program, "u_matrix");
      const positionBuffer = gl.createBuffer()
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
        ]),
        gl.STATIC_DRAW);
      const size = 2
      const type = gl.FLOAT
      const normalize = false
      const stride = 0
      const offset = 0
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindVertexArray(vao)
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
      gl.uniform4fv(colorLocation, color)
      const translationMatrix = m3.translation(translation[0], translation[1])
      const rotate = (360 - rotation) * Math.PI / 180
      const rotationMatrix = m3.rotation(rotate)
      const scaleMatrix = m3.scaling(scale[0], scale[1])
      // 根据顶点旋转
      let matrix = m3.multiply(scaleMatrix, rotationMatrix)
      matrix = m3.multiply(matrix, translationMatrix)
      // 根据当前位置旋转
      // let matrix = m3.multiply(translationMatrix, rotationMatrix)
      // matrix = m3.multiply(matrix, scaleMatrix)
      gl.uniformMatrix3fv(matrixLocation, false, matrix)
      const primitiveType = gl.TRIANGLES
      const offset1 = 0
      const count = 18
      gl.drawArrays(primitiveType, offset1, count)

    }
  }, [rotation, scale, translation])


  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    <div style={{ width: 300, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>scaleX: </div>
        <div style={{ flex: 1 }}>
          <Slider min={-1} max={2} step={0.01} onChange={e => setScale([e, scale[1]])} value={scale[0]} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>scaleY: </div>
        <div style={{ flex: 1 }}>
          <Slider min={-1} max={2} step={0.01} onChange={e => setScale([scale[0], e])} value={scale[1]} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>rotate: </div>
        <div style={{ flex: 1 }}>
          <Slider min={0} max={360} step={1} onChange={setRotation} value={rotation} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>x: </div>
        <div style={{ flex: 1 }}>
          <Slider min={0} max={300} onChange={e => setTranslation([e, translation[1]])} value={translation[0]} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>y: </div>
        <div style={{ flex: 1 }}>
          <Slider min={0} max={300} onChange={e => setTranslation([translation[0], e])} value={translation[1]} />
        </div>
      </div>
    </div>
  </div>
}