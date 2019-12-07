import Shader from '../rendering/shader';
import { Buffer, createFloatBuffer, BufferType, createUIntBuffer } from '../utils/buffer.utils';

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

export interface MeshOptions {
  gl: WebGLRenderingContext;
  meta: MeshMeta;
  positions: GLfloat[];
  posMetaData: BufferMeta;
  colors?: GLfloat[];
  colorMetaData?: BufferMeta;
  indices?: GLuint[];
}

const DEFAULT_OPTIONS = {
  colorMetaData: {
    components: 4,
    normalize: false,
    stride: 0,
    offset: 0
  }
};

export default class Mesh {
  private positionBuffer: Buffer;
  private positionMeta: BufferMeta;

  private colorBuffer: Buffer;
  private colorMeta: BufferMeta;

  private indicesBuffer: Buffer;

  private meshMeta: MeshMeta;

  public constructor(options: MeshOptions) {
    const defaultOptions = Object.create(DEFAULT_OPTIONS);
    const { gl, meta, positions, posMetaData, colors, colorMetaData, indices } = Object.assign(defaultOptions, options);

    this.meshMeta = meta;
    this.positionBuffer = createFloatBuffer(gl, BufferType.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    this.positionMeta = posMetaData;

    if (colors) {
      this.colorBuffer = createFloatBuffer(gl, BufferType.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
      this.colorMeta = colorMetaData;
    }

    if (indices) {
      this.indicesBuffer = createUIntBuffer(gl, BufferType.INDEX_BUFFER, indices, gl.STATIC_DRAW);
    }
  }

  public bind(gl: WebGLRenderingContext, shader: Shader): void {
    if (this.indicesBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    }

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
    if (this.indicesBuffer) {
      gl.drawElements(this.meshMeta.meshType, this.meshMeta.numVertex, gl.UNSIGNED_SHORT, this.meshMeta.firstVertex);
      return;
    }
    gl.drawArrays(this.meshMeta.meshType, this.meshMeta.firstVertex, this.meshMeta.numVertex);
  }
}
