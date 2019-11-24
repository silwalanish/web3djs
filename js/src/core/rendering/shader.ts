import { genShaderProgram, ShaderProgram } from '../utils/shader.utils';

export interface ShaderSource {
  vertex: string;
  fragment: string;
}

export default class Shader {
  private readonly shaderProgram: ShaderProgram;

  protected constructor(gl: WebGLRenderingContext, source: ShaderSource) {
    this.shaderProgram = genShaderProgram(gl, source.vertex, source.fragment);
  }

  public use(gl: WebGLRenderingContext): void {
    gl.useProgram(this.shaderProgram);
  }

  protected getAttribLocation(
    gl: WebGLRenderingContext,
    attribName: string
  ): GLuint | null {
    return (
      this.shaderProgram && gl.getAttribLocation(this.shaderProgram, attribName)
    );
  }

  protected getUniformLocation(
    gl: WebGLRenderingContext,
    uniformName: string
  ): WebGLUniformLocation | null {
    return (
      this.shaderProgram &&
      gl.getUniformLocation(this.shaderProgram, uniformName)
    );
  }
}
