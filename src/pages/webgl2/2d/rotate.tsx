import { Slider } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader } from "../index";


var vertexShaderSource = `#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
void main() {
  vec2 rotatedPosition = vec2(
     a_position.x * u_rotation.y + a_position.y * u_rotation.x,
     a_position.y * u_rotation.y - a_position.x * u_rotation.x);
  vec2 position = rotatedPosition + u_translation;
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;
uniform vec4 u_color;
out vec4 outColor;
void main() {
  outColor = u_color;
}
`;

export const Rotate: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotate, setRotate] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
      var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
      var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
      var rotationLocation = gl.getUniformLocation(program, "u_rotation");
      var translationLocation = gl.getUniformLocation(program, "u_translation");
      var colorLocation = gl.getUniformLocation(program, "u_color");
      const positionBuffer = gl.createBuffer()
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      var color = [Math.random(), Math.random(), Math.random(), 1];
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column
          0, 0,
          20, 0,
          0, 90,
          0, 90,
          20, 0,
          20, 90,

          // top rung
          20, 0,
          60, 0,
          20, 20,
          20, 20,
          60, 0,
          60, 20,

          // middle rung
          20, 40,
          50, 40,
          20, 60,
          20, 60,
          50, 40,
          50, 60,
        ]),
        gl.STATIC_DRAW);
      const size = 2
      const type = gl.FLOAT
      const normalize = false
      const stride = 0
      const offset = 0
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      var translation = [100, 50];
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform4fv(colorLocation, color);
      gl.uniform2fv(translationLocation, translation);
      var angleInDegrees = 360 - rotate;
      var angleInRadians = angleInDegrees * Math.PI / 180;
      let rotation = []
      rotation[0] = Math.sin(angleInRadians);
      rotation[1] = Math.cos(angleInRadians);
      gl.uniform2fv(rotationLocation, rotation);
      var primitiveType = gl.TRIANGLES;
      var offset1 = 0;
      var count = 18;
      gl.drawArrays(primitiveType, offset1, count);

    }
  }, [rotate])

  return <div style={{ width: 500, border: "1px solid blue" }}>
    <div>
      <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    </div>
    <div style={{ width: 300, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>rotate: </div>
        <div style={{ flex: 1 }}>
          <Slider min={0} max={360} onChange={setRotate} value={rotate} />
        </div>
      </div>
    </div>
  </div>
}

