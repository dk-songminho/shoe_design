			import * as THREE from '../build/three.module.js';

			import { OrbitControls } from 'jsm/controls/OrbitControls.js';
			import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from 'jsm/loaders/RGBELoader.js';
			import { RoughnessMipmapper } from 'jsm/utils/RoughnessMipmapper.js';

			var container, controls;
			var camera, scene, renderer;
			var m_sole, m_quarter,m_tongue,m_toecap,m_lace,m_ring;

			init();
			render();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
				camera.position.set( 3 , 0 , 4 );

				scene = new THREE.Scene();
				
				//Light
				var light = new THREE.DirectionalLight("#ffffff", 0.4);
				var pointLight = new THREE.PointLight("#ffffff", 0.2);
    			var pointLightBack = new THREE.PointLight("#ffffff", 0.4);
				var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
				light.position.set( 0, -70, 100 ).normalize();
				//light.position.set( camera.position ).normalize();
				//pointLight.position.set(0,-40,300);
				pointLightBack.position.set(0,-40,-100);

				scene.add(light);
				//scene.add(pointLight);
    			scene.add(pointLightBack);
    			scene.add(ambientLight);

				new RGBELoader()
					.setDataType( THREE.UnsignedByteType )
					.setPath( 'textures/equirectangular/' )
					.load( 'royal_esplanade_1k.hdr', function ( texture ) {

						var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

						scene.background = envMap;
						scene.environment = envMap;

						texture.dispose();
						pmremGenerator.dispose();

						render();
					

						// model

						// use of RoughnessMipmapper is optional
					
						//var roughnessMipmapper = new RoughnessMipmapper( renderer );
					
						var loader = new GLTFLoader().setPath( 'models/gltf/shoe/' );
					
					
						//sole
						loader.load( 'sole.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									//roughnessMipmapper.generateMipmaps( child.material );
									m_sole =child;
									m_sole.material = new THREE.MeshPhongMaterial({color : 0xffffff });
									//m_sole.material.side = THREE.DoubleSide;
									//roughnessMipmapper.generateMipmaps( child.material );
								}

							} );

							scene.add( gltf.scene );

							//roughnessMipmapper.dispose();

							render(); 

						} );
					
						//quarter
						loader.load( 'quarter.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									//roughnessMipmapper.generateMipmaps( child.material );
									m_quarter = child ;
									//m_quarter.material = new THREE.MeshPhongMaterial( {color : 0xff00ff } );
									m_quarter.material = new THREE.MeshPhongMaterial({color : 0x000001});
									//m_quarter.material.side = THREE.DoubleSide;
									//m_quarter.geometry.scale(0.9,0.9,0.9);
									//roughnessMipmapper.generateMipmaps( child.material );
								}

							} );

							scene.add( gltf.scene );

							//roughnessMipmapper.dispose();

							render(); 

						} );

						//tongue
						loader.load( 'tongue.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									//roughnessMipmapper.generateMipmaps( child.material );
									m_tongue = child ;
									m_tongue.material = new THREE.MeshPhongMaterial({color : 0x00ff00});
									m_tongue.material.side = THREE.DoubleSide;
									
								}

							} );

							scene.add( gltf.scene );
							

							render(); 

						} );
					
						//toecap
						loader.load( 'toecap.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									
									m_toecap = child ;
									m_toecap.material = new THREE.MeshPhongMaterial({color : 0xffffff });
									m_toecap.material.side = THREE.DoubleSide;
								}

							} );

							scene.add( gltf.scene );

							render(); 

						} );
					
						//lace
						loader.load( 'lace.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									
									m_lace = child ;
									m_lace.material = new THREE.MeshPhongMaterial({color : 0xffffff});
									
								}

							} );

							scene.add( gltf.scene );

						

							render(); 

						} );
					
						//ring
						loader.load( 'ring.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

								
									m_ring = child ;
								}

							} );

							scene.add( gltf.scene );

							

							render(); 

						} );
					
					} );

				
				
				
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 0.8;
				renderer.outputEncoding = THREE.sRGBEncoding;
				container.appendChild( renderer.domElement );

				var pmremGenerator = new THREE.PMREMGenerator( renderer );
				pmremGenerator.compileEquirectangularShader();

				controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				
				controls.minDistance = 3;
				controls.maxDistance = 10;
				controls.target.set( 0, 0,  0 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			//

			function render() {

				renderer.render( scene, camera );

			}