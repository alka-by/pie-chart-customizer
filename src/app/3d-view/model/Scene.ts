import * as THREE from 'three';

export class Scene {
  public three: THREE.Scene;
  public camera: any;
  public controls: any;
  public renderer: THREE.WebGLRenderer;
  public rotationPoint: any;
  public position: any;
  public targetVector: THREE.Vector3;

  constructor() {
    this.three = new THREE.Scene();
    this.camera = null;
    this.controls = null;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.rotationPoint = null;
    this.targetVector = new THREE.Vector3(0, 0, 0);
    this.position = 40;
  }
}
