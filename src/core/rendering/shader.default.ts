import { vec3 } from 'gl-matrix';

import Light from './lights/light';
import Shader, { ShaderSource } from './shader';
import { Texture } from '../utils/texture.utils';

const DEFAULT_SHADER_SOURCE: ShaderSource = {
  vertex: `
    precision highp float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;

    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec3 uLightPos;
    uniform vec3 uCameraPos;

    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 toCamera;
    
    void main() {
      vec4 worldPos = uModelMatrix * vec4(aVertexPosition, 1.0);

      gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
      
      vNormal = (uModelMatrix * vec4(aVertexNormal, 0.0)).xyz;
      vPos = uLightPos - worldPos.xyz;
      toCamera = uCameraPos - worldPos.xyz;
    }
  `,
  fragment: `
    precision highp float;

    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 toCamera;

    uniform lowp vec3 uColor;
    uniform float uTexSize;
    uniform vec3 uLightColor;
    uniform float uLightRadius;

    void main() {
      vec3 unitToLight = normalize(vPos);
      vec3 unitNormal = normalize(vNormal);
      vec3 unitToCamera = normalize(toCamera);
      vec3 lightDir = -unitToLight;
      vec3 reflected = reflect(lightDir, unitNormal);

      float intensity = max(dot(unitNormal, unitToLight), 0.0);
      float spec = max(dot(reflected, unitToCamera), 0.0);

      float damped = pow(spec, 10.0); // TODO: Pass factor as uniform

      vec3 specular = uLightColor * damped;
      vec3 diffuse = uLightColor * intensity;

      gl_FragColor = vec4(uColor * diffuse + specular, 1.0);
    }
  `
};

export class DefaultShader extends Shader {
  private readonly vertexPositionLoc: GLuint | null;
  private readonly vertexNormalLoc: GLuint | null;

  private readonly viewMatrixLoc: WebGLUniformLocation | null;
  private readonly modelMatrixLoc: WebGLUniformLocation | null;
  private readonly projectionMatrixLoc: WebGLUniformLocation | null;

  private readonly colorLoc: WebGLUniformLocation | null;
  private readonly lightPosLoc: WebGLUniformLocation | null;
  private readonly lightColorLoc: WebGLUniformLocation | null;
  private readonly lightRadiusLoc: WebGLUniformLocation | null;
  private readonly cameraPosLoc: WebGLUniformLocation | null;

  public constructor(gl: WebGLRenderingContext, shaderSource?: ShaderSource) {
    super(gl, shaderSource || DEFAULT_SHADER_SOURCE);

    this.vertexPositionLoc = this.getAttribLocation(gl, 'aVertexPosition');
    this.vertexNormalLoc = this.getAttribLocation(gl, 'aVertexNormal');

    this.viewMatrixLoc = this.getUniformLocation(gl, 'uViewMatrix');
    this.modelMatrixLoc = this.getUniformLocation(gl, 'uModelMatrix');
    this.projectionMatrixLoc = this.getUniformLocation(gl, 'uProjectionMatrix');

    this.colorLoc = this.getUniformLocation(gl, 'uColor');
    this.lightPosLoc = this.getUniformLocation(gl, 'uLightPos');
    this.lightColorLoc = this.getUniformLocation(gl, 'uLightColor');
    this.lightRadiusLoc = this.getUniformLocation(gl, 'uLightRadius');
    this.cameraPosLoc = this.getUniformLocation(gl, 'uCameraPos');
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

  public enableVertexNormal(
    gl: WebGLRenderingContext,
    components: number,
    type: number,
    normalize: boolean,
    stride: number,
    offset: number
  ): void {
    if (this.vertexNormalLoc != null && this.vertexNormalLoc >= 0) {
      gl.vertexAttribPointer(
        this.vertexNormalLoc,
        components,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(this.vertexNormalLoc);
    }
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

  public setProjectionMatrix(
    gl: WebGLRenderingContext,
    mat: Float32List
  ): void {
    gl.uniformMatrix4fv(this.projectionMatrixLoc, false, mat);
  }

  public setColor(gl: WebGLRenderingContext, color: vec3): void {
    if (this.colorLoc != null) {
      this.setUniform3f(gl, this.colorLoc, color);
    }
  }

  public addLight(gl: WebGLRenderingContext, light: Light): void {
    this.setUniform3f(gl, this.lightPosLoc, light.position);
    this.setUniform3f(gl, this.lightColorLoc, light.color);
    this.setUniform1f(gl, this.lightRadiusLoc, light.radius);
  }

  public setTexture(
    gl: WebGLRenderingContext,
    tex: Texture,
    texSize?: number,
    texPos?: number
  ): void {
    return;
  }

  public setCameraPos(gl: WebGLRenderingContext, pos: vec3): void {
    this.setUniform3f(gl, this.cameraPosLoc, pos);
  }

  public hasColorBuffer(): boolean {
    return false;
  }

  public hasUVBuffer(): boolean {
    return false;
  }

  public hasNormalBuffer(): boolean {
    return true;
  }
}

export default DefaultShader;
