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

// Function to retrieve and decrypt bioelectricity data from localStorage
async function getBioelectricity(key) {
    const encryptedData = localStorage.getItem("bioelectricityData");
    if (!encryptedData) return 10; // Start at 10 points if no data exists
    try {
        const decrypted = await decryptData(key, encryptedData);
        return parseFloat(decrypted);
    } catch {
        alert("Invalid decryption key");
        return 0;
    }
}

// Function to encrypt and store bioelectricity data in localStorage
async function saveBioelectricity(key, bioelectricity) {
    const encrypted = await encryptData(key, bioelectricity.toString());
    localStorage.setItem("bioelectricityData", encrypted);
}

// Function to calculate and update bioelectricity level based on cultivation minutes
async function addCultivation() {
    const minutes = parseInt(document.getElementById("minutes").value);
    const encryptionKey = document.getElementById("encryptionKey").value;
    if (!minutes || minutes < 1 || !encryptionKey) {
        alert("Please enter valid minutes and encryption key.");
        return;
    }

    const key = await getKeyFromPassword(encryptionKey);
    let currentBioelectricity = await getBioelectricity(key);

    // Formula: start with small increases, but the more bioelectricity you have, the more it grows
    const growthFactor = 1 + (currentBioelectricity / 10000); // Growth factor based on current bioelectricity
    currentBioelectricity += minutes * growthFactor; // More minutes, more bioelectricity

    await saveBioelectricity(key, currentBioelectricity);
    updateBioelectricityDisplay(currentBioelectricity);
}

// Function to update the display of current bioelectricity
function updateBioelectricityDisplay(bioelectricity) {
    document.getElementById("bioelectricity").innerText = bioelectricity.toFixed(2);
}

// Load and decrypt bioelectricity data on page load
window.onload = async function() {
    const encryptionKey = prompt("Enter your encryption key to load bioelectricity data:");
    if (encryptionKey) {
        const key = await getKeyFromPassword(encryptionKey);
        const bioelectricity = await getBioelectricity(key);
        updateBioelectricityDisplay(bioelectricity);
    }
};
