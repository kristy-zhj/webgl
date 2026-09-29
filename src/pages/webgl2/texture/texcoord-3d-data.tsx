import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader, degToRad } from "..";
import { m4 } from "../3d";
import Sider from "antd/es/layout/Sider";
import { Slider } from "antd";

const vertexShaderSource = `#version 300 es

  in vec4 a_position;
  in vec2 a_texcoord;
  uniform mat4 u_matrix;
  out vec2 v_texcoord;
  void main(){
    gl_Position = u_matrix * a_position;
    v_texcoord = a_texcoord;
  }
`;
const fragmentShaderSource = `#version 300 es

  precision highp float;
  in vec2 v_texcoord;
  uniform sampler2D u_texture;
  out vec4 outColor;
  void main(){
    outColor = texture(u_texture, v_texcoord);
  }
`;

export const Texcoord3dData: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fieldOfViewRadians, setFieldOfViewRadians] = useState(degToRad(60))
  const [modelXRotationRadians, setModelXRotationRadians] = useState(degToRad(0))
  const [modelYRotationRadians, setModelYRotationRadians] = useState(degToRad(0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
      const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord")
      const matrixLocation = gl.getUniformLocation(program, "u_matrix")
      const textureLocation = gl.getUniformLocation(program, "u_texture")
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
      const size1 = 2
      const type1 = gl.FLOAT
      const normalize1 = true
      const stride1 = 0
      const offset1 = 0
      gl.vertexAttribPointer(texcoordAttributeLocation, size1, type1, normalize1, stride1, offset1)
      const texture = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + 0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      {
        const level = 0;
        const internalFormat = gl.R8;
        const width = 3;
        const height = 2;
        const border = 0;
        const format = gl.RED;
        const type = gl.UNSIGNED_BYTE;
        const data = new Uint8Array([
          128, 64, 128,
          0, 192, 0,
        ]);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
          format, type, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
      drawScene(gl, program, vao, matrixLocation, textureLocation)
    }
  }, [modelXRotationRadians, modelYRotationRadians])

  const setGeometry = (gl: WebGL2RenderingContext) => {
    const positions = new Float32Array(
      [
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,

        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,

        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,

        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,

      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  const setTexcoords = (gl: WebGL2RenderingContext) => {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [
          0, 0,
          0, 1,
          1, 0,
          0, 1,
          1, 1,
          1, 0,

          0, 0,
          0, 1,
          1, 0,
          1, 0,
          0, 1,
          1, 1,

          0, 0,
          0, 1,
          1, 0,
          0, 1,
          1, 1,
          1, 0,

          0, 0,
          0, 1,
          1, 0,
          1, 0,
          0, 1,
          1, 1,

          0, 0,
          0, 1,
          1, 0,
          0, 1,
          1, 1,
          1, 0,

          0, 0,
          0, 1,
          1, 0,
          1, 0,
          0, 1,
          1, 1,

        ]),
      gl.STATIC_DRAW);
  }
  const drawScene = (gl: WebGL2RenderingContext, program: WebGLProgram, vao: WebGLVertexArrayObject | null, matrixLocation: WebGLUniformLocation | null, textureLocation: WebGLUniformLocation | null) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    var aspect = gl.canvas.width / gl.canvas.height;
    var projectionMatrix =
      m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
    var cameraPosition = [0, 0, 2];
    var up = [0, 1, 0];
    var target = [0, 0, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    var viewMatrix = m4.inverse(cameraMatrix);
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
    matrix = m4.yRotate(matrix, modelYRotationRadians);
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.uniform1i(textureLocation, 0);
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }

  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    <div style={{ display: "flex" }}>
      <div>x</div>
      <Slider style={{ width: 300 }} min={-7} max={7} value={modelXRotationRadians} onChange={e => setModelXRotationRadians(e)} />
    </div>
    <div style={{ display: "flex" }}>
      <div>y</div>
      <Slider style={{ width: 300 }} min={-7} max={7} value={modelYRotationRadians} onChange={e => setModelYRotationRadians(e)} />
    </div>
  </div>
}