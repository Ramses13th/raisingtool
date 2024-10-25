// Default bioelectricity and chakra levels
let bioelectricity = 10;
let chakraLevels = {
    base: 0,
    sacral: 0,
    solar: 0,
    heart: 0,
    throat: 0,
    thirdEye: 0,
    crown: 0
};

// Ensure the input values are valid numbers or default to 0 to prevent NaN issues
function getInputValue(id) {
    return parseInt(document.getElementById(id).value) || 0;
}

// Function to add cultivation minutes and chakra reps
function addCultivation() {
    const minutes = getInputValue("minutes");
    const chakraReps = {
        base: getInputValue("base"),
        sacral: getInputValue("sacral"),
        solar: getInputValue("solar"),
        heart: getInputValue("heart"),
        throat: getInputValue("throat"),
        thirdEye: getInputValue("thirdEye"),
        crown: getInputValue("crown"),
    };
    
    // Formula for bioelectricity: increase progressively based on cultivation minutes and chakra reps
    const growthFactor = 1 + (bioelectricity / 10000);
    bioelectricity += minutes * growthFactor;

    // Chakra reps also contribute to bioelectricity
    for (const chakra in chakraReps) {
        bioelectricity += chakraReps[chakra] * (growthFactor * 0.5); // Reps give half the increase of minutes
        chakraLevels[chakra] += chakraReps[chakra] * growthFactor;
    }

    updateBioelectricityDisplay();
    updateChakraLevelsDisplay();
}

// Function to update the bioelectricity display
function updateBioelectricityDisplay() {
    document.getElementById("bioelectricity").innerText = bioelectricity.toFixed(2);
}

// Function to update the chakra levels display
function updateChakraLevelsDisplay() {
    const chakraOutput = Object.keys(chakraLevels).map(chakra => {
        return `${chakra.charAt(0).toUpperCase() + chakra.slice(1)} Chakra: ${chakraLevels[chakra].toFixed(2)}<br>`;
    }).join("");
    document.getElementById("chakraLevels").innerHTML = chakraOutput;
}

// Function to generate a unique data key (ID) and save data as JSON
function saveData() {
    const data = JSON.stringify({ bioelectricity, chakraLevels });
    const dataKey = btoa(data); // Base64 encoding as a key

    // Display the data key
    document.getElementById("dataKeyDisplay").innerText = dataKey;

    // Copy to clipboard
    navigator.clipboard.writeText(dataKey).then(() => {
        alert("Data key copied to clipboard!");
    }).catch(() => {
        alert("Unable to copy data key to clipboard.");
    });
}

function loadData() {
    const dataKey = document.getElementById("dataKey").value;
    if (!dataKey) {
        alert("Please enter a valid data key.");
        return;
    }

    try {
        const decodedData = atob(dataKey); // Decode Base64 key
        const parsedData = JSON.parse(decodedData);
        
        // Load the data into the app
        bioelectricity = parsedData.bioelectricity;
        chakraLevels = parsedData.chakraLevels;
        
        updateBioelectricityDisplay();
        updateChakraLevelsDisplay();
        alert("Data loaded successfully.");
    } catch (error) {
        alert("Invalid data key.");
    }
}

// Function to reset all data
function resetData() {
    if (confirm("Are you sure you want to reset all data?")) {
        bioelectricity = 10;
        chakraLevels = { base: 0, sacral: 0, solar: 0, heart: 0, throat: 0, thirdEye: 0, crown: 0 };
        
        updateBioelectricityDisplay();
        updateChakraLevelsDisplay();
        alert("All data has been reset.");
    }
}

// Initialize display on load
window.onload = function() {
    updateBioelectricityDisplay();
    updateChakraLevelsDisplay();
};
