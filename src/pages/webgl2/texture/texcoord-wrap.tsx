import { FC, useEffect, useRef } from "react";
import { createProgram, createShader } from "..";
import TextureImg from "@assets/img/f-texture.png"
import { m4 } from "../3d";

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
    outColor = texture(u_texture,v_texcoord);
  }
`;

export const TexcoordWrap: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
      gl.activeTexture(gl.TEXTURE + 0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
      const img = new Image()
      img.src = TextureImg
      img.addEventListener("load", () => {
        // 现在图像已经加载，请将其复制到纹理中。
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        gl.generateMipmap(gl.TEXTURE_2D)
        var wrapS = gl.REPEAT;
        var wrapT = gl.REPEAT;
        drawScene(gl, vao, program, texture, wrapS, wrapT, matrixLocation)
      })
    }
  }, [])
  const setGeometry = (gl: WebGL2RenderingContext) => {
    const positions = new Float32Array([
      -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
      -0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5,
      0.5, 0.5, 0.5,
      0.5, -0.5, 0.5,
    ])
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  }
  const setTexcoords = (gl: WebGL2RenderingContext) => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -3, -1,
      2, -1,
      -3, 4,
      -3, 4,
      2, -1,
      2, 4,
    ]), gl.STATIC_DRAW)
  }
  const drawScene = (gl: WebGL2RenderingContext, vao: WebGLVertexArrayObject | null, program: WebGLProgram, texture: WebGLTexture | null, wrapS: number, wrapT: number, matrixLocation: WebGLUniformLocation | null) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.useProgram(program)
    gl.bindVertexArray(vao)
    const scaleFactor = 2.5
    const size = 60 * scaleFactor
    const x = gl.canvas.width / 2 - size / 2
    const y = gl.canvas.height - size
    let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1, [])
    matrix = m4.translate(matrix, x, y, 0)
    matrix = m4.scale(matrix, size, size, 1)
    matrix = m4.translate(matrix, 0.5, 0.5, 0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT)
    gl.uniformMatrix4fv(matrixLocation, false, matrix)
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 1 * 6
    gl.drawArrays(primitiveType, offset, count)

  }

  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
  </div>
}