import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader, degToRad, radToDeg } from "..";
import { Slider } from "antd";
import { m4 } from ".";

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
const fragmentShaderSource = `#version 300 es
  // 设置片段着色器默认精度为高精度
  precision highp float;
  in vec4 v_color;
  out vec4 outColor;
  void main(){
    outColor = v_color;
  }
`;


export const OrthographicProjection2: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [translate, setTranslate] = useState([100, 50, 0])
  const [rotation, setRotation] = useState([degToRad(25), degToRad(50), degToRad(325)])
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
      // 单色
      // const colorLocation = gl.getUniformLocation(program, "u_color");
      const matrixLocation = gl.getUniformLocation(program, "u_matrix");
      const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
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
      const size = 3          //每次迭代使用 3 个单位的数据
      const type = gl.FLOAT   // 单位数据类型是32位的浮点型
      const normalize = false // 不需要归一化数据
      const stride = 0        // 每次迭代跳多少距离到下一个数据
      const offset = 0        // 从绑定缓冲的起始处开始
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      // color 多色
      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
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
      const size1 = 3;                //每次迭代使用 3 个单位的数据
      const type1 = gl.UNSIGNED_BYTE; //单位数据类型是无符号8位整数
      const normalize1 = true;        //标准化数据 (从 0-255 转换到 0.0-1.0)
      const stride1 = 0;
      const offset1 = 0;
      gl.vertexAttribPointer(
        colorAttributeLocation, size1, type1, normalize1, stride1, offset1);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      // 开启深度测试
      gl.enable(gl.DEPTH_TEST);

      // 只绘制正面或反面三角形
      gl.enable(gl.CULL_FACE);

      gl.useProgram(program)
      gl.bindVertexArray(vao)
      // 单色
      // gl.uniform4fv(colorLocation, color);

      // Compute the matrix
      var matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
      matrix = m4.translate(matrix, translate[0], translate[1], translate[2]);
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      var primitiveType = gl.TRIANGLES;
      var offset2 = 0;
      var count = 16 * 6;
      gl.drawArrays(primitiveType, offset2, count);
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
