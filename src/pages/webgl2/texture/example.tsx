import { FC, useEffect, useRef } from "react";

const vertexShaderSource = `#version 300 es

`;

const fragmentShaderSource = `#version 300 es

`;

export const Example: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext("webgl2")
      if (!gl) return



    }
  }, [])


  return <div style={{ border: "1px solid pink" }}>
    <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
  </div>
}