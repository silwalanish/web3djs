import Shader, { ShaderSource } from './shader';

const DEFAULT_SHADER_SOURCE: ShaderSource = {
  vertex: `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `,
  fragment: `
    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `
};

export default class DefaultShader extends Shader {
  private readonly vertexPositionLoc: GLuint | null;
  private readonly vertexColorLoc: GLuint | null;

  private readonly viewMatrixLoc: WebGLUniformLocation | null;
  private readonly modelMatrixLoc: WebGLUniformLocation | null;
  private readonly projectionMatrixLoc: WebGLUniformLocation | null;

  public constructor(gl: WebGLRenderingContext) {
    super(gl, DEFAULT_SHADER_SOURCE);

    this.vertexPositionLoc = this.getAttribLocation(gl, 'aVertexPosition');
    this.vertexColorLoc = this.getAttribLocation(gl, 'aVertexColor');

    this.viewMatrixLoc = this.getUniformLocation(gl, 'uViewMatrix');
    this.modelMatrixLoc = this.getUniformLocation(gl, 'uModelMatrix');
    this.projectionMatrixLoc = this.getUniformLocation(gl, 'uProjectionMatrix');
  }

  public enableVertexPosition(
    gl: WebGLRenderingContext,
    components: number,
    type: GLuint,
    normalize: GLboolean,
    stride: GLuint,
    offset: GLuint
  ): void {
    if (this.vertexPositionLoc != null) {
      gl.vertexAttribPointer(this.vertexPositionLoc, components, type, normalize, stride, offset);
      gl.enableVertexAttribArray(this.vertexPositionLoc);
    }
  }

  public enableIndex(
    gl: WebGLRenderingContext,
    components: number,
    type: number,
    normalize: boolean,
    stride: number,
    offset: number
  ): void {
    throw new Error('Method not implemented.');
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
    if (this.vertexColorLoc != null) {
      gl.vertexAttribPointer(this.vertexColorLoc, components, type, normalize, stride, offset);
      gl.enableVertexAttribArray(this.vertexColorLoc);
    }
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
}
