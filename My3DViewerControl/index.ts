import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as THREE from "three";
import { OrbitControls } from '@three-ts/orbit-controls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class My3DViewerControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _cube: THREE.Mesh;
    private _raycaster: THREE.Raycaster;
    private _mouse: THREE.Vector2;
    private _intersected: THREE.Object3D | null = null;

    constructor() {
        // nothing here
    }

    public init(
        context: ComponentFramework.Context<IInputs>, 
        notifyOutputChanged: () => void, 
        state: ComponentFramework.Dictionary, 
        container: HTMLDivElement
    ): void {
        this._container = container;

        // Track window size - important for code inside updateView.
        context.mode.trackContainerResize(true);

        // Initialize Three.js renderer
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setClearColor(0xffffff); // Set background color to white - can set to different color to see the edges of the render window.
        this._renderer.shadowMap.enabled = true; // Enable shadow maps
        container.appendChild(this._renderer.domElement);

        

        // Create a scene
        this._scene = new THREE.Scene();

        // Add a camera
        this._camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

        this._camera.position.z = 10;

        // Create a cube
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Use MeshStandardMaterial for better lighting
        // this._cube = new THREE.Mesh(geometry, material);
        // this._cube.castShadow = true; // Enable casting shadows
        // this._scene.add(this._cube);

         // 创建 PCB 板层
         const layers = 50;
         const layerThickness = 0.1;
         const layerWidth = 5;
         const layerHeight = 5;

         function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // 加载字体
        const fontLoader = new FontLoader();
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            for (let i = 0; i < layers; i++) {
                const geometry = new THREE.BoxGeometry(layerWidth, layerThickness, layerHeight);
                const material = new THREE.MeshPhongMaterial({ color: getRandomColor(), opacity: 1, transparent: true });
                const pcbLayer = new THREE.Mesh(geometry, material);
                pcbLayer.position.y = i * layerThickness; // 设置每层的位置
                this._scene.add(pcbLayer);

                // 添加引线
                // 添加横线指向每层中心
                const points = [];
                points.push(new THREE.Vector3(0, i * layerThickness, layerHeight / 2)); // 起点
                points.push(new THREE.Vector3(layerWidth, i * layerThickness, layerHeight / 2)); // 终点
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this._scene.add(line);

                // 添加文本
                const textGeometry = new TextGeometry(`layer ${i + 1} thickness ${layerThickness}`, {
                    font: font,
                    size: 0.06,
                    height: 0.02,
                });
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.set(layerWidth / 2 + 0.7, i * layerThickness, layerHeight / 2);
                this._scene.add(textMesh);
            }
        });

        // Create a plane to receive the shadow
        const planeGeometry = new THREE.PlaneGeometry(500, 500);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -1;
        plane.receiveShadow = true; // Enable receiving shadows
        this._scene.add(plane);

        // Add a directional light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        // light.castShadow = true; // Enable shadow casting by the light
        // light.shadow.mapSize.width = 1024;
        // light.shadow.mapSize.height = 1024;
        this._scene.add(light);

        // Initialize raycaster and mouse vector
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();

        // Add event listener for mouse click
        container.addEventListener('click', this.onMouseClick.bind(this), false);

        // 鼠标控制
        const controls = new OrbitControls(this._camera, this._renderer.domElement);

        // How far you can orbit vertically, upper and lower limits.
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;

        // How far you can dolly in and out ( PerspectiveCamera only )
        controls.minDistance = 0;
        controls.maxDistance = Infinity;

        controls.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations)

        controls.enableDamping = true; // Set to false to disable damping (ie inertia)
        controls.dampingFactor = 0.25;

        const animate = () => {
            requestAnimationFrame(animate);
            // this._cube.rotation.x += 0.01;
            // this._cube.rotation.y += 0.01;
            controls.update(); // 更新控制器
            this._renderer.render(this._scene, this._camera);
        };
        animate();

        //  // 场景、相机和渲染器
        //  var scene = new THREE.Scene();
        //  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //  const renderer = new THREE.WebGLRenderer();
        //  renderer.setSize(window.innerWidth, window.innerHeight);
        //  document.body.appendChild(renderer.domElement);
 
        //  // 添加光源
        //  const light = new THREE.DirectionalLight(0xffffff, 1);
        //  light.position.set(5, 5, 5).normalize();
        //  scene.add(light);
 
        //  // 创建 PCB 板层
        //  const layers = 10;
        //  const layerThickness = 0.1;
        //  const layerWidth = 5;
        //  const layerHeight = 5;
 
        //  for (let i = 0; i < layers; i++) {
        //      const geometry = new THREE.BoxGeometry(layerWidth, layerThickness, layerHeight);
        //      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, opacity: 0.8, transparent: true });
        //      const pcbLayer = new THREE.Mesh(geometry, material);
        //      pcbLayer.position.y = i * layerThickness; // 设置每层的位置
        //      scene.add(pcbLayer);
        //  }
 
        //  camera.position.z = 15;
 
        //  // 鼠标控制
        //  const controls = new THREE.OrbitControls(camera, renderer.domElement);
 
        //  // 渲染循环
        //  function animate() {
        //      requestAnimationFrame(animate);
        //      controls.update(); // 更新控制器
        //      renderer.render(scene, camera);
        //  }
        //  animate();
 
        //  // 处理窗口调整
        //  window.addEventListener('resize', () => {
        //      camera.aspect = window.innerWidth / window.innerHeight;
        //      camera.updateProjectionMatrix();
        //      renderer.setSize(window.innerWidth, window.innerHeight);
        //  });
    }

    
    // Change color on mouse click to check the 3D scene is interactable.
    private onMouseClick(event: MouseEvent): void {
        
        // Update the raycaster with the mouse position and the camera
        this._raycaster.setFromCamera(this._mouse, this._camera);

        // Calculate objects intersected by the raycaster
        const intersects = this._raycaster.intersectObjects(this._scene.children);

        if (intersects.length > 0) {
            // Check if the intersected object is the cube
            if (intersects[0].object === this._cube) {
                const material = this._cube.material;
                if (Array.isArray(material)) {
                    material.forEach((mat) => {
                        if (mat instanceof THREE.MeshStandardMaterial) {
                            mat.color.setHex(Math.random() * 0xffffff); // Change color on click
                        }
                    });
                } else if (material instanceof THREE.MeshStandardMaterial) {
                    material.color.setHex(Math.random() * 0xffffff); // Change color on click
                }
            }
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        
        // Change the render size depending on the parent container (the container that is inside the Canvas App)
        const width = context.mode.allocatedWidth;
        const height = context.mode.allocatedHeight;

        this._renderer.setSize(width, height);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Cleanup
        this._renderer.dispose();
    }
}
