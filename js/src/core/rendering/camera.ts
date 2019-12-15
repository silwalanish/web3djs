import { vec3, mat4 } from 'gl-matrix';
import { calculateViewMat, calculateProjectionMat, toRadians } from '../utils/matrix.utils';

export interface CameraOptions {
  fov?: number;
  aspect?: number;
  zNear?: number;
  zFar?: number;
  position?: vec3;
  rotation?: vec3;
  up?: vec3;
  speed?: number;
}

const DEFAULT_OPTIONS = {
  fov: 60,
  aspect: 1.33,
  zNear: 0.01,
  zFar: 1000,
  position: vec3.create(),
  rotation: vec3.fromValues(-90, 0, 0),
  up: vec3.fromValues(0, 1, 0),
  speed: 0.05
};

export default class Camera {
  private _fov: number;
  private _aspect: number;
  private _zNear: number;
  private _zFar: number;

  private _position: vec3;
  private _rotation: vec3;
  private _front: vec3;
  private _up: vec3;

  private _speed: number;

  private _projectionMat: mat4;
  private _viewMat: mat4;

  constructor(options: CameraOptions) {
    const { fov, aspect, zNear, zFar, position, rotation, up, speed } = Object.assign(
      Object.create(DEFAULT_OPTIONS),
      options
    );

    this._fov = fov;
    this._aspect = aspect;
    this._zNear = zNear;
    this._zFar = zFar;
    this._position = vec3.clone(position);
    this._rotation = vec3.clone(rotation);
    this._front = vec3.fromValues(0, 0, -1);
    this._up = vec3.clone(up);
    this._speed = speed;

    this.calculateFront();
    this.calculateMatrix();
  }

  public calculateMatrix(): void {
    this._projectionMat = calculateProjectionMat(this._fov, this._aspect, this._zNear, this._zFar);
    this._viewMat = calculateViewMat(this._position, this._front, this._up);
  }

  public calculateFront(): void {
    let yaw: number = toRadians(this._rotation[0]);
    let pitch: number = toRadians(this._rotation[1]);
    
    this._front[0] = Math.cos(pitch) * Math.cos(yaw);
    this._front[1] = Math.sin(pitch);
    this._front[2] = Math.cos(pitch) * Math.sin(yaw);
  }

  public getViewMatrix(): mat4 {
    return this._viewMat;
  }

  public getProjectionMatrix(): mat4 {
    return this._projectionMat;
  }

  public moveForward(): void {
    vec3.scaleAndAdd(this._position, this._position, this._front, this._speed);
  }

  public moveBack(): void {
    vec3.scaleAndAdd(this._position, this._position, this._front, -this._speed);
  }

  public moveLeft(): void {
    let dir: vec3 = vec3.create();
    
    vec3.normalize(dir, vec3.cross(dir, this._front, this._up));
    vec3.scaleAndAdd(this._position, this._position, dir, -this._speed);
  }

  public moveRight(): void {
    let dir: vec3 = vec3.create();
    
    vec3.normalize(dir, vec3.cross(dir, this._front, this._up));
    vec3.scaleAndAdd(this._position, this._position, dir, this._speed);
  }

  public set position(position: vec3) {
    this._position = position;
  }

  public get position(): vec3 {
    return this._position;
  }

  public set rotation(rotation: vec3) {
    this._rotation = rotation;
  }

  public get rotation(): vec3 {
    return this._rotation;
  }

  public get front(): vec3 {
    return this._front;
  }

  public set up(up: vec3) {
    this._up = up;
  }

  public get up(): vec3 {
    return this._up;
  }

  public set fov(fov: number) {
    this._fov = fov;
  }

  public get fov(): number {
    return this._fov;
  }

  public set aspect(aspect: number) {
    this._aspect = aspect;
  }

  public get aspect(): number {
    return this._aspect;
  }

  public set zNear(zNear: number) {
    this._zNear = zNear;
  }

  public get zNear(): number {
    return this._zNear;
  }

  public set zFar(zFar: number) {
    this._zFar = zFar;
  }

  public get zFar(): number {
    return this._zFar;
  }

  public set speed(speed: number) {
    this._speed = speed;
  }

  public get speed(): number {
    return this._speed;
  }
}
