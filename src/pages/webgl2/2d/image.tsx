import { FC, useEffect, useRef, useState } from "react";
import { createProgram, createShader } from "../index";
import { Select } from "antd";
import img from "@assets/img/leaves.jpg"
type Type = "normal" | "gaussianBlur" | "gaussianBlur2" | "gaussianBlur3" | "unsharpen" | "sharpness" | "sharpen" | "edgeDetect" | "edgeDetect2" | "edgeDetect3" | "edgeDetect4" | "edgeDetect5" | "edgeDetect6" | "sobelHorizontal" | "sobelVertical" | "previtHorizontal" | "previtVertical" | "boxBlur" | "triangleBlur" | "emboss"
var vertexShaderSource = `#version 300 es

// 属性是顶点着色器的输入 (in)
// 它将从缓冲区接收数据
in vec2 a_position;
in vec2 a_texCoord;

// 用于传入画布的分辨率
uniform vec2 u_resolution;

// 用于将纹理坐标传递给片段着色器
out vec2 v_texCoord;

// 所有着色器都有一个主要功能
void main() {

  // 将位置从像素转换为0.0到1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  // 将texCoord传递到片段着色器
  // GPU将在点之间对该值进行插值。
  v_texCoord = a_texCoord;
}
`;

var fragmentShaderSource = `#version 300 es

// 片段着色器没有默认精度，因此我们需要
//选择一个。highp是一个很好的默认值。意思是“高精度”
precision highp float;

// our texture
uniform sampler2D u_image;

// the convolution kernal data
uniform float u_kernel[9];
uniform float u_kernelWeight;

// 从顶点着色器传入的texCoords。
in vec2 v_texCoord;

// 我们需要声明片段着色器的输出
out vec4 outColor;
void main() {
  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));
  vec4 colorSum =
      texture(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
      texture(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
      texture(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
      texture(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
      texture(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
      texture(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
      texture(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
      texture(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
      texture(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
  outColor = vec4((colorSum / u_kernelWeight).rgb, 1);
}
`;
export const ImageModule: FC<{}> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<Type>("normal")

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      var image = new Image();
      image.src = img;  // MUST BE SAME DOMAIN!!!
      image.onload = function () {
        const gl = canvas.getContext("webgl2")
        if (!gl) return
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader
        const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        var imageLocation = gl.getUniformLocation(program, "u_image");
        var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
        var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
        var vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        var positionBuffer = gl.createBuffer();
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0.0, 0.0,
          1.0, 0.0,
          0.0, 1.0,
          0.0, 1.0,
          1.0, 0.0,
          1.0, 1.0,
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texCoordAttributeLocation);
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
          texCoordAttributeLocation, size, type, normalize, stride, offset);
        // 创建纹理
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 设置参数以便我们可以渲染任何尺寸的图像。
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        var mipLevel = 0;               // the largest mip
        var internalFormat = gl.RGBA;   // format we want in the texture
        var srcFormat = gl.RGBA;        // format of data we are supplying
        var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
        // 将图像上传到纹理中。
        gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0, 0,
          0 + image.width, 0,
          0, 0 + image.height,
          0, 0 + image.height,
          0 + image.width, 0,
          0 + image.width, 0 + image.height,
        ]), gl.STATIC_DRAW);
        var kernels: any = {
          "normal": [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0,
          ],
          "gaussianBlur": [
            0.045, 0.122, 0.045,
            0.122, 0.332, 0.122,
            0.045, 0.122, 0.045,
          ],
          "gaussianBlur2": [
            1, 2, 1,
            2, 4, 2,
            1, 2, 1,
          ],
          "gaussianBlur3": [
            0, 1, 0,
            1, 1, 1,
            0, 1, 0,
          ],
          "unsharpen": [
            -1, -1, -1,
            -1, 9, -1,
            -1, -1, -1,
          ],
          "sharpness": [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0,
          ],
          "sharpen": [
            -1, -1, -1,
            -1, 16, -1,
            -1, -1, -1,
          ],
          "edgeDetect": [
            -0.125, -0.125, -0.125,
            -0.125, 1, -0.125,
            -0.125, -0.125, -0.125,
          ],
          "edgeDetect2": [
            -1, -1, -1,
            -1, 8, -1,
            -1, -1, -1,
          ],
          "edgeDetect3": [
            -5, 0, 0,
            0, 0, 0,
            0, 0, 5,
          ],
          "edgeDetect4": [
            -1, -1, -1,
            0, 0, 0,
            1, 1, 1,
          ],
          "edgeDetect5": [
            -1, -1, -1,
            2, 2, 2,
            -1, -1, -1,
          ],
          "edgeDetect6": [
            -5, -5, -5,
            -5, 39, -5,
            -5, -5, -5,
          ],
          "sobelHorizontal": [
            1, 2, 1,
            0, 0, 0,
            -1, -2, -1,
          ],
          "sobelVertical": [
            1, 0, -1,
            2, 0, -2,
            1, 0, -1,
          ],
          "previtHorizontal": [
            1, 1, 1,
            0, 0, 0,
            -1, -1, -1,
          ],
          "previtVertical": [
            1, 0, -1,
            1, 0, -1,
            1, 0, -1,
          ],
          "boxBlur": [
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111,
          ],
          "triangleBlur": [
            0.0625, 0.125, 0.0625,
            0.125, 0.25, 0.125,
            0.0625, 0.125, 0.0625,
          ],
          "emboss": [
            -2, -1, 0,
            -1, 1, 1,
            0, 1, 2,
          ],
        };
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform1i(imageLocation, 0);
        gl.uniform1fv(kernelLocation, kernels[state]);
        gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[state]));
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      };
    }
  }, [state])


  return <div style={{ border: "1px solid purple", }}>
    <div>
      <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
    </div>
    <Select style={{ width: 200 }} value={state} onChange={setState}
      options={[
        { value: "normal", label: "normal" },
        { value: "gaussianBlur", label: "gaussianBlur" },
        { value: "gaussianBlur2", label: "gaussianBlur2" },
        { value: "gaussianBlur3", label: "gaussianBlur3" },
        { value: "unsharpen", label: "unsharpen" },
        { value: "sharpness", label: "sharpness" },
        { value: "sharpen", label: "sharpen" },
        { value: "edgeDetect", label: "edgeDetect" },
        { value: "edgeDetect2", label: "edgeDetect2" },
        { value: "edgeDetect3", label: "edgeDetect3" },
        { value: "edgeDetect4", label: "edgeDetect4" },
        { value: "edgeDetect5", label: "edgeDetect5" },
        { value: "edgeDetect6", label: "edgeDetect6" },
        { value: "sobelHorizontal", label: "sobelHorizontal" },
        { value: "sobelVertical", label: "sobelVertical" },
        { value: "previtHorizontal", label: "previtHorizontal" },
        { value: "previtVertical", label: "previtVertical" },
        { value: "triangleBlur", label: "triangleBlur" },
        { value: "emboss", label: "emboss" },
      ]}
    ></Select>
  </div>
}

function computeKernelWeight(kernel: any[]) {
  var weight = kernel.reduce(function (prev, curr) {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}