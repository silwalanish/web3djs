import { vec3, vec2 } from 'gl-matrix';
import * as OBJLoader from 'webgl-obj-loader';

import Cube from './game/cube';
import Plane from './game/plane';
import { info } from './core/logger';
import Mesh from './core/objects/mesh';
import Camera from './core/rendering/camera';
import GameObject from './core/objects/object';
import DefaultShader from './core/rendering/shader.default';
import TextureShader from './core/rendering/shader.texture';
import { Texture, genTexture2D } from './core/utils/texture.utils';

const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.width = window.outerWidth;
canvas.height = window.outerHeight;

const gl: WebGLRenderingContext | null = canvas.getContext('webgl');

let mouse = {
  down: false,
  first: true,
  sensitivity: 0.05,
  position: vec2.fromValues(0, 0),
  oldPosition: vec2.fromValues(0, 0),
  onMouseDown(e) {
    this.down = true;
    this.oldPosition = vec2.clone(this.position);
    this.position = vec2.fromValues(e.clientX, e.clientY);
  },
  onMouseUp(e) {
    this.down = false;
    this.oldPosition = vec2.clone(this.position);
    this.position = vec2.fromValues(e.clientX, e.clientY);
  },
  onMouseMove(e: MouseEvent, camera: Camera) {
    this.oldPosition = vec2.clone(this.position);
    this.position = vec2.fromValues(e.clientX, e.clientY);

    if (this.down && !this.frist) {
      let delta: vec2 = vec2.create();
      vec2.sub(delta, this.position, this.oldPosition);
      vec2.scale(delta, delta, this.sensitivity);

      camera.rotation[0] += -delta[0];
      camera.rotation[1] += delta[1];

      if (camera.rotation[1] > 89.0) camera.rotation[1] = 89.0;
      if (camera.rotation[1] < -89.0) camera.rotation[1] = -89.0;

      camera.calculateFront();
    }

    this.first = false;
  }
};

function keyDown(e: KeyboardEvent, camera: Camera) {
  switch (e.keyCode) {
    case 87:
      camera.moveForward();
      break;
    case 83:
      camera.moveBack();
      break;
    case 65:
      camera.moveLeft();
      break;
    case 68:
      camera.moveRight();
      break;
    case 90:
      break;
    case 88:
      break;
  }
}

function fullScreen() {
  canvas.requestFullscreen();
}

interface DownloadedMeshes extends OBJLoader.MeshMap {
  monkeyObj: OBJLoader.Mesh;
}

function play(meshes: DownloadedMeshes) {
  if (gl) {
    document.body.appendChild(canvas);

    canvas.addEventListener('dblclick', fullScreen);
    canvas.addEventListener('mousedown', mouse.onMouseDown.bind(mouse));
    canvas.addEventListener('mouseup', mouse.onMouseUp.bind(mouse));

    Cube.createMesh(gl);
    Plane.createMesh(gl);

    const camera = new Camera({
      fov: 60,
      aspect: gl.canvas.width / gl.canvas.height,
      zNear: 0.01,
      zFar: 1000.0,
      position: vec3.fromValues(0, 4, 4)
    });

    document.addEventListener('keydown', e => keyDown(e, camera));
    canvas.addEventListener('mousemove', e => mouse.onMouseMove(e, camera));

    let cubes: Cube[] = [];

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        cubes.push(
          new Cube({
            position: vec3.fromValues(-15 + i * 5, 0, -15 + j * 5),
            scale: vec3.fromValues(Math.max(1, Math.random() * 2), 1, Math.max(1, Math.random() * 2))
          })
        );
      }
    }

    const { monkeyObj } = meshes;

    let monkeyMesh: Mesh = new Mesh({
      gl,
      meta: {
        firstVertex: 0,
        meshType: gl.TRIANGLES,
        numVertex: monkeyObj.indices.length
      },
      positions: monkeyObj.vertices,
      uvs: monkeyObj.textures,
      indices: monkeyObj.indices,
      posMetaData: {
        components: 3,
        normalize: false,
        offset: 0,
        stride: 0
      }
    });

    let monkey: GameObject = new GameObject({
      mesh: monkeyMesh,
      position: vec3.fromValues(0, 3, -3)
    });

    let texShader: TextureShader = new TextureShader(gl);
    let shader: DefaultShader = new DefaultShader(gl);

    let boxTex: Texture = genTexture2D(gl, {
      url: './assets/RTS_Crate.png',
      minFilter: gl.NEAREST
    });

    let monkeyTex: Texture = genTexture2D(gl, {
      url: './assets/monkey.png',
      minFilter: gl.NEAREST
    });

    const wallColor: vec3 = vec3.fromValues(0.2, 0.4, 0.6);

    window.requestAnimationFrame(function draw() {
      camera.calculateMatrix();

      gl.clearColor(0, 0, 0, 1);
      gl.clearDepth(1);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      texShader.use(gl);
      texShader.setProjectionMatrix(gl, camera.getProjectionMatrix());
      texShader.setViewMatrix(gl, camera.getViewMatrix());

      texShader.setTexture(gl, boxTex);
      for (let cube of cubes) {
        cube.render(gl, texShader);
      }

      texShader.setTexture(gl, monkeyTex);
      monkey.render(gl, texShader);

      window.requestAnimationFrame(draw);
    });
  } else {
    info("The browser doesn't support WebGL.");
  }
}

window.onload = () => {
  OBJLoader.downloadMeshes({ monkeyObj: './assets/monkey.obj' }, play, {});
};
