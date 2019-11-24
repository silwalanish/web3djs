import Shader, { ShaderSource } from './shader';
import { debug } from '../logger';

const DEFAULT_SHADER_SOURCE: ShaderSource = {
  vertex: `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `,
  fragment: `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `
};

export default class DefaultShader extends Shader {
  private readonly vertexPositionLoc: GLuint | null;
  private readonly modelViewMatrixLoc: WebGLUniformLocation | null;
  private readonly projectionMatrixLoc: WebGLUniformLocation | null;

  public constructor(gl: WebGLRenderingContext) {
    super(gl, DEFAULT_SHADER_SOURCE);

    this.vertexPositionLoc = this.getAttribLocation(gl, 'aVertexPosition');
    this.modelViewMatrixLoc = this.getUniformLocation(gl, 'uModelViewMatrix');
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
      gl.vertexAttribPointer(
        this.vertexPositionLoc,
        components,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(this.vertexPositionLoc);
    }
  }

  public setModelViewMatrix(gl: WebGLRenderingContext, mat: Float32List): void {
    gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, mat);
  }

  public setProjectionMatrix(
    gl: WebGLRenderingContext,
    mat: Float32List
  ): void {
    gl.uniformMatrix4fv(this.projectionMatrixLoc, false, mat);
  }
}
