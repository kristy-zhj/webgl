import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createProgram, createShader, degToRad } from "..";
import TextureImg from "@assets/img/mip-low-res-example.png"
import { m4 } from "../3d";

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

export const TexcoordMipmap: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zDepth, setZDepth] = useState(50)

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
      const mipTexture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, mipTexture)
      const c = document.createElement("canvas")
      const ctx = c.getContext("2d")
      const mips = [
        { size: 64, color: "rgb(128,0,255)", },
        { size: 32, color: "rgb(0,0,255)", },
        { size: 16, color: "rgb(255,0,0)", },
        { size: 8, color: "rgb(255,255,0)", },
        { size: 4, color: "rgb(0,255,0)", },
        { size: 2, color: "rgb(0,255,255)", },
        { size: 1, color: "rgb(255,0,255)", },
      ]
      mips.forEach((s, level) => {
        const size = s.size
        c.width = size
        c.height = size
        if (ctx) {
          ctx.fillStyle = "rgba(255,255,255)"
          ctx.fillRect(0, 0, size, size)
          ctx.fillStyle = s.color
          ctx.fillRect(size / 2, size / 2, size / 2, size / 2)
          gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c)
        }
      })
      const texture = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + 0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
      const img = new Image()
      img.src = TextureImg
      img.addEventListener("load", () => {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.generateMipmap(gl.TEXTURE_2D)
        drawScene(gl, vao, program, texture, matrixLocation, mipTexture, 0)
      })
      let index = 0
      document.querySelector("body").addEventListener('click', function () {
        index = (index + 1) % 2;
        drawScene(gl, vao, program, texture, matrixLocation, mipTexture, index)
      });
    }
  }, [])
  const setGeometry = (gl: WebGL2RenderingContext) => {
    const positions = new Float32Array([
      -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
      -0.5, 0.5, 0.5,
      -0.5, 0.5, 0.5,
      0.5, 0.5, -0.5,
      0.5, 0.5, 0.5,
    ])
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  }
  const setTexcoords = (gl: WebGL2RenderingContext) => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      1, 0,
      0, zDepth,
      0, zDepth,
      1, 0,
      1, zDepth,
    ]), gl.STATIC_DRAW)
  }
  const drawScene = useCallback((gl: WebGL2RenderingContext, vao: WebGLVertexArrayObject | null, program: WebGLProgram, texture: WebGLTexture | null, matrixLocation: WebGLUniformLocation | null, mipTexture: WebGLTexture | null, textureIndex: number) => {
    var fieldOfViewRadians = degToRad(60);
    var textures = [
      texture,
      mipTexture,
    ];
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.useProgram(program)
    gl.bindVertexArray(vao)
    var aspect = gl.canvas.width / gl.canvas.height;
    var zNear = 1;
    var zFar = 2000;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    var cameraPosition = [0, 0, 2];
    var up = [0, 1, 0];
    var target = [0, 0, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    var viewMatrix = m4.inverse(cameraMatrix);
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    var settings = [
      { x: -1, y: 1, zRot: 0, magFilter: gl.NEAREST, minFilter: gl.NEAREST, },
      { x: 0, y: 1, zRot: 0, magFilter: gl.LINEAR, minFilter: gl.LINEAR, },
      { x: 1, y: 1, zRot: 0, magFilter: gl.LINEAR, minFilter: gl.NEAREST_MIPMAP_NEAREST, },
      { x: -1, y: -1, zRot: 1, magFilter: gl.LINEAR, minFilter: gl.LINEAR_MIPMAP_NEAREST, },
      { x: 0, y: -1, zRot: 1, magFilter: gl.LINEAR, minFilter: gl.NEAREST_MIPMAP_LINEAR, },
      { x: 1, y: -1, zRot: 1, magFilter: gl.LINEAR, minFilter: gl.LINEAR_MIPMAP_LINEAR, },
    ];
    var xSpacing = 1.2;
    var ySpacing = 0.7;
    settings.forEach(function (s) {
      if (!textures) return
      gl.bindTexture(gl.TEXTURE_2D, textures[textureIndex]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, s.minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, s.magFilter);

      var matrix = m4.translate(viewProjectionMatrix, s.x * xSpacing, s.y * ySpacing, -zDepth * 0.5);
      matrix = m4.zRotate(matrix, s.zRot * Math.PI);
      matrix = m4.scale(matrix, 1, 1, zDepth);
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

    })
  }, [])

  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
  </div>
}