import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createProgram, createShader, degToRad } from "..";
import { m4 } from "../3d";
import TextureImg from "@assets/img/noodles.jpg"
import { Slider } from "antd";

const vertexShaderSource = `#version 300 es

  in vec4 a_position;
  in vec2 a_texcoord;
  uniform mat4 u_matrix;
  out vec2 v_texcoord;
  void main(){
    gl_Position= u_matrix * a_position;
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

export const TexcoordMipmap1: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelYRotationRadians, setModelYRotationRadians] = useState(-0.7)
  const [modelXRotationRadians, setModelXRotationRadians] = useState(-0.7)
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
      const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord")
      const matrixLocation = gl.getUniformLocation(program, "u_matrix")
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      setGeometry(gl)
      gl.enableVertexAttribArray(positionAttributeLocation)
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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      const img = new Image()
      img.src = TextureImg
      img.addEventListener("load", () => {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        gl.generateMipmap(gl.TEXTURE_2D)
        drawScene(gl, vao, program, matrixLocation)
      })
    }
  }, [modelXRotationRadians, modelYRotationRadians])
  const setGeometry = (gl: WebGL2RenderingContext) => {
    const positions = new Float32Array([
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
    ])
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  }
  const setTexcoords = (gl: WebGL2RenderingContext) => {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [
          // select the top left image
          0, 0,
          0, 0.5,
          0.25, 0,
          0, 0.5,
          0.25, 0.5,
          0.25, 0,
          // select the top middle image
          0.25, 0,
          0.5, 0,
          0.25, 0.5,
          0.25, 0.5,
          0.5, 0,
          0.5, 0.5,
          // select to top right image
          0.5, 0,
          0.5, 0.5,
          0.75, 0,
          0.5, 0.5,
          0.75, 0.5,
          0.75, 0,
          // select the bottom left image
          0, 0.5,
          0.25, 0.5,
          0, 1,
          0, 1,
          0.25, 0.5,
          0.25, 1,
          // select the bottom middle image
          0.25, 0.5,
          0.25, 1,
          0.5, 0.5,
          0.25, 1,
          0.5, 1,
          0.5, 0.5,
          // select the bottom right image
          0.5, 0.5,
          0.75, 0.5,
          0.5, 1,
          0.5, 1,
          0.75, 0.5,
          0.75, 1,

        ]),
      gl.STATIC_DRAW);

  }
  const drawScene = useCallback((gl: WebGL2RenderingContext, vao: WebGLVertexArrayObject | null, program: WebGLProgram, matrixLocation: WebGLUniformLocation | null,) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Compute the matrix
    var aspect = gl.canvas.width / gl.canvas.height;
    var zNear = 1;
    var zFar = 2000;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    var cameraPosition = [0, 0, 2];
    var up = [0, 1, 0];
    var target = [0, 0, 0];

    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
    matrix = m4.yRotate(matrix, modelYRotationRadians);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }, [modelXRotationRadians, modelYRotationRadians])

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