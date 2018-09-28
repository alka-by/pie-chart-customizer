import * as THREE from 'three';

export class Light {
  ambientLight: THREE.AmbientLight;
  hemisphereLight: THREE.HemisphereLight;
  directionalLight: THREE.DirectionalLight;

  constructor() {
    this.ambientLight = new THREE.AmbientLight('#000000', 1);
    this.ambientLight.custShadow = true;
    this.ambientLight.name = 'ambientLight';

    this.hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.25);
    this.hemisphereLight.position.set(500, 500, -200);
    this.hemisphereLight.name = 'hemisphereLight';

    this.directionalLight = new THREE.DirectionalLight(0xffffcc, 0.15);
    this.directionalLight.position.set(-1, 1.75, 1);
    this.directionalLight.position.multiplyScalar(1000);
    this.directionalLight.name = 'directionalLight';
  }
}
