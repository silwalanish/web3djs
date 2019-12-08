import Mesh from '../core/objects/mesh';
import GameObject, { GameObjectOptions } from '../core/objects/object';

const cubePositions = [
  // Front face
  -1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,

  // Back face
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,

  // Top face
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,

  // Bottom face
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,

  // Right face
  1.0,
  -1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  1.0,
  1.0,
  -1.0,
  1.0,

  // Left face
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  -1.0
];

const cubeIndices = [
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // back
  8,
  9,
  10,
  8,
  10,
  11, // top
  12,
  13,
  14,
  12,
  14,
  15, // bottom
  16,
  17,
  18,
  16,
  18,
  19, // right
  20,
  21,
  22,
  20,
  22,
  23 // left
];

const cubeUV = [
  // Front
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0,
  // Back
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0,
  // Top
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0,
  // Bottom
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0,
  // Right
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0,
  // Left
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0
];

export default class Cube extends GameObject {
  private static _MESH: Mesh;

  constructor(options?: GameObjectOptions) {
    super(Object.assign({ mesh: Cube._MESH }, options));
  }

  public static createMesh(gl: WebGLRenderingContext) {
    Cube._MESH = new Mesh({
      gl,
      meta: {
        firstVertex: 0,
        meshType: gl.TRIANGLES,
        numVertex: cubeIndices.length
      },
      positions: cubePositions,
      posMetaData: {
        components: 3,
        normalize: false,
        offset: 0,
        stride: 0
      },
      uvs: cubeUV,
      indices: cubeIndices
    });
  }

  public get MESH(): Mesh {
    return Cube._MESH;
  }
}
