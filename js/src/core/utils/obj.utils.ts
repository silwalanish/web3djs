import * as OBJLoader from 'webgl-obj-loader';

import Mesh from '../objects/mesh';

export function objToMesh(gl: WebGLRenderingContext, obj: OBJLoader.Mesh): Mesh {
  return new Mesh({
    gl,
    meta: {
      firstVertex: 0,
      meshType: gl.TRIANGLES,
      numVertex: obj.indices.length
    },
    positions: obj.vertices,
    uvs: obj.textures,
    indices: obj.indices,
    normals: obj.vertexNormals,
    posMetaData: {
      components: 3,
      normalize: false,
      offset: 0,
      stride: 0
    }
  });
}
