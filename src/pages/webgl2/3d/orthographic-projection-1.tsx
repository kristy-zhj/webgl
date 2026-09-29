import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader, degToRad, m4, radToDeg } from "..";
import { Slider } from "antd";

const vertexShaderSource = `#version 300 es

  in vec4 a_position;
  // 通过以下方式转换位置的矩阵
  uniform mat4 u_matrix;
  void main(){
    gl_Position =u_matrix * a_position;
  }
`;
const fragmentShaderSource = `#version 300 es
  // 设置片段着色器默认精度为高精度
  precision highp float;
  uniform vec4 u_color;
  out vec4 outColor;
  void main(){
    outColor = u_color;
  }
`;

// 正射投影
export const OrthographicProjection: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [translate, setTranslate] = useState([0, 0, 0])
  const [rotation, setRotation] = useState([degToRad(0), degToRad(0), degToRad(0)])
  const [scale, setScale] = useState([0.5, 0.5, 0.5])
  const [color, setColor] = useState([Math.random(), Math.random(), Math.random(), 1])

  // F 在三维中过于扁平， 所以很难看出三维效果
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
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
          0, 0, 0,
          30, 0, 0,
          0, 150, 0,
          0, 150, 0,
          30, 0, 0,
          30, 150, 0,

          // top rung
          30, 0, 0,
          100, 0, 0,
          30, 30, 0,
          30, 30, 0,
          100, 0, 0,
          100, 30, 0,

          // middle rung
          30, 60, 0,
          67, 60, 0,
          30, 90, 0,
          30, 90, 0,
          67, 60, 0,
          67, 90, 0,
        ]),
        gl.STATIC_DRAW);
      const size = 3
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
      gl.uniform4fv(colorLocation, color);

      // Compute the matrix
      var matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
      matrix = m4.translate(matrix, translate[0], translate[1], translate[2]);
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      var primitiveType = gl.TRIANGLES;
      var offset1 = 0;
      var count = 18;
      gl.drawArrays(primitiveType, offset1, count);
    }
  }, [translate, rotation, scale])

  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    <div style={{ display: "flex" }}>
      <div>translate x: </div>
      <Slider style={{ width: 200 }} min={0} max={250} value={translate[0]} onChange={e => setTranslate([e, translate[1], translate[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>translate y: </div>
      <Slider style={{ width: 200 }} min={0} max={60} value={translate[1]} onChange={e => setTranslate([translate[0], e, translate[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>translate z: </div>
      <Slider style={{ width: 200 }} min={0} max={300} value={translate[2]} onChange={e => setTranslate([translate[0], translate[1], e])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>rotate x: </div>
      <Slider style={{ width: 200 }} min={0} max={360} value={radToDeg(rotation[0])} onChange={e => setRotation([degToRad(e), rotation[1], rotation[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>rotate y: </div>
      <Slider style={{ width: 200 }} min={0} max={360} value={radToDeg(rotation[1])} onChange={e => setRotation([rotation[0], degToRad(e), rotation[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>rotate z: </div>
      <Slider style={{ width: 200 }} min={0} max={360} value={radToDeg(rotation[2])} onChange={e => setRotation([rotation[0], rotation[1], degToRad(e)])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>scale x: </div>
      <Slider style={{ width: 200 }} min={-1} max={1} step={0.1} value={scale[0]} onChange={e => setScale([e, scale[1], scale[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>scale y: </div>
      <Slider style={{ width: 200 }} min={-1} max={1} step={0.1} value={scale[1]} onChange={e => setScale([scale[0], e, scale[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>scale z: </div>
      <Slider style={{ width: 200 }} min={-1} max={1} step={0.1} value={scale[2]} onChange={e => setScale([scale[0], scale[1], e])} />
    </div>
  </div>
}