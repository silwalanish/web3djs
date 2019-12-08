import Mesh from '../core/objects/mesh';
import GameObject, { GameObjectOptions } from '../core/objects/object';

const positions: GLfloat[] = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
const colors: GLfloat[] = [1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0];
const indices: GLuint[] = [0, 1, 2, 2, 1, 3];
const uv: GLfloat[] = [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0];

export default class Plane extends GameObject {
  private static _MESH: Mesh;

  constructor(options?: GameObjectOptions) {
    super(Object.assign({ mesh: Plane._MESH }, options));
  }

  public static createMesh(gl: WebGLRenderingContext) {
    Plane._MESH = new Mesh({
      gl,
      meta: {
        firstVertex: 0,
        meshType: gl.TRIANGLES,
        numVertex: indices.length
      },
      positions: positions,
      posMetaData: {
        components: 2,
        normalize: false,
        offset: 0,
        stride: 0
      },
      colors: colors,
      uvs: uv,
      indices: indices
    });
  }

  public get MESH(): Mesh {
    return Plane._MESH;
  }
}
