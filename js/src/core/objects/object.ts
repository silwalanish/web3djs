import { vec3 } from 'gl-matrix';

import Mesh from './mesh';
import Shader from '../rendering/shader';
import { calculateModelViewMat } from '../utils/matrix.utils';

export default class GameObject {
  private _position: vec3;
  private _rotation: vec3;

  private _mesh?: Mesh;

  constructor(position?: vec3, rotation?: vec3, mesh?: Mesh) {
    this._position = position || vec3.create();
    this._rotation = rotation || vec3.create();
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

  public render(gl: WebGLRenderingContext, shader: Shader) {
    if (this._mesh) {
      this._mesh.bind(gl, shader);

      shader.setModelMatrix(gl, calculateModelViewMat(this._position, this._rotation));

      this._mesh.render(gl);
    }
  }
}
