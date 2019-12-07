export type Buffer = WebGLBuffer | null;

export enum BufferType {
  ARRAY_BUFFER = WebGLRenderingContext.ARRAY_BUFFER,
  INDEX_BUFFER = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
}

function createBuffer(
  gl: WebGLRenderingContext,
  bufferType: BufferType,
  bufferData: ArrayBuffer | ArrayBufferView | null,
  usage: GLuint
): Buffer {
  const buffer: Buffer = gl.createBuffer();

  if (buffer) {
    gl.bindBuffer(bufferType, buffer);

    gl.bufferData(bufferType, bufferData, usage);
  }

  return buffer;
}

export function createFloatBuffer(
  gl: WebGLRenderingContext,
  bufferType: BufferType,
  bufferData: GLfloat[],
  usage: GLuint
): Buffer {
  return createBuffer(gl, bufferType, new Float32Array(bufferData), usage);
}

export function createIntBuffer(
  gl: WebGLRenderingContext,
  bufferType: GLuint,
  bufferData: GLint[],
  usage: GLuint
): Buffer {
  return createBuffer(gl, bufferType, new Int32Array(bufferData), usage);
}

export function createUIntBuffer(
  gl: WebGLRenderingContext,
  bufferType: GLuint,
  bufferData: GLint[],
  usage: GLuint
): Buffer {
  return createBuffer(gl, bufferType, new Uint16Array(bufferData), usage);
}
