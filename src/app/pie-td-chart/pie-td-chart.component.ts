import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import * as gsap from 'gsap';
import { OrbitControls } from '../3d-view/three-addons/OrbitControls.js';
import { DomEl } from '../3d-view/model/DomEl';
import { Scene } from '../3d-view/model/Scene';
import { Light } from '../3d-view/model/Light';
import { Color } from '../shared/Color';
import { ColorsService } from '../shared/colors.service';
import { Team } from '../model/team.model';
import { TeamsService } from '../shared/teams.service';
import { Subscription } from 'rxjs';

THREE.OrbitControls = OrbitControls(THREE);
// THREE.OBJLoader = require('../3d-view/three-addons/OBJLoader.js')(THREE);

@Component({
  selector: 'app-pie-td-chart',
  templateUrl: './pie-td-chart.component.html',
  styleUrls: ['./pie-td-chart.component.scss']
})
export class PieTdChartComponent implements OnInit, OnDestroy {
  @ViewChild('scene')
  sceneEl: ElementRef;

  subscription: Subscription;

  /*dom element for three scene*/
  domEl: DomEl = new DomEl();

  /*object with all scene components*/
  scene: Scene = new Scene();

  /*scene light object*/
  light: Light = new Light();

  colors: Color[];
  teams: Team[];
  pieces: number[] = [];
  segments: THREE.Mesh[] = [];
  planes: { plane1: THREE.Mesh; plane2: THREE.Mesh }[] = [];

  constructor(private colorsService: ColorsService, private teamsService: TeamsService) {}

  ngOnInit() {
    this.domEl.threeDomElement = <HTMLElement>this.sceneEl.nativeElement;

    this.prepareScene();

    const render = () => {
      this.scene.renderer.render(this.scene.three, this.scene.camera);
      requestAnimationFrame(render);
    };
    render();

    this.colors = this.colorsService.getColors();
    this.teams = this.teamsService.getTeams();
    this.calcPieces();

    setTimeout(() => {
      let shift = 0;
      console.log('pieces: ', this.pieces);
      this.pieces.forEach((piece: number, index: number) => {
        // if (piece > 0) { } // optimization
        const geometry = new THREE.CylinderBufferGeometry(20, 20, 3, 50, 2, false, shift, piece);
        const material = new THREE.MeshLambertMaterial({
          color: this.colors[index].base,
          emissive: this.colors[index].emissive,
          side: THREE.DoubleSide,
          transparent: true,
          name: 'router-material1' + index
        });
        const cylinder = new THREE.Mesh(geometry, material);

        const angle = shift + piece / 2;
        this.setSegmentPosition(cylinder, angle);

        const Pgeometry = new THREE.PlaneBufferGeometry(20, 3, 1, 1);
        const plane1 = new THREE.Mesh(Pgeometry, material);
        const plane2 = new THREE.Mesh(Pgeometry, material);
        this.setPlanesPositionsAndRotations(shift, piece, plane1, plane2, cylinder);

        this.planes.push({ plane1: plane1, plane2: plane2 });
        this.scene.three.add(plane1);
        this.scene.three.add(plane2);

        this.segments.push(cylinder);
        this.scene.three.add(cylinder);
        shift += piece;
        console.log(cylinder);
      });
    }, 500);

    this.subscription = this.teamsService.teamsChanged.subscribe((teams: Team[]) => {
      this.teams = teams;
      this.updateSegments();
    });

    // const axesHelper = new THREE.AxesHelper(5);
    // this.scene.three.add(axesHelper);
  }

  setSegmentPosition(cylinder: THREE.Mesh, angle: number) {
    if (angle < Math.PI / 2) {
      const x = 2 * Math.sin(angle);
      const z = 2 * Math.cos(angle);
      cylinder.position.set(x, 0, z);
    }
    if (angle >= Math.PI / 2 && angle < Math.PI) {
      const z = 2 * Math.sin(angle - Math.PI / 2);
      const x = 2 * Math.cos(angle - Math.PI / 2);
      cylinder.position.set(x, 0, -z);
    }
    if (angle >= Math.PI && angle < (Math.PI / 2) * 3) {
      const x = 2 * Math.sin(angle - Math.PI);
      const z = 2 * Math.cos(angle - Math.PI);
      cylinder.position.set(-x, 0, -z);
    }
    if (angle >= (Math.PI / 2) * 3) {
      const z = 2 * Math.sin(angle - (Math.PI / 2) * 3);
      const x = 2 * Math.cos(angle - (Math.PI / 2) * 3);
      cylinder.position.set(-x, 0, z);
    }
  }

  setPlanesPositionsAndRotations(shift, piece, plane1, plane2, cylinder) {
    console.log();
    const x = cylinder.position.x;
    const y = cylinder.position.y;
    const z = cylinder.position.z;
    plane1.rotation.set(0, Math.PI / 2 + shift, 0);
    if (shift < Math.PI / 2) {
      plane1.position.set(x + 10 * Math.sin(shift), y, z + 10 * Math.cos(shift));
    }
    if (shift >= Math.PI / 2 && shift < Math.PI) {
      plane1.position.set(
        x + 10 * Math.cos(shift - Math.PI / 2),
        y,
        z - 10 * Math.sin(shift - Math.PI / 2)
      );
    }
    if (shift >= Math.PI && shift < (Math.PI / 2) * 3) {
      plane1.position.set(
        x - 10 * Math.sin(shift - Math.PI),
        y,
        z - 10 * Math.cos(shift - Math.PI)
      );
    }
    if (shift >= (Math.PI / 2) * 3) {
      plane1.position.set(
        x - 10 * Math.cos(shift - (Math.PI / 2) * 3),
        y,
        z + 10 * Math.sin(shift - (Math.PI / 2) * 3)
      );
    }

    plane2.rotation.set(0, Math.PI / 2 + piece + shift, 0);
    if (piece < Math.PI / 2) {
      plane2.position.set(x + 10 * Math.sin(piece + shift), y, z + 10 * Math.cos(piece + shift));
    }
    if (piece >= Math.PI / 2 && piece < Math.PI) {
      plane2.position.set(
        x + 10 * Math.cos(piece + shift - Math.PI / 2),
        y,
        z - 10 * Math.sin(piece + shift - Math.PI / 2)
      );
    }
    if (piece >= Math.PI && piece < (Math.PI / 2) * 3) {
      plane2.position.set(
        x - 10 * Math.sin(piece + shift - Math.PI),
        y,
        z - 10 * Math.cos(piece + shift - Math.PI)
      );
    }
    if (piece >= (Math.PI / 2) * 3) {
      plane2.position.set(
        x - 10 * Math.cos(piece + shift - (Math.PI / 2) * 3),
        y,
        z + 10 * Math.sin(piece + shift - (Math.PI / 2) * 3)
      );
    }
  }

  calcPieces() {
    let amount = 0;
    this.pieces = [];
    this.teams.map((team: Team) => {
      amount += team.wins;
    });
    this.teams.map((team: Team, index: number) => {
      this.pieces.push((2 * Math.PI * team.wins) / amount);
    });
    // console.log(this.pieces);
  }

  updateSegments() {
    this.calcPieces();
    let shift = 0;

    this.segments.forEach((segment: THREE.Mesh, index: number) => {
      segment.geometry = new THREE.CylinderBufferGeometry(
        20,
        20,
        3,
        50,
        2,
        false,
        shift,
        this.pieces[index]
      );
      const angle = shift + this.pieces[index] / 2;
      this.setSegmentPosition(segment, angle);
      this.setPlanesPositionsAndRotations(
        shift,
        this.pieces[index],
        this.planes[index].plane1,
        this.planes[index].plane2,
        segment
      );
      shift += this.pieces[index];
    });
  }

  prepareScene() {
    /*scene size*/
    this.domEl.width = this.domEl.threeDomElement.clientWidth;
    this.domEl.height = this.domEl.threeDomElement.clientHeight;
    console.log(this.domEl);

    /*scene settings*/
    this.scene.camera = new THREE.PerspectiveCamera(
      50,
      this.domEl.width / this.domEl.height,
      1,
      2000
    );
    this.scene.camera.position.set(400, 400, 0);
    this.scene.camera.lookAt(this.scene.targetVector);

    this.scene.controls = new THREE.OrbitControls(this.scene.camera, this.domEl.threeDomElement);
    this.scene.controls.target.set(0, 0, 0);
    this.scene.controls.enablePan = true;
    this.scene.controls.update();

    this.scene.renderer.setSize(this.domEl.width, this.domEl.height); // Set the size of the WebGL viewport.
    this.scene.renderer.setClearColor(0xffffff, 0);
    this.scene.renderer.shadowMap.enabled = true;
    this.scene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.domEl.threeDomElement.appendChild(this.scene.renderer.domElement);

    this.scene.rotationPoint = new THREE.Vector3(
      this.scene.camera.rotation.x,
      this.scene.camera.rotation.y,
      this.scene.camera.rotation.z
    );

    console.log(this.scene);
    console.log(this.light);

    /*add light and environment*/
    this.scene.three.add(this.light.ambientLight);
    this.scene.three.add(this.light.hemisphereLight);
    this.scene.three.add(this.light.directionalLight);

    /*setting up camera*/
    this.scene.camera.position.set(this.scene.position - 10, this.scene.position + 10, 0);
    this.scene.camera.lookAt(this.scene.targetVector);
    this.scene.camera.updateProjectionMatrix();
    this.scene.rotationPoint = new THREE.Vector3(
      this.scene.camera.rotation.x,
      this.scene.camera.rotation.y,
      this.scene.camera.rotation.z
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
