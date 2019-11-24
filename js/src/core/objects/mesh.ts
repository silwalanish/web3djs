import Shader from '../rendering/shader';
import { Buffer, createFloatBuffer } from '../utils/buffer.utils';

export interface MeshMeta {
  numVertex: number;
  firstVertex: number;
  meshType: GLuint;
}

export interface BufferMeta {
  components: number;
  normalize: boolean;
  stride: number;
  offset: number;
}

export default class Mesh {
  private positionBuffer: Buffer;
  private positionMeta: BufferMeta;

  private colorBuffer: Buffer;
  private colorMeta: BufferMeta;

  private meshMeta: MeshMeta;

  public constructor(
    gl: WebGLRenderingContext,
    meta: MeshMeta,
    position: GLfloat[],
    posMetaData: BufferMeta,
    color?: GLfloat[],
    colorMetaData?: BufferMeta
  ) {
    this.meshMeta = meta;
    this.positionBuffer = createFloatBuffer(gl, position, gl.STATIC_DRAW);
    this.positionMeta = posMetaData;

    if (color) {
      this.colorBuffer = createFloatBuffer(gl, color, gl.STATIC_DRAW);
      this.colorMeta = colorMetaData || {
        components: 4,
        normalize: false,
        stride: 0,
        offset: 0
      };
    }
  }

  public bind(gl: WebGLRenderingContext, shader: Shader): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    shader.enableVertexPosition(
      gl,
      this.positionMeta.components,
      gl.FLOAT,
      this.positionMeta.normalize,
      this.positionMeta.stride,
      this.positionMeta.offset
    );

    if (this.colorBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      shader.enableVertexColor(
        gl,
        this.colorMeta.components,
        gl.FLOAT,
        this.colorMeta.normalize,
        this.colorMeta.stride,
        this.colorMeta.offset
      );
    }
  }

  public render(gl: WebGLRenderingContext): void {
    gl.drawArrays(this.meshMeta.meshType, this.meshMeta.firstVertex, this.meshMeta.numVertex);
  }
}
