import { vec3 } from 'gl-matrix';

import Mesh from './mesh';
import Shader from '../rendering/shader';
import { calculateModelViewMat } from '../utils/matrix.utils';

export default class GameObject {
  private _position: vec3;

  private _mesh?: Mesh;

  constructor(position?: vec3, mesh?: Mesh) {
    this._position = position || vec3.fromValues(0, 0, 0);
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

  public render(gl: WebGLRenderingContext, shader: Shader) {
    if (this._mesh) {
      this._mesh.bind(gl, shader);

      shader.setModelViewMatrix(gl, calculateModelViewMat(this._position));

      this._mesh.render(gl);
    }
  }
}
