import { ShaderSource } from './shader';
import DefaultShader from './shader.default';
import { Texture } from '../utils/texture.utils';

const TEXTURE_SHADER_SOURCE: ShaderSource = {
  vertex: `
    precision highp float;
    attribute vec3 aVertexPosition;
    attribute vec2 aVertexUV;
    attribute vec3 aVertexNormal;

    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec3 uLightPos;
    uniform vec3 uCameraPos;

    varying vec2 vUV;
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 toCamera;
    
    void main() {
      vec4 worldPos = uModelMatrix * vec4(aVertexPosition, 1.0);

      gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
      vUV = vec2(aVertexUV.x, 1.0 - aVertexUV.y);
      vNormal = (uModelMatrix * vec4(aVertexNormal, 0.0)).xyz;

      vPos = uLightPos - worldPos.xyz;
      toCamera = uCameraPos - worldPos.xyz;
    }
  `,
  fragment: `
    precision highp float;
    varying vec2 vUV;
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 toCamera;

    uniform sampler2D uTex;
    uniform float uTexSize;
    uniform vec4 uLightColor;
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

      vec4 specular = uLightColor * damped;
      vec4 diffuse = uLightColor * intensity;

      vec4 texColor = texture2D(uTex, vUV * uTexSize);
      gl_FragColor = texColor * diffuse + specular;
    }
  `
};

export default class TextureShader extends DefaultShader {
  private readonly vertexUVLoc: GLuint | null;

  private readonly texLoc: WebGLUniformLocation | null;
  private readonly texSizeLoc: WebGLUniformLocation | null;

  public constructor(gl: WebGLRenderingContext, shaderSource?: ShaderSource) {
    super(gl, shaderSource || TEXTURE_SHADER_SOURCE);

    this.vertexUVLoc = this.getAttribLocation(gl, 'aVertexUV');

    this.texLoc = this.getUniformLocation(gl, 'uTex');
    this.texSizeLoc = this.getUniformLocation(gl, 'uTexSize');
  }

  public enableVertexUVPosition(
    gl: WebGLRenderingContext,
    components: number,
    type: number,
    normalize: boolean,
    stride: number,
    offset: number
  ): void {
    if (this.vertexUVLoc != null && this.vertexUVLoc >= 0) {
      gl.vertexAttribPointer(this.vertexUVLoc, components, type, normalize, stride, offset);
      gl.enableVertexAttribArray(this.vertexUVLoc);
    }
  }

  public setTexture(gl: WebGLRenderingContext, tex: Texture, texSize?: number, texPos?: number): void {
    gl.activeTexture(gl.TEXTURE0 + (texPos || 0));
    gl.bindTexture(gl.TEXTURE_2D, tex);

    this.setUniform1i(gl, this.texLoc, texPos || 0);
    this.setUniform1f(gl, this.texSizeLoc, texSize || 1.0);
  }
}
