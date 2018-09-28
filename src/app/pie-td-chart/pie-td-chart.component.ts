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
        this.segments.push(cylinder);
        this.scene.three.add(cylinder);
        shift += piece;
      });
    }, 500);

    this.subscription = this.teamsService.teamsChanged.subscribe((teams: Team[]) => {
      this.teams = teams;
      this.updateSegments();
    });
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
