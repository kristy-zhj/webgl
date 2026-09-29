import { FC, useEffect, useRef } from "react";
import { createProgram, createShader } from "..";
import LeavesImg from "@assets/img/leaves.jpg"
import StarImg from "@assets/img/star.jpg"

const vertexShaderSource = `#version 300 es

  in vec2 a_position;
  in vec2 a_texCoord;
  uniform vec2 u_resolution;
  out vec2 v_texCoord;
  void main(){
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
  }
`;
const fragmentShaderSource = `#version 300 es

  precision highp float;
  uniform sampler2D u_image0;
  uniform sampler2D u_image1;
  in vec2 v_texCoord;
  out vec4 outColor;
  void main() {
    vec4 color0 = texture(u_image0, v_texCoord);
    vec4 color1 = texture(u_image1, v_texCoord);
    outColor = color0 * color1;
  }
`;


export const TexcoordMultiple: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const loadImage = (url: string, callback: () => void) => {
    const image = new Image()
    image.src = url
    image.onload = callback
    return image
  }
  const loadImages = (urls: string[], callback: (images: any[]) => void) => {
    let images: any[] = []
    let imagesToLoad = urls.length;
    // 每个图像加载完成后调用一次
    const onImageLoad = () => {
      --imagesToLoad;
      // 如果所有图像加载完成就调用回调函数
      if (imagesToLoad === 0) {
        callback(images)
      }
    }
    for (let ii = 0; ii < imagesToLoad; ++ii) {
      const image = loadImage(urls[ii], onImageLoad)
      images.push(image)
    }
  }
  const render = (images: any[]) => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
      const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord")
      const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
      // 寻找取样器的位置
      const u_image0Location = gl.getUniformLocation(program, "u_image0")
      const u_image1Location = gl.getUniformLocation(program, "u_image1")
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionAttributeLocation)
      const size = 2
      const type = gl.FLOAT
      const normalize = false
      const stride = 0
      const offset = 0
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      const texCoordBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
      ]), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(texCoordAttributeLocation)
      const size1 = 2
      const type1 = gl.FLOAT
      const normalize1 = false
      const stride1 = 0
      const offset1 = 0
      gl.vertexAttribPointer(texCoordAttributeLocation, size1, type1, normalize1, stride1, offset1)
      const texture = gl.createTexture()
      // 创建两个纹理
      let textures = []
      for (let ii = 0; ii < 2; ++ii) {
        let texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        // 设置参数，不需要贴图
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        //上传图像到纹理
        const mipLevel = 0  //最大的贴图
        const internalFormat = gl.RGBA  //纹理格式
        const srcFormat = gl.RGBA  //提供的数据格式
        const srcType = gl.UNSIGNED_BYTE  //提供的数据类型
        gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, images[ii])
        // 添加纹理到纹理数组
        textures.push(texture)
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      setRectangle(gl, 0, 0, images[0].width, images[0].height)
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindVertexArray(vao)
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
      // 着色器获得纹理单元
      gl.uniform1i(u_image0Location, 0) //纹理单元 0
      gl.uniform1i(u_image1Location, 1) //纹理单元 1
      // 设置每个纹理单元对应一个纹理
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, textures[0])
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, textures[1])
      const primitiveType = gl.TRIANGLES
      const offset2 = 0
      const count = 6
      gl.drawArrays(primitiveType, offset2, count)

    }
  }
  function setRectangle(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), gl.STATIC_DRAW);
  }
  useEffect(() => {
    loadImages([LeavesImg, StarImg], render)
  })

  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
  </div>
}