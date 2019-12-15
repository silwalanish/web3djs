import { vec3, vec4 } from 'gl-matrix';

export default interface Light {
  position: vec3;
  color: vec4;
  radius: number;
}
