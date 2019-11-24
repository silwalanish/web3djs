import Shader from '../rendering/shader';
import { Buffer, createFloatBuffer } from '../utils/buffer.utils';

export interface MeshMeta{
  numVertex: number,
  firstVertex: number,
  meshType: GLuint
}

export interface PositionMeta {
  components: number,
  normalize: boolean,
  stride: number,
  offset: number
}

export default class Mesh {
  private positionBuffer: Buffer;
  private positionMeta: PositionMeta;
  private meshMeta: MeshMeta;

  public constructor(
    gl: WebGLRenderingContext,
    meta: MeshMeta,
    position: GLfloat[],
    posMetaData: PositionMeta
  ) {
    this.meshMeta = meta;
    this.positionBuffer = createFloatBuffer(gl, position, gl.STATIC_DRAW);
    this.positionMeta = posMetaData;
  }

  public bind(gl: WebGLRenderingContext, shader: Shader): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    shader.enableVertexPosition(
      gl,
      this.positionMeta.components,
      gl.FLOAT,
      this.positionMeta.normalize,
      this.positionMeta.stride,
      this.positionMeta.stride
    );
  }

  public render(gl: WebGLRenderingContext): void {
    gl.drawArrays(this.meshMeta.meshType, this.meshMeta.firstVertex, this.meshMeta.numVertex);
  }
}
