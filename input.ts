//% weight=100 color=#0fbc11 icon=""
namespace Shortbuttons {
    const TIMEOUT_BETWEEN_KEYS = 2500;
    const TIMEOUT_TOTAL = 20000;

    let currentBuffer: Button[] = [];
    let lastPressTime = 0;
    let startTime = 0;
    let isListening = false;
    let registeredShortcuts: { sequence: Button[], handler: () => void }[] = [];

    function initListeners() {
        if (isListening) return;
        isListening = true;

        input.onButtonPressed(Button.A, () => processInput(Button.A));
        input.onButtonPressed(Button.B, () => processInput(Button.B));
        input.onButtonPressed(Button.AB, () => processInput(Button.AB));
    }
    function processInput(btn: Button) {
        let now = input.runningTime();
        if (now - lastPressTime > TIMEOUT_BETWEEN_KEYS || now - startTime > TIMEOUT_TOTAL) {
            resetBuffer();
        }

        if (currentBuffer.length === 0) {
            startTime = now;
        }
        currentBuffer.push(btn);
        lastPressTime = now;
        checkMatches();
    }
    function checkMatches() {
        for (let i = 0; i < registeredShortcuts.length; i++) {
            let shortcut = registeredShortcuts[i];
            if (currentBuffer.length === shortcut.sequence.length) {
                let match = true;
                for (let j = 0; j < shortcut.sequence.length; j++) {
                    if (currentBuffer[j] !== shortcut.sequence[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    resetBuffer();
                    shortcut.handler();
                    return; // Sai do loop após encontrar
                }
            }
        }
    }
    function resetBuffer() {
        currentBuffer = [];
        lastPressTime = 0;
        startTime = 0;
    }
    
    //% blockId="on_shortcut_pressed" block="on shortcut pressed %buttons"
    //% weight=100
    export function onShortcutPressed(buttons: Button[], body: () => void): void {
        initListeners();
        registeredShortcuts.push({
            sequence: buttons,
            handler: body
        });
    }
}