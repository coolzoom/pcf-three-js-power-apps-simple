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
    private _context: ComponentFramework.Context<IInputs>;
    
    constructor() {
        // nothing here
    }
    private containsCommaOrPipe(input: string): boolean {
        const regex = /[|,]/; // 正则表达式匹配逗号或竖线
        return regex.test(input); // 返回是否匹配
    }

    private initscene(): void {
         // if(this._renderer.domElement != null)
        // {
        //     this._container.removeChild(this._renderer.domElement);
        // }
         // Initialize Three.js renderer
         this._renderer = new THREE.WebGLRenderer({ antialias: true });
         this._renderer.setClearColor(0xffffff); // Set background color to white - can set to different color to see the edges of the render window.
         this._renderer.shadowMap.enabled = true; // Enable shadow maps
         this._container.appendChild(this._renderer.domElement);
 
         
         // 访问 sampleProperty
         const sampleValue = this._context.parameters.stackupstring.raw;
         console.log("Sample Property Value: ", sampleValue);
 
         // Create a scene
         this._scene = new THREE.Scene();
 
         // Add a camera
         this._camera = new THREE.PerspectiveCamera(75, this._container.clientWidth / this._container.clientHeight, 0.1, 1000);
 
         this._camera.position.z = 10;
 
         // Create a cube
         // const geometry = new THREE.BoxGeometry();
         // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Use MeshStandardMaterial for better lighting
         // this._cube = new THREE.Mesh(geometry, material);
         // this._cube.castShadow = true; // Enable casting shadows
         // this._scene.add(this._cube);
 
    }

    private finalizescene(): void {

         // Create a plane to receive the shadow
         const planeGeometry = new THREE.PlaneGeometry(500, 500);
         const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
         const plane = new THREE.Mesh(planeGeometry, planeMaterial);
         plane.rotation.x = -Math.PI / 2;
         plane.position.y = -5;
         plane.receiveShadow = true; // Enable receiving shadows
         this._scene.add(plane);
 
         // 添加环境光
         const ambientLight = new THREE.AmbientLight(0xffffff, 2);
         this._scene.add(ambientLight);
         
         // Add a directional light
         const light = new THREE.DirectionalLight(0xffffff, 10);
         light.position.set(5, 5, 0).normalize(); // 增加光源的强度和位置
         light.castShadow = true; // Enable shadow casting by the light
         light.shadow.mapSize.width = 1024;
         light.shadow.mapSize.height = 1024;
         this._scene.add(light);
 
         // Initialize raycaster and mouse vector
         this._raycaster = new THREE.Raycaster();
         this._mouse = new THREE.Vector2();
 
         // Add event listener for mouse click
         this._container.addEventListener('click', this.onMouseClick.bind(this), false);
 
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

    private drawpcb(): void {
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
      
              // 示例字符串
              let layerData = "Layer1,typeA,0.1|Layer2,typeB,0.15|Layer3,typeC,0.15|Layer4,typeA,0.1|Layer5,typeB,0.2|Layer6,typeC,0.15";

              const sampleValue: string | null = this._context.parameters.stackupstring.raw;

              if (sampleValue !== null) {
                if(this.containsCommaOrPipe(sampleValue))
                {
                    layerData = sampleValue;
                }
              } 

              // 将字符串按 | 分割成数组
              const layersInfo = layerData.split('|');
 
              // 加载字体
              const fontLoader = new FontLoader();
              fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                  let pospointer = 0;
                  layersInfo.forEach((layerStr, index) => {
                      // 将每个元素按逗号分割
                      const [layerName, layerType, layerThk] = layerStr.split(',');
      
                      const geometry = new THREE.BoxGeometry(layerWidth, parseFloat(layerThk), layerHeight);
                      // const material = new THREE.MeshPhongMaterial({ color: getRandomColor(), opacity: 1, transparent: true });
                      const material = new THREE.MeshStandardMaterial({ 
                          color: getRandomColor(), 
                          metalness: 0.8, // 设置金属度
                          roughness: 0.1, // 设置粗糙度
                          opacity: 1, 
                          transparent: true 
                      });
      
                      const pcbLayer = new THREE.Mesh(geometry, material);
                      pcbLayer.position.set(0,pospointer-parseFloat(layerThk)/2,0); // 设置每层的位置
                      pcbLayer.castShadow = true;
                      this._scene.add(pcbLayer);
      
                       // 创建边框
                       const edges = new THREE.EdgesGeometry(geometry);
                       const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // 黑色边框
                       const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
                       edgeLines.position.set(0,pospointer-parseFloat(layerThk)/2,0); // 设置每层的位置
                       this._scene.add(edgeLines);
      
                      // 添加引线
                      // 添加横线指向每层中心
                      const points = [];
                      points.push(new THREE.Vector3(layerWidth / 2, pospointer-parseFloat(layerThk)/2, layerHeight / 2)); // 起点
                      points.push(new THREE.Vector3(layerWidth, pospointer-parseFloat(layerThk)/2, layerHeight / 2)); // 终点
                      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
                      const line = new THREE.Line(lineGeometry, lineMaterial);
                      line.castShadow = true;
                      this._scene.add(line);
      
                      // 添加文本
                      const textGeometry = new TextGeometry(`layer ${layerName} thickness ${parseFloat(layerThk)}`, {
                          font: font,
                          size: 0.06,
                          height: 0.02,
                      });
                      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                      textMesh.position.set(layerWidth / 2 + 0.7, pospointer-parseFloat(layerThk)/2, layerHeight / 2);
                      textMesh.castShadow = true;
                      this._scene.add(textMesh);
                      
                      pospointer -= parseFloat(layerThk);
                  });


                    // 绘制从第一层到第三层的圆柱体
                    const cylinderGeometry1 = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
                    const cylinderMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                    const cylinder1 = new THREE.Mesh(cylinderGeometry1, cylinderMaterial1);
                    cylinder1.position.set(0, 1, 0); // 设置位置在第一层中间
                    this._scene.add(cylinder1);

                    // 绘制从最后一层到第二层的圆柱体
                    const cylinderGeometry2 = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
                    const cylinderMaterial2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
                    const cylinder2 = new THREE.Mesh(cylinderGeometry2, cylinderMaterial2);
                    cylinder2.position.set(0, 2, 0); // 设置位置在第二层中间
                    cylinder2.rotation.x = Math.PI / 2; // 旋转以使其垂直
                    this._scene.add(cylinder2);

                    // 绘制坐标轴
                    const axesHelper = new THREE.AxesHelper(5); // 参数为坐标轴的长度
                    this._scene.add(axesHelper);
                    {
                        // 添加x文本
                        const textGeometry = new TextGeometry(`X`, {
                            font: font,
                            size: 1,
                            height: 0.02,
                        });
                        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                        textMesh.position.set(5, 0, 0);
                        this._scene.add(textMesh);
                    }
                    {
                        // 添加y文本
                        const textGeometry = new TextGeometry(`Y`, {
                            font: font,
                            size: 1,
                            height: 0.02,
                        });
                        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                        textMesh.position.set(0, 5, 0);
                        this._scene.add(textMesh);
                    }                    
                    {
                        // 添加z文本
                        const textGeometry = new TextGeometry(`Z`, {
                            font: font,
                            size: 1,
                            height: 0.02,
                        });
                        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                        textMesh.position.set(0, 0, 5);
                        this._scene.add(textMesh);
                    }

                    
                
                  // test
                  const istest = false;
                  if(istest)
                  {
                      for (let i = 0; i < layers; i++) {
                          const geometry = new THREE.BoxGeometry(layerWidth, layerThickness, layerHeight);
                          // const material = new THREE.MeshPhongMaterial({ color: getRandomColor(), opacity: 1, transparent: true });
                          const material = new THREE.MeshStandardMaterial({ 
                              color: getRandomColor(), 
                              metalness: 0.8, // 设置金属度
                              roughness: 0.1, // 设置粗糙度
                              opacity: 1, 
                              transparent: true 
                          });
          
                          const pcbLayer = new THREE.Mesh(geometry, material);
                          pcbLayer.position.y = i * layerThickness; // 设置每层的位置
                          this._scene.add(pcbLayer);
          
                           // 创建边框
                           const edges = new THREE.EdgesGeometry(geometry);
                           const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // 黑色边框
                           const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
                           edgeLines.position.y = i * layerThickness; // 设置边框位置
                           this._scene.add(edgeLines);
          
                          // 添加引线
                          // 添加横线指向每层中心
                          const points = [];
                          points.push(new THREE.Vector3(layerWidth / 2, i * layerThickness, layerHeight / 2)); // 起点
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
                  }
      
              });

    }

    public init(
        context: ComponentFramework.Context<IInputs>, 
        notifyOutputChanged: () => void, 
        state: ComponentFramework.Dictionary, 
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._context = context;
        // Track window size - important for code inside updateView.
        this._context.mode.trackContainerResize(true);
        
        //init scene
        this.initscene();

         //drawpcb
         this.drawpcb();

         //finalize scene
         this.finalizescene();
 
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
        
        //draw threejs
        //this.drawthreejs(); //todo, this would adding duplicate threejs object, need fix
        
        // 清空场景中的所有对象
        const clearScene = () => {
            while (this._scene.children.length > 0) {
                this._scene.remove(this._scene.children[0]); // 移除第一个子对象
            }
        }

        // 使用示例
        clearScene(); // 调用此函数以清空场景
        //重新绘制
        //init scene
        //this.initscene();

        //drawpcb
        this.drawpcb();

        //finalize scene
        this.finalizescene();


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
