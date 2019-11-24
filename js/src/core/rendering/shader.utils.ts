import { error } from "../logger";

/**
 * Returns a WebGLShader if the source compiles successfully, null otherwise
 * 
 * @param gl WebGLRenderingContext
 * @param type GLuint
 * @param source string
 * 
 * @returns WebGLShader | null
 */
export function compileShader(gl: WebGLRenderingContext, type: GLuint, source: string) : WebGLShader | null {
  const shader: WebGLShader | null = gl.createShader(type);

  if (!shader) {
    error('An error occurred while creating shader.');

    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    error('An error occurred while compiling the shader: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    
    return null;
  }

  return shader;
}

/**
 * Returns a WebGLProgram if the shaders are valid, null otherwise
 * 
 * @param gl WebGLRenderingContext
 * @param vsSource string Vertex shader source
 * @param fsSource string Fragment shader source
 * 
 * @returns WebGLProgram | null
 */
export function genShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) : WebGLProgram | null {
  const vertexShader: WebGLShader | null = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  if (!vertexShader) {
    error('Unable to create program.');
    
    return null;
  }

  const fragmentShader: WebGLShader | null = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!fragmentShader) {
    error('Unable to create program.');

    return null;
  }

  const shaderProgram: WebGLProgram | null = gl.createProgram();
  if (!shaderProgram) {
    error('Unable to create program.');

    return null;
  }

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));

    return null;
  }

  return shaderProgram;
}