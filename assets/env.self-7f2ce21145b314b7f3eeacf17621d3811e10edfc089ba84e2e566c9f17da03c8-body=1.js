var DOMlink;

var camera, scene, renderer;
var controls;
var light;

var outerSphereMesh,
    innerSphereMesh;

var moonGlow,
    moonGlow2

var outerSphereGeometry,
    outerPointsGeometry,
    innerSphereGeometry,
    innerPointsGeometry;

var effectShouldHappen = false
var spriteRefs

var _env = (function () {

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    return {
        init: function () {

            DOMlink = document.getElementById('renderViewport');

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.z = 1700;

            //render setup
            renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            DOMlink.appendChild(renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);

            // rotate continuously
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.autoRotate = true;
            controls.autoRotateSpeed = 3
            controls.enabled = false

            spriteRefs = []

            _env.buildBackground()
            _env.buildGlobe()
            _env.animate()

            t.init()

            function onWindowResize() {
                if (window.innerHeight > 700) {
                    windowHalfX = window.innerWidth / 2;
                    windowHalfY = window.innerHeight / 2;
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
            }

        },
        buildBackground: function () {
            // light
            light = new THREE.DirectionalLight(0xffffff);
            light.position.set(0, 0, 1);
            scene.add(light);
        },
        buildGlobe: function () {
            var loader = new THREE.TextureLoader()

            // outer sphere
            var faceIndices = ['a', 'b', 'c'];
            var color, f, p, vertexIndex, radius = 200;
            outerSphereGeometry = new THREE.IcosahedronGeometry(radius, 2);
            outerSphereGeometry.dynamic = true
            for (var i = 0; i < outerSphereGeometry.faces.length; i++) {
                f = outerSphereGeometry.faces[i];

                for (var j = 0; j < 3; j++) {
                    vertexIndex = f[faceIndices[j]];
                    p = outerSphereGeometry.vertices[vertexIndex];
                    color = new THREE.Color(0xffffff);
                    color.setHSL(( p.y / radius + 1 ) / 2, 1.0, 0.5);
                    f.vertexColors[j] = color;
                }
            }
            var materials = [
                new THREE.MeshPhongMaterial({
                    color: 0x8F6A29,
                    shading: THREE.FlatShading,
                    vertexColors: THREE.VertexColors,
                    shininess: 1,
                    side: THREE.BackSide,
                    transparent: true,
                    opacity: 0
                }),
                new THREE.MeshBasicMaterial({color: 0x8F6A29, shading: THREE.FlatShading, wireframe: true, transparent: true})
            ];
            outerSphereMesh = THREE.SceneUtils.createMultiMaterialObject(outerSphereGeometry, materials);
            outerSphereMesh.position.x = 0;
            if (window.location.pathname != '/globe')
                outerSphereMesh.rotation.x = -1.87;
            scene.add(outerSphereMesh);

            // inner sphere
            innerSphereGeometry = new THREE.IcosahedronGeometry(radius / 1.1, 3)
            var materials2 = new THREE.MeshPhongMaterial({
                color: 0x000000,
                shading: THREE.FlatShading,
                vertexColors: THREE.VertexColors,
                shininess: 1,
                transparent: false,
                opacity: 1
            })
            innerSphereMesh = new THREE.Mesh(innerSphereGeometry, materials2);
            innerSphereMesh.position.x = 0;
            if (window.location.pathname != '/globe')
                innerSphereMesh.rotation.x = -1.87;
            scene.add(innerSphereMesh);

            // grid of points overlayed on inner sphere
            innerPointsGeometry = new THREE.Geometry();
            innerPointsGeometry.vertices = innerSphereGeometry.vertices;
            var particles = new THREE.Points(innerPointsGeometry, new THREE.PointsMaterial({
                color: 0x8F6A29,
                size: 12,
                map: loader.load('assets/goldOval.png')
            }));
            particles.position.x = 0
            if (window.location.pathname != '/globe')
                particles.rotation.x = -2.87;
            scene.add(particles);

            // grid of points overlayed on outer sphere
            outerPointsGeometry = new THREE.Geometry()
            outerPointsGeometry.dynamic = true
            //outerPointsGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );
            outerPointsGeometry.vertices = outerSphereGeometry.vertices;
            var particles2 = new THREE.Points(outerPointsGeometry, new THREE.PointsMaterial({
                size: 25,
                map: loader.load('assets/goldOval.png')
            }));
            particles2.position.x = 0
            if (window.location.pathname != '/globe')
                particles2.rotation.x = -1.87;
            scene.add(particles2);

            // sprites on top of outer matrix
            var textureLoader2 = new THREE.TextureLoader()
            var spriteMaterial = new THREE.SpriteMaterial({
                map: textureLoader2.load('assets/glow.png'),
                color: 0x8F6A29,
                blending: THREE.AdditiveBlending,
                side: THREE.FrontSide
            })
            for (var i = 0; i < outerSphereGeometry.vertices.length; i++) {
                var sprite = new THREE.Sprite(spriteMaterial)
                sprite.position.copy(outerSphereGeometry.vertices[i])
                sprite.scale.set(0, 0, 0)
                outerSphereMesh.add(sprite)
                spriteRefs.push({sprite: sprite, index: i})
            }

            if (!isMobile()) {
                //main glow
                var customMaterial = new THREE.ShaderMaterial(
                    {
                        uniforms: {//0.4, 3.2
                            "c": {type: "f", value: 0.3},
                            "p": {type: "f", value: 2.3},
                            glowColor: {type: "c", value: new THREE.Color(0x906d34)},
                            viewVector: {type: "v3", value: camera.position}
                        },
                        vertexShader: document.getElementById('vertexShader').textContent,
                        fragmentShader: document.getElementById('fragmentShader').textContent,
                        side: THREE.BackSide,
                        blending: THREE.AdditiveBlending,
                        transparent: true
                    });
                var smoothCubeGeom = new THREE.SphereGeometry(200, 32, 16);
                var modifier = new THREE.BufferSubdivisionModifier(2);
                modifier.modify(smoothCubeGeom);
                moonGlow = new THREE.Mesh(smoothCubeGeom, customMaterial.clone());
                moonGlow.position = smoothCubeGeom.position;
                moonGlow.scale.multiplyScalar(1.2);
                scene.add(moonGlow);

                var customMaterial2 = new THREE.ShaderMaterial(
                    {
                        uniforms: {
                            "c": {type: "f", value: 0.2},
                            "p": {type: "f", value: 4.8},
                            glowColor: {type: "c", value: new THREE.Color(0x906d34)},
                            viewVector: {type: "v3", value: camera.position}
                        },
                        vertexShader: document.getElementById('vertexShader').textContent,
                        fragmentShader: document.getElementById('fragmentShader').textContent,
                        side: THREE.FrontSide,
                        blending: THREE.AdditiveBlending,
                        transparent: true
                    });
                var smoothCubeGeom2 = new THREE.SphereGeometry(200, 32, 16);
                var modifier2 = new THREE.BufferSubdivisionModifier(2);
                modifier2.modify(smoothCubeGeom2);
                moonGlow2 = new THREE.Mesh(smoothCubeGeom2, customMaterial2.clone());
                moonGlow2.position = smoothCubeGeom2.position;
                moonGlow2.scale.multiplyScalar(0.95);
                scene.add(moonGlow2);
            }

        },
        animate: function () {
            requestAnimationFrame(_env.animate);
            _env.renderEnv();
            controls.update();
            TWEEN.update();
        },
        renderEnv: function () {
            camera.lookAt(scene.position);
            renderer.clear();
            outerSphereGeometry.verticesNeedUpdate = true
            outerPointsGeometry.verticesNeedUpdate = true

            if (effectShouldHappen) {
                effectShouldHappen = false
                t.run()
            }

            if (!isMobile()){
                moonGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, moonGlow.position);
                moonGlow2.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, moonGlow2.position);
            }
            renderer.render(scene, camera);
        },
        fallbackInit: function () {
            $('#globeVid').removeClass('hide')
            document.getElementsByTagName('video')[0].play()
        }
    }

})()
