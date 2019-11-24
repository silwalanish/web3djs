import { mat4, vec3 } from 'gl-matrix';

import { info } from './core/logger';
import Mesh from './core/objects/mesh';
import DefaultShader from './core/rendering/shader.default';
import GameObject from './core/objects/object';

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = 800;
canvas.height = 600;

const gl: WebGLRenderingContext | null = canvas.getContext('webgl');

if (gl) {
  document.body.appendChild(canvas);
  const cubePositions = [
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    1,
    1,
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    -1,
    1,
    -1,
    -1,
    -1,
    -1,
    1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    1,
    1,
    1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    1,
    1,
    -1,
    1,
    1,
    1,
    1,
    1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    1,
    1,
    1,
    -1,
    1,
    1,
    1,
    -1,
    1
  ];

  const faceColors = [
    0.583,
    0.771,
    0.014,
    0.609,
    0.115,
    0.436,
    0.327,
    0.483,
    0.844,
    0.822,
    0.569,
    0.201,
    0.435,
    0.602,
    0.223,
    0.31,
    0.747,
    0.185,
    0.597,
    0.77,
    0.761,
    0.559,
    0.436,
    0.73,
    0.359,
    0.583,
    0.152,
    0.483,
    0.596,
    0.789,
    0.559,
    0.861,
    0.639,
    0.195,
    0.548,
    0.859,
    0.014,
    0.184,
    0.576,
    0.771,
    0.328,
    0.97,
    0.406,
    0.615,
    0.116,
    0.676,
    0.977,
    0.133,
    0.971,
    0.572,
    0.833,
    0.14,
    0.616,
    0.489,
    0.997,
    0.513,
    0.064,
    0.945,
    0.719,
    0.592,
    0.543,
    0.021,
    0.978,
    0.279,
    0.317,
    0.505,
    0.167,
    0.62,
    0.077,
    0.347,
    0.857,
    0.137,
    0.055,
    0.953,
    0.042,
    0.714,
    0.505,
    0.345,
    0.783,
    0.29,
    0.734,
    0.722,
    0.645,
    0.174,
    0.302,
    0.455,
    0.848,
    0.225,
    0.587,
    0.04,
    0.517,
    0.713,
    0.338,
    0.053,
    0.959,
    0.12,
    0.393,
    0.621,
    0.362,
    0.673,
    0.211,
    0.457,
    0.82,
    0.883,
    0.371,
    0.982,
    0.099,
    0.879
  ];

  const cubeMesh: Mesh = new Mesh(
    gl,
    { numVertex: 4 * 6 * 2, firstVertex: 0, meshType: gl.TRIANGLES },
    cubePositions,
    {
      components: 3,
      normalize: false,
      stride: 0,
      offset: 0
    },
    faceColors,
    {
      components: 3,
      normalize: false,
      stride: 0,
      offset: 0
    }
  );

  const positions: GLfloat[] = [-2.0, 2.0, 2.0, 2.0, -2.0, -2.0, 2.0, -2.0];
  const colors: GLfloat[] = [1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0];

  const planeMesh: Mesh = new Mesh(
    gl,
    {
      numVertex: 4,
      firstVertex: 0,
      meshType: gl.TRIANGLE_STRIP
    },
    positions,
    {
      components: 2,
      normalize: false,
      stride: 0,
      offset: 0
    },
    colors
  );

  const fieldOfView = (60 * Math.PI) / 180;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const viewMatrix = mat4.create();
  const eyePos = vec3.fromValues(0, 0, 6);
  const center = vec3.create();
  const up = vec3.fromValues(0, 1, 0);

  const plane1: GameObject = new GameObject(vec3.fromValues(2, 0, -2), vec3.fromValues(0, 0, 0), planeMesh);
  const plane2: GameObject = new GameObject(vec3.fromValues(-2, 0, -2), vec3.fromValues(0, 0, 0), planeMesh);

  const cube: GameObject = new GameObject(vec3.fromValues(0, 0, 0), vec3.create(), cubeMesh);

  let shader: DefaultShader = new DefaultShader(gl);

  window.requestAnimationFrame(function draw() {
    mat4.lookAt(viewMatrix, eyePos, center, up);

    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shader.use(gl);
    shader.setProjectionMatrix(gl, projectionMatrix);
    shader.setViewMatrix(gl, viewMatrix);

    plane1.render(gl, shader);
    plane2.render(gl, shader);

    cube.render(gl, shader);

    cube.rotation[1] += 1;

    window.requestAnimationFrame(draw);
  });
} else {
  info("The browser doesn't support WebGL.");
}
