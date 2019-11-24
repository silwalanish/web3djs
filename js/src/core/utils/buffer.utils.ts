export type Buffer = WebGLBuffer | null;

function createBuffer(
  gl: WebGLRenderingContext,
  bufferData: ArrayBuffer | ArrayBufferView | null,
  usage: GLuint
): Buffer {
  const buffer: Buffer = gl.createBuffer();

  if (buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, bufferData, usage);
  }

  return buffer;
}

export function createFloatBuffer(
  gl: WebGLRenderingContext,
  bufferData: GLfloat[],
  usage: GLuint
): Buffer {
  return createBuffer(gl, new Float32Array(bufferData), usage);
}

export function createIntBuffer(
  gl: WebGLRenderingContext,
  bufferData: GLint[],
  usage: GLuint
) : Buffer {
  return createBuffer(gl, new Int32Array(bufferData), usage);
}
