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

// Function to add cultivation minutes to bioelectricity and chakras
function addCultivation() {
    const minutes = parseInt(document.getElementById("minutes").value);
    const chakraInputs = {
        base: parseInt(document.getElementById("base").value) || 0,
        sacral: parseInt(document.getElementById("sacral").value) || 0,
        solar: parseInt(document.getElementById("solar").value) || 0,
        heart: parseInt(document.getElementById("heart").value) || 0,
        throat: parseInt(document.getElementById("throat").value) || 0,
        thirdEye: parseInt(document.getElementById("thirdEye").value) || 0,
        crown: parseInt(document.getElementById("crown").value) || 0,
    };
    
    // Formula for bioelectricity: increase progressively based on cultivation minutes
    const growthFactor = 1 + (bioelectricity / 10000);
    bioelectricity += minutes * growthFactor;

    // Add chakra-specific cultivation
    for (const chakra in chakraInputs) {
        chakraLevels[chakra] += chakraInputs[chakra] * growthFactor;
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
    alert(`Your Data Key: ${dataKey}`);
}

// Function to load data from a provided key
function loadData() {
    const dataKey = document.getElementById("dataKey").value;
    if (!dataKey) {
        alert("Please enter a valid data key.");
        return;
    }

    try {
        const decodedData = atob(dataKey); // Decode Base64 key
        const parsedData = JSON.parse(decodedData);
        
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
