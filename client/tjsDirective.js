angular.module('myApp').directive('tjs',
  ['$window', function ($window) {
    return {
      restrict: 'A',
      scope: {
        spheres: '='
      },
      link: function (scope, elem, attr) {
        // GLOBAL VARIABLES ========================================
        var camera, scene, renderer, controls, clock, mouse, light;

        setCanvas(elem[0]);
        init();
        animate();

        scope.$watchCollection('spheres', redrawSpheres);
        scope.$on('redraw', redrawSpheres);
        scope.$on('removeSphere', function (evt, actor) {
          scene.remove(actor);
        });

        function redrawSpheres () {
          scope.spheres.forEach(function (sphere) {
            if (!sphere.actor) {
              // the sphere has not been drawn yet
              drawSphere(sphere);
            } else {
              sphere.actor.position.set(sphere.x, sphere.y, 0);
            }
          });
        }

        
        function setCanvas(elem) {
          // Compute the pixel ratio
          var realToCSSPixels = window.devicePixelRatio || 1;

          // Try to get the webgl context
          var gl = null;
          try {
            gl = elem.getContext('webgl') || elem.getContext('experimental-webgl');
          }
          catch(e) {}
          if (!gl) {
            alert('WebGL not available');
          }

          // Resize :
          var displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
          var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

          // Check if the canvas is not the same size.
          if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
            // Make the canvas the same size
            gl.canvas.width = displayWidth;
            gl.canvas.height = displayHeight;
            // Set the viewport to match
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
          }
        }

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
          var width = window.innerWidth * 0.8;
          var height = window.innerHeight * 0.7;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }

        // INIT FUNCTION ==============================================
        function init() {
          // init Threejs elements
          clock = new THREE.Clock();
          mouse = new THREE.Vector2(0.0, 0.0);
          renderer = new THREE.WebGLRenderer({ canvas: elem[0], antialias: true, alpha: true });
          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera(45, elem[0].clientWidth / elem[0].clientHeight, 1, 10000);
          camera.lookAt(scene.position);
          scene.add(camera);
          camera.position.set(0,0,1000);

          // add light
          light = new THREE.DirectionalLight(0xffffff, 1);
          light.position.set(camera.position.x, camera.position.y, camera.position.z);
          scene.add(light);

          // add controls for mouse movements
          controls = new THREE.OrbitControls(camera, elem[0]);
          controls.target.set(0, 0, 0); // view direction perpendicular to XY-plane
          controls.enableRotate = true;
          controls.enablePan = true;
          controls.enableOrbit = true; 
          controls.enableZoom = true;
        }

        function animate() {
          setTimeout(function() { requestAnimationFrame(animate); }, 1000 / 10);
          var delta = clock.getDelta();
          controls.update(delta);
          render();
        }

        function render() {
          renderer.render(scene, camera);
        }

        function drawSphere(object) {
          var segments = 16, rings = 16;
          var geom = new THREE.SphereGeometry(object.radius, segments, rings);
          var material = new THREE.MeshLambertMaterial({ color: object.color });
          var sphere = new THREE.Mesh(geom, material);
          object.actor = sphere;
          sphere.position.set(object.x,object.y,0);
          sphere.overdraw = true;
          scene.add(sphere);
        }
      }
    };  
  }
]);