import { FC, useEffect, useRef } from "react";

export const Triangles: FC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return
      const vsGLSL = `#version 300 es
      in vec4 position;
      in vec4 color;

      out vec4 v_color;

      void main() {
          gl_Position = position;
          v_color = color;
      }
      `;

      const fsGLSL = `#version 300 es
        precision highp float;

        in vec4 v_color;

        out vec4 outColor;

        void main() {
            outColor = v_color;
        }
        `;

      const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
      gl.shaderSource(vertexShader, vsGLSL);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vertexShader) + "")
      };

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
      gl.shaderSource(fragmentShader, fsGLSL);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fragmentShader) + "")
      };

      const prg = gl.createProgram() as WebGLProgram;
      gl.attachShader(prg, vertexShader);
      gl.attachShader(prg, fragmentShader);
      gl.linkProgram(prg);
      if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prg) + "")
      };


      // NOTE! These are only here to unclutter the diagram.
      // It is safe to detach and delete shaders once
      // a program is linked though it is arguably not common.
      // and I usually don't do it.
      gl.detachShader(prg, vertexShader);
      gl.deleteShader(vertexShader);
      gl.detachShader(prg, fragmentShader);
      gl.deleteShader(fragmentShader);

      const positionLoc = gl.getAttribLocation(prg, 'position');
      const colorLoc = gl.getAttribLocation(prg, 'color');

      const triangleVAO = gl.createVertexArray();
      gl.bindVertexArray(triangleVAO);

      // in clip space
      const vertexPositions = new Float32Array([
        0, 0.7,
        0.5, -0.7,
        -0.5, -0.7,
      ]);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

      const vertexColors = new Uint8Array([
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255,
      ]);

      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);

      gl.enableVertexAttribArray(positionLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(
        positionLoc,
        2,            // 2 values per vertex shader iteration
        gl.FLOAT,     // data is 32bit floats
        false,        // don't normalize
        0,            // stride (0 = auto)
        0,            // offset into buffer
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(
        colorLoc,
        4,                // 4 values per vertex shader iteration
        gl.UNSIGNED_BYTE, // data is 8bit unsigned bytes
        true,             // do normalize
        0,                // stride (0 = auto)
        0,                // offset into buffer
      );

      gl.useProgram(prg);

      // compute 3 vertices for 1 triangle
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }, [])

  return <div style={{ border: "1px solid red" }}>
    <canvas ref={canvasRef}></canvas>
  </div>
}