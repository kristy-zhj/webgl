import { FC, useEffect, useRef } from "react";

// 顶点着色器
var vertexShaderSource = `#version 300 es

  // 属性是顶点着色器的输入（in）。
  // 它将从缓冲区接收数据
  in vec2 a_position;

  //  用于传入画布的分辨率
  uniform vec2 u_resolution;

  // 所有着色器都有一个主要功能
  void main() {

    // 将位置从像素转换为0.0到1.0
    vec2 zeroToOne = a_position / u_resolution;

    // 从0->1转换为0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // 从0->2转换为-1->+1（片段空间）
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
  }
  `;
// 片段着色器
var fragmentShaderSource = `#version 300 es

  // 片段着色器没有默认精度，因此我们需要
  // 选择一个。highp是一个很好的默认值。意思是“高精度”
  precision highp float;

  // 们需要声明片段着色器的输出
  out vec4 outColor;

  void main() {
    // 只需将输出设置为恒定的redish紫色
    outColor = vec4(1, 0, 0.5, 1);
  }
  `;
// 创建着色器
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
export const Rectangle: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      // 链接两个着色器成一个程序并调用它
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram

      // 查找顶点数据需要放在哪里
      var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

      // 查找统一位置
      var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

      // 创建一个缓冲区，并在其中放置三个二维空间剪裁点
      var positionBuffer = gl.createBuffer();

      // 将其绑定到 ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      var positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      // 创建顶点阵列对象 (属性状态)
      var vao = gl.createVertexArray();

      // 绑定属性
      gl.bindVertexArray(vao);

      // 启用属性
      gl.enableVertexAttribArray(positionAttributeLocation);

      // 告诉属性如何从positionBuffer中获取数据 (ARRAY_BUFFER)
      var size = 2;          // 迭代两个数组
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // 不要规范数据化
      var stride = 0;        // 0=向前移动大小*sizeof（type）每次迭代以获得下一个位置
      var offset = 0;        // 从缓冲区的开头开始
      gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

      // webgl-utils 使用不了
      // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

      // 告诉WebGL如何从剪辑空间转换为像素
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 使用程序 (pair of shaders)
      gl.useProgram(program);

      // 绑定我们想要的属性/缓冲区集。
      gl.bindVertexArray(vao);

      //传入画布分辨率，以便我们可以从
      //着色器中要剪裁的像素
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      // draw
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      gl.drawArrays(primitiveType, offset, count);
    }
  }, [])


  return <div style={{ border: "1px solid purple" }}>
    <canvas ref={canvasRef}></canvas>
  </div>
}