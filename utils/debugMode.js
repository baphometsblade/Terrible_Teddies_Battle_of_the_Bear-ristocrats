let debugMode = false;

function toggleDebugMode() {
    debugMode = !debugMode;
    console.log(`Debug mode is now ${debugMode ? 'enabled' : 'disabled'}.`);
}

function logDebug(message) {
    if (debugMode) {
        console.log(`DEBUG: ${message}`);
    }
}

function logError(error) {
    if (debugMode) {
        console.error(`ERROR: ${error.message}`, error.stack);
    }
}

module.exports = {
    toggleDebugMode,
    logDebug,
    logError
};