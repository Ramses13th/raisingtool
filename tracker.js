// AES Encryption and Decryption Functions (using SubtleCrypto)
async function encryptData(key, data) {
    const encoded = new TextEncoder().encode(data);
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: new Uint8Array(12) },
        key,
        encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function decryptData(key, data) {
    const decoded = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(12) },
        key,
        decoded
    );
    return new TextDecoder().decode(decrypted);
}

// Generate AES-GCM key from user input
async function getKeyFromPassword(password) {
    const encoded = new TextEncoder().encode(password);
    const key = await crypto.subtle.importKey(
        "raw",
        encoded,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
    return key;
}

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

// Function to save data (encrypt and store in localStorage)
async function saveData() {
    const encryptionKey = document.getElementById("encryptionKey").value;
    if (!encryptionKey) {
        alert("Please enter an encryption key to save data.");
        return;
    }
    
    const key = await getKeyFromPassword(encryptionKey);
    const data = JSON.stringify({ bioelectricity, chakraLevels });
    const encryptedData = await encryptData(key, data);
    
    localStorage.setItem("bioelectricityData", encryptedData);
    alert("Data saved and encrypted.");
}

// Function to load data (decrypt from localStorage)
async function loadData() {
    const encryptionKey = document.getElementById("encryptionKey").value;
    if (!encryptionKey) {
        alert("Please enter the correct encryption key to load data.");
        return;
    }
    
    const key = await getKeyFromPassword(encryptionKey);
    const encryptedData = localStorage.getItem("bioelectricityData");
    if (!encryptedData) {
        alert("No saved data found.");
        return;
    }
    
    try {
        const decryptedData = await decryptData(key, encryptedData);
        const parsedData = JSON.parse(decryptedData);
        bioelectricity = parsedData.bioelectricity;
        chakraLevels = parsedData.chakraLevels;
        
        updateBioelectricityDisplay();
        updateChakraLevelsDisplay();
        alert("Data loaded successfully.");
    } catch (error) {
        alert("Invalid decryption key or corrupted data.");
    }
}

// Function to reset all data
function resetData() {
    if (confirm("Are you sure you want to reset all data?")) {
        bioelectricity = 10;
        chakraLevels = { base: 0, sacral: 0, solar: 0, heart: 0, throat: 0, thirdEye: 0, crown: 0 };
        localStorage.removeItem("bioelectricityData");
        
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
