import { error } from '../logger';
import Shader from '../rendering/shader';
import {
  Buffer,
  createFloatBuffer,
  BufferType,
  createUIntBuffer
} from '../utils/buffer.utils';

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
  normals?: GLfloat[];
  normalMetaData?: BufferMeta;
  uvs?: GLfloat[];
  uvMetaData?: BufferMeta;
  indices?: GLuint[];
}

const DEFAULT_OPTIONS = {
  colorMetaData: {
    components: 4,
    normalize: false,
    stride: 0,
    offset: 0
  },
  uvMetaData: {
    components: 2,
    normalize: false,
    stride: 0,
    offset: 0
  },
  normalMetaData: {
    components: 3,
    normalize: false,
    stride: 0,
    offset: 0
  }
};

export class Mesh {
  private positionBuffer: Buffer;
  private positionMeta: BufferMeta;

  private colorBuffer: Buffer;
  private colorMeta: BufferMeta | null;

  private uvBuffer: Buffer;
  private uvMeta: BufferMeta | null;

  private normalBuffer: Buffer;
  private normalMeta: BufferMeta | null;

  private indicesBuffer: Buffer;

  private meshMeta: MeshMeta;

  public constructor(options: MeshOptions) {
    const defaultOptions = Object.create(DEFAULT_OPTIONS);
    const {
      gl,
      meta,
      positions,
      posMetaData,
      colors,
      colorMetaData,
      uvs,
      uvMetaData,
      normals,
      normalMetaData,
      indices
    } = Object.assign(defaultOptions, options);

    this.meshMeta = meta;
    this.positionBuffer = createFloatBuffer(
      gl,
      BufferType.ARRAY_BUFFER,
      positions,
      gl.STATIC_DRAW
    );
    this.positionMeta = posMetaData;

    if (colors) {
      this.colorBuffer = createFloatBuffer(
        gl,
        BufferType.ARRAY_BUFFER,
        colors,
        gl.STATIC_DRAW
      );
      this.colorMeta = colorMetaData;
    } else {
      this.colorBuffer = null;
      this.colorMeta = null;
    }

    if (uvs) {
      this.uvBuffer = createFloatBuffer(
        gl,
        BufferType.ARRAY_BUFFER,
        uvs,
        gl.STATIC_DRAW
      );
      this.uvMeta = uvMetaData;
    } else {
      this.uvBuffer = null;
      this.uvMeta = null;
    }

    if (normals) {
      this.normalBuffer = createFloatBuffer(
        gl,
        BufferType.ARRAY_BUFFER,
        normals,
        gl.STATIC_DRAW
      );
      this.normalMeta = normalMetaData;
    } else {
      this.normalBuffer = null;
      this.normalMeta = null;
    }

    if (indices) {
      this.indicesBuffer = createUIntBuffer(
        gl,
        BufferType.INDEX_BUFFER,
        indices,
        gl.STATIC_DRAW
      );
    } else {
      this.indicesBuffer = null;
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

    if (this.colorBuffer && this.colorMeta && shader.hasColorBuffer()) {
      try {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        shader.enableVertexColor(
          gl,
          this.colorMeta.components,
          gl.FLOAT,
          this.colorMeta.normalize,
          this.colorMeta.stride,
          this.colorMeta.offset
        );
      } catch (err) {
        error("Shader Doesn't support color buffers");
      }
    }

    if (this.uvBuffer && this.uvMeta && shader.hasUVBuffer()) {
      try {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        shader.enableVertexUVPosition(
          gl,
          this.uvMeta.components,
          gl.FLOAT,
          this.uvMeta.normalize,
          this.uvMeta.stride,
          this.uvMeta.offset
        );
      } catch (err) {
        error("Shader Doesn't support texture buffers");
      }
    }

    if (this.normalBuffer && this.normalMeta && shader.hasNormalBuffer()) {
      try {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        shader.enableVertexNormal(
          gl,
          this.normalMeta.components,
          gl.FLOAT,
          this.normalMeta.normalize,
          this.normalMeta.stride,
          this.normalMeta.offset
        );
      } catch (err) {
        error("Shader Doesn't support normal buffers");
      }
    }
  }

  public render(gl: WebGLRenderingContext): void {
    if (this.indicesBuffer) {
      gl.drawElements(
        this.meshMeta.meshType,
        this.meshMeta.numVertex,
        gl.UNSIGNED_SHORT,
        this.meshMeta.firstVertex
      );
      return;
    }
    gl.drawArrays(
      this.meshMeta.meshType,
      this.meshMeta.firstVertex,
      this.meshMeta.numVertex
    );
  }
}

export default Mesh;
