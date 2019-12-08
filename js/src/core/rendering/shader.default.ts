import { vec3 } from 'gl-matrix';
import Shader, { ShaderSource } from './shader';
import { Texture } from '../utils/texture.utils';

const DEFAULT_SHADER_SOURCE: ShaderSource = {
  vertex: `
    attribute vec4 aVertexPosition;

    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
    }
  `,
  fragment: `
    uniform lowp vec3 uColor;

    void main() {
      gl_FragColor = vec4(uColor, 1);
    }
  `
};

export default class DefaultShader extends Shader {
  private readonly vertexPositionLoc: GLuint | null;

  private readonly viewMatrixLoc: WebGLUniformLocation | null;
  private readonly modelMatrixLoc: WebGLUniformLocation | null;
  private readonly projectionMatrixLoc: WebGLUniformLocation | null;

  private readonly colorLoc: WebGLUniformLocation | null;

  public constructor(gl: WebGLRenderingContext, shaderSource?: ShaderSource) {
    super(gl, shaderSource || DEFAULT_SHADER_SOURCE);

    this.vertexPositionLoc = this.getAttribLocation(gl, 'aVertexPosition');

    this.viewMatrixLoc = this.getUniformLocation(gl, 'uViewMatrix');
    this.modelMatrixLoc = this.getUniformLocation(gl, 'uModelMatrix');
    this.projectionMatrixLoc = this.getUniformLocation(gl, 'uProjectionMatrix');

    this.colorLoc = this.getUniformLocation(gl, 'uColor');
  }

  public enableVertexPosition(
    gl: WebGLRenderingContext,
    components: number,
    type: GLuint,
    normalize: GLboolean,
    stride: GLuint,
    offset: GLuint
  ): void {
    if (this.vertexPositionLoc != null && this.vertexPositionLoc >= 0) {
      gl.vertexAttribPointer(this.vertexPositionLoc, components, type, normalize, stride, offset);
      gl.enableVertexAttribArray(this.vertexPositionLoc);
    }
  }

  public enableVertexNormal(
    gl: WebGLRenderingContext,
    components: number,
    type: number,
    normalize: boolean,
    stride: number,
    offset: number
  ): void {
    throw new Error('Method not implemented.');
  }

  public enableVertexColor(
    gl: WebGLRenderingContext,
    components: number,
    type: number,
    normalize: boolean,
    stride: number,
    offset: number
  ): void {
    throw new Error('Method not implemented.');
  }

  public enableVertexUVPosition(
    gl: WebGLRenderingContext,
    components: number,
    type: number,
    normalize: boolean,
    stride: number,
    offset: number
  ): void {
    throw new Error('Method not implemented.');
  }

  public setModelMatrix(gl: WebGLRenderingContext, mat: Float32List): void {
    gl.uniformMatrix4fv(this.modelMatrixLoc, false, mat);
  }

  public setViewMatrix(gl: WebGLRenderingContext, mat: Float32List): void {
    gl.uniformMatrix4fv(this.viewMatrixLoc, false, mat);
  }

  public setProjectionMatrix(gl: WebGLRenderingContext, mat: Float32List): void {
    gl.uniformMatrix4fv(this.projectionMatrixLoc, false, mat);
  }

  public setColor(gl: WebGLRenderingContext, color: vec3): void {
    if (this.colorLoc != null) {
      this.setUniform3f(gl, this.colorLoc, color);
    }
  }

  public setTexture(gl: WebGLRenderingContext, tex: Texture, texSize?: number, texPos?: number): void {
    return;
  }
}
