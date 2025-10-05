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
            cubeInstance.showBoundingBox = true;
            cubeInstance.checkCollisions = true;
        }
    }


    // --- Pointer Lock for Mouse Look ---
    canvas.addEventListener("click", () => {
        if (engine.isPointerLock) {
            // Origin: The camera's absolute position in the world.
            const rayOrigin = camera.position; 
            // Direction: The camera's forward vector (where it's pointing).
            // The getDirection method uses a direction vector relative to the camera's axes.
            // BABYLON.Axis.Z is the camera's forward axis.
            const rayDirection = camera.getDirection(BABYLON.Axis.Z);
            // Length: How far the ray should travel (e.g., 100 units)
            const rayLength = 100;
            // Create the Ray object
            const ray = new BABYLON.Ray(rayOrigin, rayDirection, rayLength);
            // Cast the Ray
            // The second parameter (predicate) is null to check all pickable meshes.
            const pickResult = scene.pickWithRay(ray);
            // Handle the Intersection
            if (! (pickResult == null) && pickResult.hit) {
                const intersectedMesh = pickResult.pickedMesh;
                if (! (intersectedMesh == null)){
                     console.log(`Hit mesh directly in front of camera: ${intersectedMesh.name}`);
                
                    // Example action: change the hit mesh color to a random color
                    // if (intersectedMesh.material instanceof BABYLON.StandardMaterial) {
                    //     intersectedMesh.material.diffuseColor = BABYLON.Color3.Random();
                    // }
                    intersectedMesh.dispose();

                    // Optional: Show the ray for debugging
                    const rayHelper = new BABYLON.RayHelper(ray);
                    rayHelper.show(scene, BABYLON.Color3.Teal());
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
});

// Watch for browser/canvas resize events
window.addEventListener("resize", () => {
    engine.resize();
});
