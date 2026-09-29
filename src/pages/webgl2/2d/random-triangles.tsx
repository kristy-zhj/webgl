import { FC, useEffect, useRef } from "react";

const vertexShaderSource = `#version 300 es
  in vec2 a_position;
  uniform vec2 u_resolution;
  void main(){
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position=vec4(clipSpace * vec2(1,-1),0,1);
  }
`;
const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform vec4 u_color;
  out vec4 outColor;

  void main() {
    outColor = u_color;
  }
`;

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

export const RandomTriangles: FC<{}> = ({ }) => {
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
      var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
      var colorLocation = gl.getUniformLocation(program, "u_color");
      const positionBuffer = gl.createBuffer()
      var vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      var size = 2;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      for (var ii = 0; ii < 50; ++ii) {
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
        gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      }
    }
  }, [])

  return <div style={{ border: "1px solid blue" }}>
    <canvas ref={canvasRef}></canvas>
  </div>
}
function randomInt(range: number) {
  return Math.floor(Math.random() * range);
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