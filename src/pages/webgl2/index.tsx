import { off } from "process";
import { FC, useEffect, useRef } from "react"
import { Triangles } from "./2d/triangles";
import { Rectangle } from "./2d/rectangle";
import { RandomTriangles } from "./2d/random-triangles";
import { TwoRectangleTriangle } from "./2d/tow-rectangle-to-triangle";
import { Translation } from "./2d/translation";
import { Rotate } from "./2d/rotate";
import { ImageModule } from "./2d/image";
import { OneRectangle } from "./2d/one-rectangle";
import { Scale } from "./2d/scale";
import { OrthographicProjection } from "./3d/orthographic-projection-1";
import { All } from "./2d/all";
import { OrthographicProjection2 } from "./3d/orthographic-projection-2";
import { PerspectiveProjection } from "./3d/perspective-projection";
import { Camera } from "./3d/camera";
import { Camera2 } from "./3d/camera-2";
import { Camera3 } from "./3d/camera-3";
import { Texcoord } from "./texture/texcoord";
import { TexcoordWrap } from "./texture/texcoord-wrap";
import { TexcoordMipmap } from "./texture/texcoord-mipmap";
import { TexcoordMipmap1 } from "./texture/texcoord-mipmap-1";
import { Texcoord3dData } from "./texture/texcoord-3d-data";
import { TexcoordMultiple } from "./texture/texcoord-multiple";

// 创建着色器
export function createShader(gl: WebGL2RenderingContext, type: any, source: string) {
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
export function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
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
export const Webgl2: FC<{}> = ({ }) => {
  return <>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <TexcoordMultiple />
      <Texcoord3dData />
      <TexcoordMipmap1 />
      <TexcoordMipmap />
      <TexcoordWrap />
      {/* <Texcoord />
      <Camera3 />
      <Camera2 />
      <Camera />
      <PerspectiveProjection />
      <OrthographicProjection2 />
      <OrthographicProjection /> */}
    </div>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {/* <All />
      <ImageModule />
      <Scale />
      <Rotate />
      <Translation />
      <Triangles />
      <Rectangle />
      <RandomTriangles />
      <TwoRectangleTriangle />
      <OneRectangle /> */}
    </div>
  </>
}
export const m3 = {
  translation: function translation(tx: number, ty: number) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function rotation(angleInRadians: number) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },

  scaling: function scaling(sx: number, sy: number) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function multiply(a: number[], b: number[]) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};
export const m4 = {
  translation: function (tx: number, ty: number, tz: number) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]
  },

  xRotation: function (angleInRadians: number) {
    var c = Math.cos(angleInRadians)
    var s = Math.sin(angleInRadians)

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]
  },

  yRotation: function (angleInRadians: number) {
    var c = Math.cos(angleInRadians)
    var s = Math.sin(angleInRadians)

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]
  },

  zRotation: function (angleInRadians: number) {
    var c = Math.cos(angleInRadians)
    var s = Math.sin(angleInRadians)

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  },

  scaling: function (sx: number, sy: number, sz: number) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]
  },
  projection: function (width: number, height: number, depth: number) {
    //注意：此矩阵翻转Y轴，因此0位于顶部
    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },
  multiply: function (a: number[], b: number[]) {
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];

    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },
  translate: function (m: number[], tx: number, ty: number, tz: number) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m: number[], angleInRadians: number) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m: number[], angleInRadians: number) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m: number[], angleInRadians: number) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m: number[], sx: number, sy: number, sz: number) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
}
export const degToRad = (deg: number) => {
  return deg * Math.PI / 180;
}
export const radToDeg = (rad: number) => {
  return 180 * rad / Math.PI;
}