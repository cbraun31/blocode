import * as BABYLON from "@babylonjs/core";
const divFps = document.getElementById("fps");
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

const createScene = (): BABYLON.Scene => {
    const scene = new BABYLON.Scene(engine);
    scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.2, 1.0);

    // --- Player and Camera Setup ---
    const camera = new BABYLON.UniversalCamera(
        "playerCamera",
        new BABYLON.Vector3(0, 3, 0),
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
        new BABYLON.Vector3(5, 1, 5),
        scene
    );
    light.intensity = 0.7;

    // Create a new material for the cubes
    const cubeMat = new BABYLON.StandardMaterial("cubeMat", scene);
    cubeMat.freeze();
    const cubeTexture = new BABYLON.Texture("assets/grid.png", scene);
    cubeMat.diffuseTexture = cubeTexture;
    const gridSize = 40;
    const masterCube = BABYLON.MeshBuilder.CreateBox(
        "masterCube",
        { size: 1 },
        scene
    );
    masterCube.convertToUnIndexedMesh();
    masterCube.isVisible = false;
    masterCube.checkCollisions = true;
    masterCube.material = cubeMat; 

    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            const cubeInstance = masterCube.createInstance(`cube_${x}_${z}`);
            const xPos = (x - gridSize / 2) + 1;
            const zPos = (z - gridSize / 2) + 1;
            cubeInstance.position = new BABYLON.Vector3(xPos, 0.5, zPos);
            cubeInstance.showBoundingBox = true;
            cubeInstance.checkCollisions = true;
        }
    }

    // --- Pointer Lock for Mouse Look ---
    canvas.addEventListener("click", () => {
        if (engine.isPointerLock) {
            const rayOrigin = camera.position; 
            // z axis is always direction camera is facing
            const rayDirection = camera.getDirection(BABYLON.Axis.Z);
            const rayLength = 100;
            const ray = new BABYLON.Ray(rayOrigin, rayDirection, rayLength);
            const pickResult = scene.pickWithRay(ray);
            // check null AND 'undefined' at once here with == instead of ===
            if (! (pickResult == null) && pickResult.hit) {
                const intersectedMesh = pickResult.pickedMesh;
                if (! (intersectedMesh == null)){
                    console.log(`Hit mesh directly in front of camera: ${intersectedMesh.name}`);
                    intersectedMesh.dispose();
                    // Optional: Show the ray for debugging
                    var helpRay = ray.clone();
                    helpRay.origin.addInPlace(new BABYLON.Vector3(0, 0, 0));
                    const rayHelper = new BABYLON.RayHelper(helpRay);
                    rayHelper.show(scene, BABYLON.Color3.Red());
                    setTimeout(() => rayHelper.dispose(), 3500); // Remove after a short delay
                }
               
            } else {
                console.log("No mesh was hit along the camera's forward vector.");
            }
        } else {
            engine.enterPointerlock();
        }
        
    });
    return scene;
};
const scene = createScene();

// Run the render loop
engine.runRenderLoop(() => {
    scene.render();
    if (! (divFps == null)) {
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
    }
});

// Watch for browser/canvas resize events
window.addEventListener("resize", () => {
    engine.resize();
});

