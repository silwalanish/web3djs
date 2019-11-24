import { vec3, mat4 } from "gl-matrix";

export function calculateModelViewMat(position: vec3) : mat4 {
  const modelViewMatrix : mat4 = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, position);

  return modelViewMatrix;
}