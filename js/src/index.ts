import * as dat from 'dat.gui';
import { vec3, vec2, vec4 } from 'gl-matrix';
import * as OBJLoader from 'webgl-obj-loader';

import GameObject from './core/objects/object';

import Camera from './core/rendering/camera';
import DefaultShader from './core/rendering/shader.default';
import TextureShader from './core/rendering/shader.texture';

import { objToMesh } from './core/utils/obj.utils';
import { genTexture2D } from './core/utils/texture.utils';

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

const canvas: HTMLCanvasElement = document.createElement('canvas');
let gl: WebGLRenderingContext | null = null;

interface DownloadedMeshes extends OBJLoader.MeshMap {
  monkeyObj: OBJLoader.Mesh;
  cubeObj: OBJLoader.Mesh;
}

function play(meshes: DownloadedMeshes) {
  const { monkeyObj, cubeObj } = meshes;
  let cubeMesh, monkeyMesh;
  if (gl) {
    cubeMesh = objToMesh(gl, cubeObj);
    monkeyMesh = objToMesh(gl, monkeyObj);

    let game = new Game();
    const GUI = new dat.GUI();
    GUI.addColor(game, 'clearColor');
    GUI.add(game, 'fullScreen');
    
    const cameraSettings = GUI.addFolder('Camera');
    cameraSettings.add(game.camera, 'fov');
    const cameraPosSettings = cameraSettings.addFolder('Position');
    cameraPosSettings.add(game.camera.position, '0');
    cameraPosSettings.add(game.camera.position, '1');
    cameraPosSettings.add(game.camera.position, '2');

    const lightSettings = GUI.addFolder('Light');
    lightSettings.addColor(game.light, 'color');
    const lightPosSettings = lightSettings.addFolder('Position');
    lightPosSettings.add(game.light.position, '0');
    lightPosSettings.add(game.light.position, '1');
    lightPosSettings.add(game.light.position, '2');

    const cubeSettings = GUI.addFolder('Cube');
    cubeSettings.addColor(game, 'cubeColor');
    const cubePosSettings = cubeSettings.addFolder('Position');
    cubePosSettings.add(game.cube.position, '0');
    cubePosSettings.add(game.cube.position, '1');
    cubePosSettings.add(game.cube.position, '2');
    const cubeRotSettings = cubeSettings.addFolder('Rotation');
    cubeRotSettings.add(game.cube.rotation, '0');
    cubeRotSettings.add(game.cube.rotation, '1');
    cubeRotSettings.add(game.cube.rotation, '2');
    const cubeScaleSettings = cubeSettings.addFolder('Scale');
    cubeScaleSettings.add(game.cube.scale, '0');
    cubeScaleSettings.add(game.cube.scale, '1');
    cubeScaleSettings.add(game.cube.scale, '2');

    const monkeySettings = GUI.addFolder('Monkey');
    monkeySettings.addColor(game, 'monkeyColor');
    const monkeyPosSettings = monkeySettings.addFolder('Position');
    monkeyPosSettings.add(game.monkey.position, '0');
    monkeyPosSettings.add(game.monkey.position, '1');
    monkeyPosSettings.add(game.monkey.position, '2');
    const monkeyRotSettings = monkeySettings.addFolder('Rotation');
    monkeyRotSettings.add(game.monkey.rotation, '0');
    monkeyRotSettings.add(game.monkey.rotation, '1');
    monkeyRotSettings.add(game.monkey.rotation, '2');
    const monkeyScaleSettings = monkeySettings.addFolder('Scale');
    monkeyScaleSettings.add(game.monkey.scale, '0');
    monkeyScaleSettings.add(game.monkey.scale, '1');
    monkeyScaleSettings.add(game.monkey.scale, '2');

    cubeSettings.open();
    lightSettings.open();
    monkeySettings.open();

    document.addEventListener('keydown', e => keyDown(e, game.camera));
    canvas.addEventListener('mousemove', e => mouse.onMouseMove(e, game.camera));
  }

  function Game() {
    if (gl) {
      this.clearColor = [0, 0, 0];
      
      this.lightColor = [255, 255, 255, 255];
      this.lightPos = vec3.fromValues(0, 5, 0);
      this.lightRadius = 2;

      this.fov = 60;
      this.cameraPos = vec3.fromValues(0, 4, 4);

      this.cubePos = vec3.fromValues(0, 0, -10);
      this.cubeScale = vec3.fromValues(5, 5, 5);
      this.cubeColor = [255, 255, 0];

      this.monkeyPos = vec3.fromValues(0, 3, -3);
      this.monkeyColor = [0, 255, 0];

      this.camera = new Camera({
        fov: this.fov,
        aspect: gl.canvas.width / gl.canvas.height,
        zNear: 0.01,
        zFar: 1000.0,
        position: this.cameraPos
      });

      this.cube = new GameObject({
        mesh: cubeMesh,
        position: this.cubePos,
        scale: this.cubeScale
      });

      this.monkey = new GameObject({
        mesh: monkeyMesh,
        position: this.monkeyPos
      });

      this.texShader = new TextureShader(gl);
      this.shader = new DefaultShader(gl);

      this.boxTex = genTexture2D(gl, {
        url: 'assets/cube.png',
        minFilter: gl.NEAREST
      });

      this.monkeyTex = genTexture2D(gl, {
        url: 'assets/monkey.png',
        minFilter: gl.NEAREST
      });

      this.light = {
        color: this.lightColor,
        position: this.lightPos,
        radius: this.lightRadius
      };  
      
      this.fullScreen = () => {
        document.body.requestFullscreen();
      };

      this.draw = () => {
        if (gl) {
          vec3.normalize(this.clearColor, this.clearColor);
          vec3.normalize(this.cubeColor, this.cubeColor); 
          vec4.normalize(this.light.color, this.light.color);
          vec3.normalize(this.monkeyColor, this.monkeyColor);

          this.camera.calculateMatrix();

          gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], 1);
          gl.clearDepth(1);

          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL);

          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          this.texShader.use(gl);
          this.texShader.setProjectionMatrix(gl, this.camera.getProjectionMatrix());
          this.texShader.setViewMatrix(gl, this.camera.getViewMatrix());

          this.texShader.addLight(gl, this.light);
          this.texShader.setCameraPos(gl, this.camera.position);

          this.texShader.setTexture(gl, this.monkeyTex);
          this.monkey.render(gl, this.texShader);

          this.texShader.setTexture(gl, this.cubeTex);

          this.shader.use(gl);
          this.shader.setProjectionMatrix(gl, this.camera.getProjectionMatrix());
          this.shader.setViewMatrix(gl, this.camera.getViewMatrix());
          
          this.shader.addLight(gl, this.light);
          this.shader.setCameraPos(gl, this.camera.position);

          this.shader.setColor(gl, this.cubeColor);
          this.cube.render(gl, this.shader);

          window.requestAnimationFrame(this.draw.bind(this));
        }
      }

      window.requestAnimationFrame(this.draw.bind(this));
    }
  }
}

window.onload = () => {
  canvas.width = window.outerWidth;
  canvas.height = window.outerHeight;

  gl = canvas.getContext('webgl');

  document.body.appendChild(canvas);

  canvas.addEventListener('dblclick', () => {
    document.body.requestFullscreen();
  });
  canvas.addEventListener('mousedown', mouse.onMouseDown.bind(mouse));
  canvas.addEventListener('mouseup', mouse.onMouseUp.bind(mouse));

  OBJLoader.downloadMeshes(
    {
      monkeyObj: 'assets/monkey.obj',
      cubeObj: 'assets/cube.obj'
    },
    play,
    {}
  );
};
