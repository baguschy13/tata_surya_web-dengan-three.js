var container;
var camera, scene, renderer;
var sun, mercury, venus;
var textures = {};
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var stars = [];
var starMaterials = [];

// Constants for astronomical units and period of Earth
var AU = 149.6e6; // 1 AU = 149.6 million km
var earthPeriod = 365.25; // Earth's orbital period in days

// Planet data (distances in AU and periods in Earth years)
var planets = [
    { name: 'Mercury', distance: 0.39, period: 0.24 },
    { name: 'Venus', distance: 0.72, period: 0.62 }
];

init();
animate();

function init() {
    container = document.getElementById('container');
    console.log('Container:', container);
    if (!container) {
        console.error('Container element not found');
        return;
    }

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 500; // Jarak awal kamera disesuaikan dengan skala baru
    console.log('Camera initialized');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Latar belakang hitam
    console.log('Scene initialized');

    // Light
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    console.log('Ambient light added');

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
    console.log('Directional light added');

    // Load textures (assuming these are valid paths)
    var textureLoader = new THREE.TextureLoader();
    textures.sun = textureLoader.load('matahari.jpeg');
    textures.mercury = textureLoader.load('merkurius.jpeg');
    textures.venus = textureLoader.load('venus.jpeg');
    console.log('Textures loaded');

    // Create sun
    var sunGeometry = new THREE.SphereGeometry(10, 32, 32);
    var sunMaterial = new THREE.MeshBasicMaterial({ map: textures.sun });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.scale.set(3, 3, 3); // Ukuran Matahari disesuaikan dengan skala baru
    scene.add(sun);
    console.log('Sun added');

    // Create Mercury
    var mercuryGeometry = new THREE.SphereGeometry(20, 32, 32);
    var mercuryMaterial = new THREE.MeshBasicMaterial({ map: textures.mercury });
    mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    mercury.position.x = 100; // Jarak dari Matahari disesuaikan dengan skala baru
    scene.add(mercury);
    console.log('Mercury added');

    // Create Venus
    var venusGeometry = new THREE.SphereGeometry(20.5, 32, 32);
    var venusMaterial = new THREE.MeshBasicMaterial({ map: textures.venus });
    venus = new THREE.Mesh(venusGeometry, venusMaterial);
    venus.position.x = 300; // Jarak dari Matahari disesuaikan dengan skala baru
    scene.add(venus);
    console.log('Venus added');

    // Add stars to the scene
    addStars();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    console.log('Renderer initialized');

    // Event listener
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('click', onClick, false);

    // Zoom controls
    var zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '+';
    zoomInButton.style.position = 'absolute';
    zoomInButton.style.bottom = '10px';
    zoomInButton.style.right = '50px';
    document.body.appendChild(zoomInButton);
    zoomInButton.addEventListener('click', function () {
        camera.position.z -= 10; // Kecepatan zoom disesuaikan dengan skala baru
    });

    var zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '-';
    zoomOutButton.style.position = 'absolute';
    zoomOutButton.style.bottom = '10px';
    zoomOutButton.style.right = '10px';
    document.body.appendChild(zoomOutButton);
    zoomOutButton.addEventListener('click', function () {
        camera.position.z += 10; // Kecepatan zoom disesuaikan dengan skala baru
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate sun around its axis
    sun.rotation.y += 0.01;

    // Rotate Mercury around the sun
    mercury.position.x = 200 * Math.cos(Date.now() * 0.001);
    mercury.position.z = 200 * Math.sin(Date.now() * 0.001);

    // Rotate Venus around the sun
    venus.position.x = 300 * Math.cos(Date.now() * 0.0008);
    venus.position.z = 300 * Math.sin(Date.now() * 0.0008);

    // Twinkle stars
    twinkleStars();

    renderer.render(scene, camera);
}

function addStars() {
    var starGeometry = new THREE.BufferGeometry();
    var starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    var starVertices = [];
    for (var i = 0; i < 1000; i++) {
        var x = Math.random() * 2000 - 1000;
        var y = Math.random() * 2000 - 1000;
        var z = Math.random() * 2000 - 1000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    var stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create an array of materials for twinkling effect
    for (var i = 0; i < 1000; i++) {
        starMaterials.push(new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
    }
}

function twinkleStars() {
    for (var i = 0; i < starMaterials.length; i++) {
        starMaterials[i].opacity = Math.random();
        starMaterials[i].transparent = true;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    camera.position.x = mouseX * 100; // Skala pergerakan kamera disesuaikan
    camera.position.y = mouseY * 100; // Skala pergerakan kamera disesuaikan
    camera.lookAt(scene.position);
}

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects([sun, mercury, venus]);

    if (intersects.length > 0) {
        if (intersects[0].object === sun) {
            showPlanetInfo('Sun', '1,392,700 km', '149.6 million km', '25 days');
        } else if (intersects[0].object === mercury) {
            showPlanetInfo('Mercury', '4,880 km', '57.9 million km', '59 days');
        } else if (intersects[0].object === venus) {
            showPlanetInfo('Venus', '12,104 km', '108.2 million km', '243 days');
        }
    }
}

function showPlanetInfo(name, diameter, distance, rotation) {
    var infoPopup = document.getElementById('infoPopup');
    infoPopup.style.display = 'block';
    document.getElementById('planetName').textContent = `Nama: ${name}`;
    document.getElementById('planetDiameter').textContent = `Diameter: ${diameter}`;
    document.getElementById('planetDistance').textContent = `Distance from Sun: ${distance}`;
    document.getElementById('planetRotation').textContent = `Rotation Period: ${rotation}`;
}

// Create info box
var infoBox = document.createElement('div');
infoBox.style.position = 'absolute';
infoBox.style.bottom = '10px';
infoBox.style.right = '10px';
infoBox.style.background = '#ffffff';
infoBox.style.padding = '10px';
infoBox.style.border = '1px solid #000000';
infoBox.style.fontFamily = 'Arial, sans-serif';
infoBox.innerHTML = `
    <p>NIM: 211080200071</p>
    <p>Nama: MOCH BAGUS TRI CAHYO</p>
    <p>Kelas: A3</p>
`;
document.body.appendChild(infoBox);
