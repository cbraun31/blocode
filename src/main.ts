import * as BABYLON from "@babylonjs/core";

// Get the canvas element from the HTML document
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Initialize the Babylon.js 3D engine
const engine = new BABYLON.Engine(canvas, true);

// This function creates the scene, camera, lights, and our grid of cubes
const createScene = (): BABYLON.Scene => {
    // Create a new scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.2, 1.0);

    // --- Player and Camera Setup ---
    const camera = new BABYLON.UniversalCamera(
        "playerCamera",
        new BABYLON.Vector3(0, 1.8, -10),
        scene
    );
    camera.attachControl(canvas, true);
    camera.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.speed = 0.15;
    camera.keysUp.push(87); // W
    camera.keysDown.push(83); // S
    camera.keysLeft.push(65); // A
    camera.keysRight.push(68); // D

    // --- Lighting ---
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.7;

    // --- Scenery ---
    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 20, height: 20 },
        scene
    );
    ground.checkCollisions = true;
    // 1. Create a new material for the cubes
    const cubeMat = new BABYLON.StandardMaterial("cubeMat", scene);

    // 2. Create a texture from our image file
    const cubeTexture = new BABYLON.Texture("assets/grid.png", scene);

    // 3. Apply the texture to the material's diffuse channel (base color)
    cubeMat.diffuseTexture = cubeTexture;
    const gridSize = 10;
    const spacing = 1.01;

    const masterCube = BABYLON.MeshBuilder.CreateBox(
        "masterCube",
        { size: 1 },
        scene
    );
    masterCube.isVisible = false;
    masterCube.checkCollisions = true;
    masterCube.material = cubeMat; // 4. Assign the new material to our master cube

    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            const cubeInstance = masterCube.createInstance(`cube_${x}_${z}`);
            const xPos = (x - gridSize / 2) * spacing + 1;
            const zPos = (z - gridSize / 2) * spacing + 1;
            cubeInstance.position = new BABYLON.Vector3(xPos, 0.5, zPos);
        }
    }

    // --- Pointer Lock for Mouse Look ---
    canvas.addEventListener("click", () => {
        engine.enterPointerlock();
    });

    return scene;
};

const scene = createScene();

// Run the render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", () => {
    engine.resize();
});
