import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader, degToRad, radToDeg } from "..";
import { m4 } from ".";
import { Slider } from "antd";
var vertexShaderSource = `#version 300 es

in vec4 a_position;
in vec4 a_color;
uniform mat4 u_matrix;
out vec4 v_color;
void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`;
var fragmentShaderSource = `#version 300 es

precision highp float;
in vec4 v_color;
out vec4 outColor;
void main() {
  outColor = v_color;
}
`;
//透视投影： 基础特性就是离得越远显得越小
export const PerspectiveProjection: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [translate, setTranslate] = useState([-150, 0, -360])
  const [rotation, setRotation] = useState([degToRad(190), degToRad(40), degToRad(30)])
  const [scale, setScale] = useState([0.5, 0.5, 0.5])
  const [fieldOfViewRadians, setFieldOfViewRadians] = useState(degToRad(60))

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
      const colorAttributeLocation = gl.getAttribLocation(program, "a_color")
      const matrixLocation = gl.getUniformLocation(program, "u_matrix")
      const positionBuffer = gl.createBuffer()
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column front
          0, 0, 0,
          0, 150, 0,
          30, 0, 0,
          0, 150, 0,
          30, 150, 0,
          30, 0, 0,

          // top rung front
          30, 0, 0,
          30, 30, 0,
          100, 0, 0,
          30, 30, 0,
          100, 30, 0,
          100, 0, 0,

          // middle rung front
          30, 60, 0,
          30, 90, 0,
          67, 60, 0,
          30, 90, 0,
          67, 90, 0,
          67, 60, 0,

          // left column back
          0, 0, 30,
          30, 0, 30,
          0, 150, 30,
          0, 150, 30,
          30, 0, 30,
          30, 150, 30,

          // top rung back
          30, 0, 30,
          100, 0, 30,
          30, 30, 30,
          30, 30, 30,
          100, 0, 30,
          100, 30, 30,

          // middle rung back
          30, 60, 30,
          67, 60, 30,
          30, 90, 30,
          30, 90, 30,
          67, 60, 30,
          67, 90, 30,

          // top
          0, 0, 0,
          100, 0, 0,
          100, 0, 30,
          0, 0, 0,
          100, 0, 30,
          0, 0, 30,

          // top rung right
          100, 0, 0,
          100, 30, 0,
          100, 30, 30,
          100, 0, 0,
          100, 30, 30,
          100, 0, 30,

          // under top rung
          30, 30, 0,
          30, 30, 30,
          100, 30, 30,
          30, 30, 0,
          100, 30, 30,
          100, 30, 0,

          // between top rung and middle
          30, 30, 0,
          30, 60, 30,
          30, 30, 30,
          30, 30, 0,
          30, 60, 0,
          30, 60, 30,

          // top of middle rung
          30, 60, 0,
          67, 60, 30,
          30, 60, 30,
          30, 60, 0,
          67, 60, 0,
          67, 60, 30,

          // right of middle rung
          67, 60, 0,
          67, 90, 30,
          67, 60, 30,
          67, 60, 0,
          67, 90, 0,
          67, 90, 30,

          // bottom of middle rung.
          30, 90, 0,
          30, 90, 30,
          67, 90, 30,
          30, 90, 0,
          67, 90, 30,
          67, 90, 0,

          // right of bottom
          30, 90, 0,
          30, 150, 30,
          30, 90, 30,
          30, 90, 0,
          30, 150, 0,
          30, 150, 30,

          // bottom
          0, 150, 0,
          0, 150, 30,
          30, 150, 30,
          0, 150, 0,
          30, 150, 30,
          30, 150, 0,

          // left side
          0, 0, 0,
          0, 0, 30,
          0, 150, 30,
          0, 0, 0,
          0, 150, 30,
          0, 150, 0,
        ]),
        gl.STATIC_DRAW);
      var size = 3;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
      const colorBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([
          // left column front
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,

          // top rung front
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,

          // middle rung front
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,

          // left column back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,

          // top rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,

          // middle rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,

          // top
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,

          // top rung right
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,

          // under top rung
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,

          // between top rung and middle
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,

          // top of middle rung
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,

          // right of middle rung
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,

          // bottom of middle rung.
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,

          // right of bottom
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,

          // bottom
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,

          // left side
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
        ]),
        gl.STATIC_DRAW);
      gl.enableVertexAttribArray(colorAttributeLocation);
      var size = 3;
      var type1 = gl.UNSIGNED_BYTE;
      var normalize = true;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(colorAttributeLocation, size, type1, normalize, stride, offset);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      var aspect = gl.canvas.width / gl.canvas.height;
      var zNear = 1;
      var zFar = 2000;
      var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
      matrix = m4.translate(matrix, translate[0], translate[1], translate[2]);
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // Draw the geometry.
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
    }
  }, [fieldOfViewRadians, scale, translate, rotation])


  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    <div style={{ display: "flex" }}>
      <div>fieldOfViewRadians: </div>
      <Slider style={{ width: 200 }} min={0} max={175} value={radToDeg(fieldOfViewRadians)} onChange={e => setFieldOfViewRadians(degToRad(e))} />
    </div>
    <div style={{ display: "flex" }}>
      <div>translate x: </div>
      <Slider style={{ width: 200 }} min={-200} max={300} value={translate[0]} onChange={e => setTranslate([e, translate[1], translate[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>translate y: </div>
      <Slider style={{ width: 200 }} min={-200} max={300} value={translate[1]} onChange={e => setTranslate([translate[0], e, translate[2]])} />
    </div>
    <div style={{ display: "flex" }}>
      <div>translate z: </div>
      <Slider style={{ width: 200 }} min={-200} max={300} value={translate[2]} onChange={e => setTranslate([translate[0], translate[1], e])} />
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
  </div>
}