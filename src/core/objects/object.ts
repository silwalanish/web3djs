import { vec3 } from 'gl-matrix';

import Mesh from './mesh';
import Shader from '../rendering/shader';
import { calculateModelMat } from '../utils/matrix.utils';

export interface GameObjectOptions {
  position?: vec3;
  rotation?: vec3;
  scale?: vec3;
  mesh?: Mesh;
}

const DEFAULT_OPTIONS = {
  position: vec3.create(),
  rotation: vec3.create(),
  scale: vec3.fromValues(1, 1, 1)
};

export class GameObject {
  private _position: vec3;
  private _rotation: vec3;
  private _scale: vec3;

  private _mesh?: Mesh;

  constructor(options?: GameObjectOptions) {
    const defaultOptions = Object.create(DEFAULT_OPTIONS);
    const { position, rotation, scale, mesh } = Object.assign(
      defaultOptions,
      options
    );

    this._position = vec3.clone(position);
    this._rotation = vec3.clone(rotation);
    this._scale = vec3.clone(scale);
    this._mesh = mesh;
  }

  public set mesh(mesh: Mesh | undefined) {
    this._mesh = mesh;
  }

  public get mesh(): Mesh | undefined {
    return Object.assign({}, this._mesh);
  }

  public set position(position: vec3) {
    this._position = position;
  }

  public get position(): vec3 {
    return this._position;
  }

  public set rotation(rotation: vec3) {
    this._rotation = rotation;
  }

  public get rotation(): vec3 {
    return this._rotation;
  }

  public set scale(scale: vec3) {
    this._scale = scale;
  }

  public get scale(): vec3 {
    return this._scale;
  }

  public render(gl: WebGLRenderingContext, shader: Shader): void {
    if (this._mesh) {
      this._mesh.bind(gl, shader);

      shader.setModelMatrix(
        gl,
        calculateModelMat(this._position, this._rotation, this._scale)
      );

      this._mesh.render(gl);
    }
  }
}

export default GameObject;
