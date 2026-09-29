import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader } from "../index";
import { Slider } from "antd";

var vertexShaderSource = `#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
void main() {
  vec2 scaledPosition = a_position * u_scale;
  vec2 rotatedPosition = vec2(
     scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
     scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);
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

export const Scale: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scaleX, setScaleX] = useState(0.5)
  const [scaleY, setScaleY] = useState(0.5)

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
      var translationLocation = gl.getUniformLocation(program, "u_translation");
      var rotationLocation = gl.getUniformLocation(program, "u_rotation");
      var colorLocation = gl.getUniformLocation(program, "u_color");
      var scaleLocation = gl.getUniformLocation(program, "u_scale");
      var positionBuffer = gl.createBuffer();
      var vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
        ]),
        gl.STATIC_DRAW);
      var size = 2;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
      var translation = [100, 50];
      var rotation = [0, 1];
      var scale = [scaleX, scaleY];
      var color = [Math.random(), Math.random(), Math.random(), 1];
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform4fv(colorLocation, color);
      gl.uniform2fv(rotationLocation, rotation);
      gl.uniform2fv(translationLocation, translation);
      gl.uniform2fv(scaleLocation, scale);
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 18;
      gl.drawArrays(primitiveType, offset, count);

    }
  }, [scaleX, scaleY])

  return <div style={{ border: "1px solid green" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    <div style={{ display: "flex" }}>
      <div>Scale X: </div>
      <Slider style={{ width: 200 }} step={0.01} min={-1} max={2} value={scaleX} onChange={setScaleX} />
    </div>
    <div style={{ display: "flex" }}>
      <div>scale Y: </div>
      <Slider style={{ width: 200 }} step={0.01} min={-1} max={2} value={scaleY} onChange={setScaleY} />
    </div>
  </div>
}
