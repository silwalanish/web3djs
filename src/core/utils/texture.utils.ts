export type Texture = WebGLTexture | null;

export interface TextureMeta {
  url: string;
  level?: number;
  internalFormat?: GLuint;
  width?: number;
  height?: number;
  border?: number;
  color?: Uint8Array;
  srcFormat?: GLuint;
  srcType?: GLuint;
  minFilter?: GLuint;
  wrap_s?: GLuint;
  wrap_t?: GLuint;
  crossOrigin?: string;
}

const DEFAUTL_OPTIONS: TextureMeta = {
  url: '',
  level: 0,
  internalFormat: WebGLRenderingContext.RGBA,
  width: 1,
  height: 1,
  border: 0,
  color: new Uint8Array([0, 0, 255, 255]),
  srcFormat: WebGLRenderingContext.RGBA,
  srcType: WebGLRenderingContext.UNSIGNED_BYTE,
  minFilter: WebGLRenderingContext.LINEAR,
  crossOrigin: 'anonymous'
};

function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}

export function genTexture2D(
  gl: WebGLRenderingContext,
  options: TextureMeta
): Texture {
  const {
    url,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    color,
    minFilter,
    wrap_s,
    wrap_t,
    crossOrigin
  } = Object.assign(Object.create(DEFAUTL_OPTIONS), options);

  const texture: Texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    color
  );

  const image: HTMLImageElement = new Image();
  image.crossOrigin = crossOrigin;
  image.onload = function (): void {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap_s);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap_t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    }
  };
  image.src = url;

  return texture;
}
