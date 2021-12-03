import { vec3 } from 'gl-matrix';

export interface Light {
  position: vec3;
  color: vec3;
  radius: number;
}

export default Light;
