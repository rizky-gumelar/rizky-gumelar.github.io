/* ============================================
   ZERO WIDTH STEGANOGRAPHY - MAIN SCRIPT
   Educational Tool for Invisible Text Encoding
   ============================================ */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const CONFIG = {
    // Unicode characters for zero-width encoding
    ZERO_WIDTH_SPACE: '\u200B',          // Binary 1
    ZERO_WIDTH_NON_JOINER: '\u200C',     // Binary 0
    ZERO_WIDTH_JOINER: '\u200D',         // Separator between characters

    // Visualization markers
    MARKER_1: '[1]',
    MARKER_0: '[0]',
    MARKER_SEPARATOR: '[|]',

    // Byte ratio threshold for warning
    BYTE_RATIO_THRESHOLD: 3,
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    visualize: false,
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
};

// ============================================
// CORE ENCODING/DECODING FUNCTIONS
// ============================================

/**
 * Convert a string to its binary representation
 * @param {string} text - Input text to convert
 * @returns {string} Binary string (e.g., "01000001")
 */
function textToBinary(text) {
    return text
        .split('')
        .map(char => {
            // Get the character code and convert to 8-bit binary
            const code = char.charCodeAt(0);
            return code.toString(2).padStart(8, '0');
        })
        .join('');
}

/**
 * Convert binary string to text
 * @param {string} binary - Binary string (e.g., "0100000101000010")
 * @returns {string} Decoded text
 */
function binaryToText(binary) {
    try {
        // Split into 8-bit chunks and convert each to character
        const result = binary
            .match(/.{1,8}/g)
            ?.map(byte => {
                const code = parseInt(byte, 2);
                // Only include valid character codes
                if (code >= 0 && code <= 127) {
                    return String.fromCharCode(code);
                }
                return '';
            })
            .join('');

        return result || '';
    } catch (error) {
        console.error('Error in binaryToText:', error);
        return '';
    }
}

/**
 * Extract zero-width characters from text
 * Handles all three types of zero-width markers
 * @param {string} text - Text containing zero-width characters
 * @returns {string} Extracted zero-width sequence
 */
function extractZeroWidth(text) {
    if (!text) return '';

    let extracted = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const code = char.charCodeAt(0);

        // Check if character is one of our zero-width markers
        if (code === 0x200B) { // Zero Width Space (1)
            extracted += CONFIG.ZERO_WIDTH_SPACE;
        } else if (code === 0x200C) { // Zero Width Non-Joiner (0)
            extracted += CONFIG.ZERO_WIDTH_NON_JOINER;
        } else if (code === 0x200D) { // Zero Width Joiner (Separator)
            extracted += CONFIG.ZERO_WIDTH_JOINER;
        }
    }

    return extracted;
}

/**
 * Convert extracted zero-width sequence to binary
 * Respects separator boundaries
 * @param {string} zeroWidthSeq - Zero-width character sequence
 * @returns {string} Binary representation
 */
function zeroWidthToBinary(zeroWidthSeq) {
    if (!zeroWidthSeq) return '';

    let binary = '';

    for (let i = 0; i < zeroWidthSeq.length; i++) {
        const char = zeroWidthSeq[i];

        if (char === CONFIG.ZERO_WIDTH_SPACE) {
            binary += '1';
        } else if (char === CONFIG.ZERO_WIDTH_NON_JOINER) {
            binary += '0';
        }
        // Separators (CONFIG.ZERO_WIDTH_JOINER) are not converted - they just help with byte boundaries
    }

    return binary;
}

/**
 * Convert binary string to zero-width characters
 * @param {string} binary - Binary string (e.g., "01000001")
 * @returns {string} Zero-width encoded sequence with separators
 */
function binaryToZeroWidth(binary) {
    if (!binary) return '';

    let result = '';

    // Split binary into 8-bit chunks
    const bytes = binary.match(/.{1,8}/g) || [];

    for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];

        for (let j = 0; j < byte.length; j++) {
            if (byte[j] === '1') {
                result += CONFIG.ZERO_WIDTH_SPACE;
            } else if (byte[j] === '0') {
                result += CONFIG.ZERO_WIDTH_NON_JOINER;
            }
        }

        // Add separator between characters
        if (i < bytes.length - 1) {
            result += CONFIG.ZERO_WIDTH_JOINER;
        }
    }

    return result;
}

/**
 * Visualize zero-width characters with readable markers
 * @param {string} zeroWidthSeq - Zero-width character sequence
 * @returns {string} Visualization string with markers
 */
function visualizeZeroWidth(zeroWidthSeq) {
    if (!zeroWidthSeq) return '';

    let visual = '';

    for (let i = 0; i < zeroWidthSeq.length; i++) {
        const char = zeroWidthSeq[i];

        if (char === CONFIG.ZERO_WIDTH_SPACE) {
            visual += CONFIG.MARKER_1;
        } else if (char === CONFIG.ZERO_WIDTH_NON_JOINER) {
            visual += CONFIG.MARKER_0;
        } else if (char === CONFIG.ZERO_WIDTH_JOINER) {
            visual += CONFIG.MARKER_SEPARATOR;
        }
    }

    return visual;
}

/**
 * Calculate byte size of text
 * @param {string} text - Input text
 * @returns {number} Byte size
 */
function getByteSize(text) {
    return new Blob([text]).size;
}

/**
 * Get visible character count
 * @param {string} text - Input text
 * @returns {number} Character count
 */
function getVisibleCount(text) {
    return text.length;
}

/**
 * Check if text contains suspicious zero-width characters
 * @param {string} text - Input text
 * @returns {boolean} True if suspicious ratio detected
 */
function hasHiddenPayload(text) {
    const visibleCount = getVisibleCount(text);
    const byteSize = getByteSize(text);

    if (visibleCount === 0) return false;

    const ratio = byteSize / visibleCount;
    return ratio > CONFIG.BYTE_RATIO_THRESHOLD;
}

/**
 * Main encoding function
 * Converts secret message to zero-width and injects into cover text
 * @param {string} coverText - Visible text
 * @param {string} secretMessage - Secret message to hide
 * @returns {object} Encoded result and metadata
 */
function encodeMessage(coverText, secretMessage) {
    if (!coverText || !secretMessage) {
        return {
            success: false,
            error: 'Both cover text and secret message are required',
            encoded: '',
            metadata: { visibleChars: 0, totalBytes: 0, hasHidden: false }
        };
    }

    try {
        // Convert secret message to binary
        const binary = textToBinary(secretMessage);

        // Convert binary to zero-width characters
        const zeroWidth = binaryToZeroWidth(binary);

        // Inject at the end of cover text
        const encoded = coverText + zeroWidth;

        return {
            success: true,
            encoded: encoded,
            metadata: {
                visibleChars: getVisibleCount(encoded),
                totalBytes: getByteSize(encoded),
                hasHidden: hasHiddenPayload(encoded),
                secretLength: secretMessage.length,
                binaryLength: binary.length
            }
        };
    } catch (error) {
        console.error('Error in encodeMessage:', error);
        return {
            success: false,
            error: 'Encoding failed: ' + error.message,
            encoded: '',
            metadata: { visibleCount: 0, totalBytes: 0, hasHidden: false }
        };
    }
}

/**
 * Main decoding function
 * Extracts and decodes hidden zero-width characters
 * @param {string} text - Text potentially containing hidden data
 * @returns {object} Decoded result and metadata
 */
function decodeMessage(text) {
    if (!text) {
        return {
            success: false,
            error: 'No text provided',
            decoded: '',
            zeroWidthSeq: '',
            metadata: { visibleChars: 0, totalBytes: 0, hasHidden: false }
        };
    }

    try {
        // Extract zero-width characters
        const zeroWidth = extractZeroWidth(text);

        if (!zeroWidth) {
            return {
                success: false,
                error: 'No hidden data found',
                decoded: '',
                zeroWidthSeq: '',
                metadata: {
                    visibleChars: getVisibleCount(text),
                    totalBytes: getByteSize(text),
                    hasHidden: false
                }
            };
        }

        // Convert zero-width to binary
        const binary = zeroWidthToBinary(zeroWidth);

        // Convert binary to text
        const decoded = binaryToText(binary);

        return {
            success: true,
            decoded: decoded,
            zeroWidthSeq: zeroWidth,
            metadata: {
                visibleChars: getVisibleCount(text),
                totalBytes: getByteSize(text),
                hasHidden: hasHiddenPayload(text),
                binaryLength: binary.length,
                zeroWidthLength: zeroWidth.length
            }
        };
    } catch (error) {
        console.error('Error in decodeMessage:', error);
        return {
            success: false,
            error: 'Decoding failed: ' + error.message,
            decoded: '',
            zeroWidthSeq: '',
            metadata: { visibleChars: 0, totalBytes: 0, hasHidden: false }
        };
    }
}

// ============================================
// UI INTERACTION FUNCTIONS
// ============================================

/**
 * Show toast notification
 * @param {string} message - Notification message
 * @param {number} duration - Display duration in ms
 */
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @param {string} buttonId - ID of button to provide feedback
 */
function copyToClipboard(text, buttonId) {
    if (!text) {
        showToast('Nothing to copy');
        return;
    }

    // Use modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard! ✓');

            // Visual feedback on button
            const button = document.getElementById(buttonId);
            if (button) {
                const originalText = button.textContent;
                button.textContent = '✓ Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }
        }).catch(err => {
            console.error('Copy failed:', err);
            showToast('Copy failed. Please try manually.');
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showToast('Copied to clipboard! ✓');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showToast('Copy failed. Please try manually.');
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

/**
 * Update byte information display
 * @param {string} text - Text to analyze
 * @param {string} prefix - ID prefix for elements (e.g., 'encode' or 'decode')
 */
function updateByteInfo(text, prefix) {
    const visibleCount = getVisibleCount(text);
    const byteSize = getByteSize(text);
    const hasHidden = hasHiddenPayload(text);

    // Update displays
    const visibleEl = document.getElementById(`${prefix}VisibleBytes`);
    const totalEl = document.getElementById(`${prefix}TotalBytes`);
    const warningEl = document.getElementById(`${prefix}Warning`);

    if (visibleEl) visibleEl.textContent = visibleCount;
    if (totalEl) totalEl.textContent = byteSize;

    // Show/hide warning
    if (warningEl) {
        if (hasHidden) {
            warningEl.textContent = '⚠️ Potential hidden payload detected';
            warningEl.classList.remove('hidden');
        } else {
            warningEl.classList.add('hidden');
        }
    }
}

/**
 * Handle encode button click
 */
function handleEncode() {
    const coverText = document.getElementById('coverText').value;
    const secretMessage = document.getElementById('secretMessage').value;

    const result = encodeMessage(coverText, secretMessage);

    if (result.success) {
        const outputElement = document.getElementById('encodedOutput');

        // Display appropriate output based on visualization setting
        if (state.visualize) {
            // Show visualization of zero-width characters
            const zeroWidth = extractZeroWidth(result.encoded.slice(coverText.length));
            const visualization = visualizeZeroWidth(zeroWidth);
            outputElement.value = result.encoded + '\n\n[Visualization: ' + visualization + ']';
        } else {
            outputElement.value = result.encoded;
        }

        // Update byte info
        updateByteInfo(result.encoded, 'encode');

        showToast('Message encoded successfully! ✓');
    } else {
        showToast('Error: ' + result.error);
    }
}

/**
 * Handle decode button click
 */
function handleDecode() {
    const encryptedText = document.getElementById('encryptedText').value;

    const result = decodeMessage(encryptedText);

    if (result.success) {
        document.getElementById('decodedOutput').value = result.decoded;

        // Show visualization if enabled
        if (state.visualize) {
            const visualization = visualizeZeroWidth(result.zeroWidthSeq);
            document.getElementById('rawZeroWidth').value = visualization;
        } else {
            document.getElementById('rawZeroWidth').value = '';
        }

        // Update byte info
        updateByteInfo(encryptedText, 'decode');

        showToast('Message decoded successfully! ✓');
    } else {
        // Still update byte info even if no hidden data found
        updateByteInfo(encryptedText, 'decode');

        if (result.error === 'No hidden data found') {
            showToast('ℹ️ No hidden data detected');
        } else {
            showToast('Error: ' + result.error);
        }
    }
}

/**
 * Handle visualization toggle
 */
function handleVisualizeToggle(checked) {
    state.visualize = checked;

    // Update encode tab if it has content
    const encodedOutput = document.getElementById('encodedOutput');
    if (encodedOutput.value) {
        const coverText = document.getElementById('coverText').value;
        const encoded = encodedOutput.value;

        if (state.visualize) {
            const zeroWidth = extractZeroWidth(encoded.slice(coverText.length));
            const visualization = visualizeZeroWidth(zeroWidth);
            encodedOutput.value = encoded + '\n\n[Visualization: ' + visualization + ']';
        } else {
            // Remove visualization
            const cleanOutput = encoded.split('\n\n[Visualization:')[0];
            encodedOutput.value = cleanOutput;
        }
    }

    // Update decode tab if it has content
    const decodedOutput = document.getElementById('decodedOutput');
    if (decodedOutput.value) {
        handleDecode();
    }
}

/**
 * Initialize dark mode
 */
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');

    // Set initial state based on saved preference or system preference
    if (state.darkMode) {
        document.body.classList.add('dark-mode');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        state.darkMode = true;
    }

    themeToggle.addEventListener('click', () => {
        state.darkMode = !state.darkMode;
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', state.darkMode);
    });
}

/**
 * Initialize tab switching
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Encode functionality
    document.getElementById('encodeBtn').addEventListener('click', handleEncode);
    document.getElementById('copyEncoded').addEventListener('click', () => {
        copyToClipboard(document.getElementById('encodedOutput').value, 'copyEncoded');
    });

    // Decode functionality
    document.getElementById('decodeBtn').addEventListener('click', handleDecode);
    document.getElementById('copyDecoded').addEventListener('click', () => {
        copyToClipboard(document.getElementById('decodedOutput').value, 'copyDecoded');
    });
    document.getElementById('copyRaw').addEventListener('click', () => {
        copyToClipboard(document.getElementById('rawZeroWidth').value, 'copyRaw');
    });

    // Visualization toggle
    document.getElementById('visualizeToggle').addEventListener('change', (e) => {
        handleVisualizeToggle(e.target.checked);
    });

    // Real-time byte info updates
    document.getElementById('encryptedText').addEventListener('input', (e) => {
        updateByteInfo(e.target.value, 'decode');
    });

    document.getElementById('encodedOutput').addEventListener('input', (e) => {
        updateByteInfo(e.target.value, 'encode');
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[INIT] Initializing Zero Width Steganography Tool');

    try {
        initDarkMode();
        initTabs();
        initEventListeners();

        console.log('[INIT] Initialization complete');
    } catch (error) {
        console.error('[ERROR] Initialization failed:', error);
        showToast('Error during initialization. Please refresh the page.');
    }
});

// ============================================
// DEBUG HELPERS (Remove in production)
// ============================================

/**
 * Debug helper to test encoding/decoding in console
 * Usage: window.debugTest()
 */
window.debugTest = () => {
    console.log('[DEBUG] Starting test...');

    const testMessage = 'SOS';
    const coverText = 'Hello World';

    // Test encoding
    const encoded = encodeMessage(coverText, testMessage);
    console.log('[DEBUG] Encoded:', encoded);

    // Test decoding
    const decoded = decodeMessage(encoded.encoded);
    console.log('[DEBUG] Decoded:', decoded);

    console.log('[DEBUG] Test complete');
};

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('[GLOBAL ERROR]:', event.error);
    showToast('An unexpected error occurred. Please check the console.');
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('[UNHANDLED REJECTION]:', event.reason);
    showToast('An unexpected error occurred. Please check the console.');
});
