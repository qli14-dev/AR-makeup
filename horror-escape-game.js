// ===== GAME STATE =====
const gameState = {
    inventory: [],
    discoveredClues: [],
    puzzlesSolved: [],
    jumpscareCount: 0,
    timeElapsed: 0,
    maxTime: 1800, // 30 minutes in seconds
    uvLightActive: false,
    symbolsFound: [],
    keyPieces: [],
    safeOpened: false,
    ventOpened: false,
    mirrorBroken: false,
    carpetUnrolled: false,
    wardrobeMoved: false,
    metalBoxOpened: false,
    knockAttempts: 0,
    idleTime: 0,
    mirrorLookTime: 0,
    wallTouchCount: 0,
    mattressLookTime: 0,
    secretDiscovered: false,
    allUVMessagesRead: false
};

// ===== GAME DATA =====
const objects = {
    desk: {
        name: "Old Wooden Desk",
        description: "A dusty desk with two drawers. On top sits an old calendar from 1987, a faded photograph, and a broken clock stuck at 3:07.",
        examined: false,
        actions: ["examine", "search drawers"]
    },
    bookshelf: {
        name: "Dusty Bookshelf",
        description: "Weathered books line the shelves. You can make out titles: 'Sleep Disorders,' 'Architecture of the Mind,' 'The Walls Have Eyes.' Some books look recently disturbed.",
        examined: false,
        actions: ["examine", "check books"]
    },
    mirror: {
        name: "Cracked Mirror",
        description: "An old mirror with a crack in the lower corner. Your reflection looks... off. There's something unsettling about it.",
        examined: false,
        actions: ["examine", "look closely", "break"]
    },
    wardrobe: {
        name: "Locked Wardrobe",
        description: "A heavy wooden wardrobe. The door is locked tight. It looks like it could be moved away from the wall with effort.",
        examined: false,
        actions: ["examine", "try to open", "pull from wall"]
    },
    painting: {
        name: "Strange Painting",
        description: "A painting of an endless corridor with doors on both sides. The frame is slightly askew. Something about it draws your attention.",
        examined: false,
        actions: ["examine", "straighten", "look behind"]
    },
    window: {
        name: "Boarded Window",
        description: "The window is completely boarded up with old planks. Through small gaps, you see only darkness. No light from outside.",
        examined: false,
        actions: ["examine", "try to open"]
    },
    mattress: {
        name: "Stained Mattress",
        description: "A filthy mattress on the floor with mysterious stains. One stain looks almost triangular in shape. You could lift it to check underneath.",
        examined: false,
        actions: ["examine", "lift", "check underneath"]
    },
    carpet: {
        name: "Rolled Carpet",
        description: "A carpet that's been rolled up, as if someone was searching for something beneath it. You could unroll it.",
        examined: false,
        actions: ["examine", "unroll"]
    },
    "coffee-table": {
        name: "Wooden Coffee Table",
        description: "An old coffee table with ring stains from glasses. One leg has strange carvings on it. There's a small drawer.",
        examined: false,
        actions: ["examine", "check drawer", "inspect leg"]
    },
    radiator: {
        name: "Cold Radiator",
        description: "A radiator that's cold to the touch, despite the room feeling warm. There's a drain plug at the bottom that could be unscrewed.",
        examined: false,
        actions: ["examine", "check drain plug"]
    },
    vent: {
        name: "Ceiling Vent",
        description: "A vent in the ceiling with visible screws. You'd need a screwdriver to open it. Faint air movement comes from inside.",
        examined: false,
        actions: ["examine", "open"]
    },
    door: {
        name: "Heavy Wooden Door",
        description: "The exit door. Heavy, wooden, with wear marks at eye level. The handle is ice cold. It won't budge no matter how hard you try.",
        examined: false,
        actions: ["examine", "try to open", "knock"]
    }
};

const clues = {
    calendar: "An old calendar from March 1987. Three dates are circled: March 7, October 12, and November 24. The first date (March 7) is circled in red multiple times.",
    photo: "A faded photograph shows a man holding a sign that reads 'When did it start?' He looks desperate and exhausted.",
    clock: "The clock is frozen at 3:07. The hands won't move.",
    journal1: "Journal page: 'The walls remember the order: Circle, Triangle, Square, Star, Moon. I've hidden them throughout the room. Only in sequence will truth be revealed.'",
    journal2: "Journal page with desperate handwriting: 'Shine light where darkness lives. The truth is invisible to normal eyes. My key broke - I hid the THREE pieces where cold iron, hollow words, and broken reflections guard them.'",
    journal3: "Final journal page: 'The door was never locked. IT was WATCHING. Show it you understand. Knock three times, pause, knock twice. This is the pattern of the sane. If you guess wrong, it will know you are like me - and you will stay forever.'",
    uvWall: "UV MESSAGE: 'My key broke. Find the THREE pieces.'",
    uvRadiator: "UV MESSAGE: 'COLD IRON HIDES THE FIRST'",
    uvMattress: "UV MESSAGE: 'WORDS WITHOUT MEANING HOLD THE SECOND'",
    uvMirror: "UV MESSAGE: 'BREAK YOUR REFLECTION TO SEE TRUTH'",
    uvPainting: "UV reveals hidden signature: 'M.H. 1987 - ROOM 7B - THE WALLS ARE THIN'",
    uvWindow: "UV MESSAGE between boards: 'NO EXIT'",
    scratchedMessage: "Scratched into the wall behind the wardrobe: 'IT NEVER LEFT. IT'S IN EVERY ROOM. WARN THEM.'"
};

// ===== SOUND SYSTEM =====
const soundEffects = {
    ambient: null,
    breathing: null,
    audioContext: null
};

function initSound() {
    try {
        soundEffects.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log("Web Audio API not supported");
    }
}

function playSound(type, duration = 1000) {
    if (!soundEffects.audioContext) return;

    const ctx = soundEffects.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch(type) {
        case 'breathing':
            oscillator.frequency.value = 35; // Low frequency hum
            gainNode.gain.value = 0.1;
            break;
        case 'knock':
            oscillator.frequency.value = 100;
            gainNode.gain.value = 0.3;
            oscillator.type = 'square';
            break;
        case 'scratch':
            oscillator.frequency.value = 200;
            gainNode.gain.value = 0.2;
            oscillator.type = 'sawtooth';
            break;
        case 'whisper':
            oscillator.frequency.value = 150;
            gainNode.gain.value = 0.15;
            oscillator.type = 'triangle';
            break;
        case 'scare':
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.5;
            oscillator.type = 'sawtooth';
            break;
    }

    oscillator.start();
    setTimeout(() => {
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.stop(ctx.currentTime + 0.5);
    }, duration);
}

// ===== UI FUNCTIONS =====
function addLog(message, important = false) {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = 'log-entry' + (important ? ' important' : '');
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function updateInventory() {
    const inventoryDiv = document.getElementById('inventory-items');
    inventoryDiv.innerHTML = '';

    gameState.inventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.textContent = item.name;
        itemDiv.addEventListener('click', () => useItem(item));
        inventoryDiv.appendChild(itemDiv);
    });
}

function addToInventory(item) {
    gameState.inventory.push(item);
    updateInventory();
    addLog(`Obtained: ${item.name}`, true);
    playSound('knock', 300);
}

function hasItem(itemName) {
    return gameState.inventory.some(item => item.name === itemName);
}

function useItem(item) {
    addLog(`Selected: ${item.name}`);
    if (item.name === "UV Flashlight") {
        toggleUVLight();
    }
}

function toggleUVLight() {
    gameState.uvLightActive = !gameState.uvLightActive;
    const roomView = document.getElementById('room-view');

    if (gameState.uvLightActive) {
        roomView.classList.add('uv-active');
        addLog("UV light activated. Hidden messages are now visible.", true);
    } else {
        roomView.classList.remove('uv-active');
        addLog("UV light deactivated.");
    }
}

function showModal(title, content, actions = []) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = title;
    modalBody.innerHTML = content;

    // Add action buttons
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'action-button';
        button.textContent = action.text;
        button.addEventListener('click', action.callback);
        if (action.disabled) button.disabled = true;
        modalBody.appendChild(button);
    });

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    gameState.idleTime = 0; // Reset idle timer when closing modal
}

// ===== JUMPSCARE SYSTEM =====
function triggerJumpscare(type) {
    gameState.jumpscareCount++;
    const jumpscareDiv = document.getElementById('jumpscare');
    const imageDiv = jumpscareDiv.querySelector('.jumpscare-image');

    let symbol = '';
    let duration = 2000;
    let afterEffect = '';

    switch(type) {
        case 'watcher':
            symbol = '👁️';
            duration = 2000;
            afterEffect = 'The lights flicker violently. You hear footsteps above the ceiling.';
            playSound('breathing', 2000);
            break;
        case 'mirror':
            symbol = '😱';
            duration = 300;
            afterEffect = 'The mirror cracks further. Whispers fill the room.';
            playSound('scare', 300);
            break;
        case 'knock':
            symbol = '💀';
            duration = 4000;
            afterEffect = 'A book falls from the shelf. The lights dim significantly.';
            playSound('knock', 4000);
            // Dim lights
            document.getElementById('room-view').style.filter = 'brightness(0.5)';
            break;
        case 'crawler':
            symbol = '🖐️';
            duration = 1500;
            afterEffect = 'The mattress shifts position. The breathing intensifies.';
            playSound('scratch', 1500);
            break;
        case 'door':
            symbol = '🚪';
            duration = 3000;
            afterEffect = 'A scratch mark appears on the door. The handle is now freezing cold.';
            playSound('knock', 3000);
            break;
        case 'darkness':
            symbol = '';
            duration = 5000;
            afterEffect = 'When the lights return, they are dimmer. The room feels colder.';
            document.getElementById('room-view').style.backgroundColor = '#000';
            setTimeout(() => {
                document.getElementById('room-view').style.backgroundColor = '';
                document.getElementById('room-view').style.filter = 'brightness(0.6)';
            }, 5000);
            playSound('breathing', 5000);
            break;
    }

    imageDiv.textContent = symbol;
    jumpscareDiv.style.display = 'flex';

    setTimeout(() => {
        jumpscareDiv.style.display = 'none';
        if (afterEffect) {
            addLog(afterEffect, true);
        }
    }, duration);

    // Check for bad ending
    if (gameState.jumpscareCount >= 5) {
        setTimeout(() => triggerEnding('bad'), duration + 1000);
    }
}

// ===== OBJECT INTERACTIONS =====
function examineObject(objectId) {
    const obj = objects[objectId];
    if (!obj) return;

    obj.examined = true;
    gameState.idleTime = 0;

    let content = `<p>${obj.description}</p>`;
    let actions = [];

    // Add UV messages if applicable
    if (gameState.uvLightActive) {
        if (objectId === 'mattress' && !gameState.discoveredClues.includes('uvMattress')) {
            content += `<p class="uv-message">${clues.uvMattress}</p>`;
            gameState.discoveredClues.push('uvMattress');
            addLog("UV message discovered!", true);
        }
        if (objectId === 'mirror' && !gameState.discoveredClues.includes('uvMirror')) {
            content += `<p class="uv-message">${clues.uvMirror}</p>`;
            gameState.discoveredClues.push('uvMirror');
            addLog("UV message discovered!", true);
        }
        if (objectId === 'painting' && !gameState.discoveredClues.includes('uvPainting')) {
            content += `<p class="uv-message">${clues.uvPainting}</p>`;
            gameState.discoveredClues.push('uvPainting');
            gameState.secretDiscovered = true;
            addLog("Secret signature discovered!", true);
        }
        if (objectId === 'window' && !gameState.discoveredClues.includes('uvWindow')) {
            content += `<p class="uv-message">${clues.uvWindow}</p>`;
            gameState.discoveredClues.push('uvWindow');
        }
        if (objectId === 'radiator' && !gameState.discoveredClues.includes('uvRadiator')) {
            content += `<p class="uv-message">${clues.uvRadiator}</p>`;
            gameState.discoveredClues.push('uvRadiator');
            addLog("UV message discovered!", true);
        }
    }

    // Specific object interactions
    switch(objectId) {
        case 'desk':
            actions.push({
                text: 'Examine Calendar',
                callback: () => {
                    closeModal();
                    showModal('Old Calendar', `<p>${clues.calendar}</p><p>Maybe the first circled date is important?</p>`);
                }
            });
            actions.push({
                text: 'Examine Photo',
                callback: () => {
                    closeModal();
                    showModal('Photograph', `<p>${clues.photo}</p>`);
                }
            });
            actions.push({
                text: 'Check Broken Clock',
                callback: () => {
                    closeModal();
                    showModal('Broken Clock', `<p>${clues.clock}</p>`);
                }
            });
            break;

        case 'painting':
            actions.push({
                text: 'Look Behind Painting',
                callback: () => {
                    if (!gameState.safeOpened) {
                        closeModal();
                        showSafe();
                    } else {
                        closeModal();
                        showModal('Safe', '<p>The safe is already open and empty.</p>');
                    }
                }
            });
            break;

        case 'mirror':
            // Mirror scare trigger
            gameState.mirrorLookTime += 1;
            if (gameState.mirrorLookTime >= 3 && !gameState.mirrorBroken) {
                triggerJumpscare('mirror');
            }

            actions.push({
                text: 'Break Mirror',
                callback: () => {
                    if (!gameState.mirrorBroken) {
                        if (hasItem('Screwdriver')) {
                            gameState.mirrorBroken = true;
                            addLog("You shatter the mirror with the screwdriver!", true);
                            playSound('scare', 500);
                            if (!gameState.keyPieces.includes('piece3')) {
                                gameState.keyPieces.push('piece3');
                                addToInventory({ name: 'Key Piece (3/3)', id: 'key-piece-3' });
                                checkKeyCompletion();
                            }
                            closeModal();
                        } else {
                            addLog("You need something heavy or sharp to break it.");
                            closeModal();
                        }
                    } else {
                        addLog("The mirror is already broken.");
                        closeModal();
                    }
                }
            });
            break;

        case 'wardrobe':
            actions.push({
                text: 'Pull from Wall',
                callback: () => {
                    if (!gameState.wardrobeMoved) {
                        gameState.wardrobeMoved = true;
                        gameState.wallTouchCount += 3;
                        addLog("With great effort, you pull the wardrobe away from the wall.", true);
                        playSound('scratch', 2000);
                        setTimeout(() => {
                            showModal('Behind the Wardrobe', `<p>${clues.scratchedMessage}</p><p>The scratches look desperate, carved with fingernails.</p>`);
                            if (gameState.uvLightActive) {
                                addLog("Secret message discovered! This reveals the full truth.", true);
                                gameState.allUVMessagesRead = true;
                            }
                        }, 2000);

                        if (gameState.wallTouchCount >= 3) {
                            setTimeout(() => triggerJumpscare('knock'), 3000);
                        }
                    } else {
                        closeModal();
                        showModal('Behind the Wardrobe', `<p>${clues.scratchedMessage}</p>`);
                    }
                }
            });
            break;

        case 'vent':
            actions.push({
                text: 'Open Vent',
                callback: () => {
                    if (hasItem('Screwdriver')) {
                        if (!gameState.ventOpened) {
                            gameState.ventOpened = true;
                            addLog("You unscrew the vent cover. Something is inside.", true);
                            playSound('scratch', 1000);
                            addToInventory({ name: 'UV Flashlight', id: 'uv-light' });
                            closeModal();
                        } else {
                            addLog("The vent is already open and empty.");
                            closeModal();
                        }
                    } else {
                        addLog("You need a screwdriver to open this.");
                        closeModal();
                    }
                },
                disabled: !hasItem('Screwdriver')
            });
            break;

        case 'mattress':
            actions.push({
                text: 'Lift Mattress',
                callback: () => {
                    gameState.mattressLookTime += 1;
                    if (gameState.mattressLookTime >= 2) {
                        triggerJumpscare('crawler');
                    }
                    addLog("You find nothing under the mattress, just dust and darkness.");
                    closeModal();
                }
            });

            // Check for triangle symbol
            if (!gameState.symbolsFound.includes('Triangle')) {
                actions.push({
                    text: 'Examine Stains',
                    callback: () => {
                        gameState.symbolsFound.push('Triangle');
                        addLog("Triangle symbol found on mattress! (Symbol 2/5)", true);
                        checkSymbolSequence();
                        closeModal();
                    }
                });
            }
            break;

        case 'carpet':
            actions.push({
                text: 'Unroll Carpet',
                callback: () => {
                    if (!gameState.carpetUnrolled) {
                        gameState.carpetUnrolled = true;
                        addLog("You unroll the carpet. A floorboard beneath has a star carved into it!", true);
                        playSound('scratch', 500);
                        if (!gameState.symbolsFound.includes('Star')) {
                            gameState.symbolsFound.push('Star');
                            addLog("Star symbol found! (Symbol 4/5)", true);
                            checkSymbolSequence();
                        }

                        // Also reveal loose floorboard
                        setTimeout(() => {
                            showModal('Loose Floorboard', '<p>One of the floorboards is loose. You could pry it up if you have something to pry with.</p>', [
                                {
                                    text: 'Pry Up Floorboard',
                                    callback: () => {
                                        if (hasItem('Screwdriver')) {
                                            showMetalBox();
                                        } else {
                                            addLog("You need something to pry with.");
                                            closeModal();
                                        }
                                    }
                                }
                            ]);
                        }, 1000);
                    } else {
                        addLog("The carpet is already unrolled.");
                        closeModal();
                    }
                }
            });
            break;

        case 'coffee-table':
            actions.push({
                text: 'Inspect Table Leg',
                callback: () => {
                    if (!gameState.symbolsFound.includes('Circle')) {
                        gameState.symbolsFound.push('Circle');
                        addLog("Circle symbol found carved into the table leg! (Symbol 1/5)", true);
                        checkSymbolSequence();
                    } else {
                        addLog("You already found the circle symbol here.");
                    }
                    closeModal();
                }
            });
            break;

        case 'bookshelf':
            actions.push({
                text: 'Check Books',
                callback: () => {
                    closeModal();
                    showModal('Bookshelf', '<p>Most books are damaged by moisture. One book with a square on its spine catches your attention.</p>', [
                        {
                            text: 'Examine Square Book',
                            callback: () => {
                                if (!gameState.symbolsFound.includes('Square')) {
                                    gameState.symbolsFound.push('Square');
                                    addLog("Square symbol found on book spine! (Symbol 3/5)", true);
                                    checkSymbolSequence();
                                }

                                // Check if it's hollow
                                setTimeout(() => {
                                    showModal('Hollow Book', '<p>The book is hollow! Inside is a piece of metal that looks like part of a key.</p>', [
                                        {
                                            text: 'Take Key Piece',
                                            callback: () => {
                                                if (!gameState.keyPieces.includes('piece2')) {
                                                    gameState.keyPieces.push('piece2');
                                                    addToInventory({ name: 'Key Piece (2/3)', id: 'key-piece-2' });
                                                    checkKeyCompletion();
                                                }
                                                closeModal();
                                            }
                                        }
                                    ]);
                                }, 1000);
                            }
                        }
                    ]);
                }
            });
            break;

        case 'radiator':
            actions.push({
                text: 'Check Drain Plug',
                callback: () => {
                    if (!gameState.keyPieces.includes('piece1')) {
                        addLog("You unscrew the drain plug. Something small is wedged inside!", true);
                        gameState.keyPieces.push('piece1');
                        addToInventory({ name: 'Key Piece (1/3)', id: 'key-piece-1' });
                        checkKeyCompletion();
                    } else {
                        addLog("You already found the key piece here.");
                    }
                    closeModal();
                }
            });
            break;

        case 'door':
            actions.push({
                text: 'Try to Open',
                callback: () => {
                    addLog("The door won't budge. It seems to be sealed shut.");
                    closeModal();
                }
            });
            actions.push({
                text: 'Knock on Door',
                callback: () => {
                    closeModal();
                    showKnockInterface();
                }
            });
            break;
    }

    showModal(obj.name, content, actions);
}

// ===== PUZZLE SYSTEMS =====
function showSafe() {
    showModal('Hidden Safe', '<p>Behind the painting is a safe with a 4-digit combination lock. The numbers are worn, but functional.</p><p>Enter code:</p><input type="text" class="code-input" id="safe-code" maxlength="4" placeholder="####">', [
        {
            text: 'Enter Code',
            callback: () => {
                const code = document.getElementById('safe-code').value;
                if (code === '0307') {
                    gameState.safeOpened = true;
                    gameState.puzzlesSolved.push('safe');
                    addLog("The safe clicks open!", true);
                    playSound('knock', 500);

                    setTimeout(() => {
                        closeModal();
                        showModal('Safe Contents', `<p>Inside you find:</p><ul><li>A screwdriver</li><li>A torn journal page</li><li>An old photograph</li></ul>`, [
                            {
                                text: 'Take Items',
                                callback: () => {
                                    addToInventory({ name: 'Screwdriver', id: 'screwdriver' });
                                    addToInventory({ name: 'Journal Page 1', id: 'journal1' });
                                    closeModal();

                                    setTimeout(() => {
                                        showModal('Journal Page', `<p>${clues.journal1}</p><p>${clues.journal2}</p>`);
                                    }, 500);
                                }
                            }
                        ]);
                    }, 1000);
                } else {
                    addLog("Wrong code. The safe remains locked.");
                    playSound('whisper', 1000);
                    gameState.knockAttempts += 1;

                    if (gameState.knockAttempts >= 2) {
                        closeModal();
                        triggerJumpscare('mirror');
                    }
                }
            }
        }
    ]);
}

function checkSymbolSequence() {
    const correctOrder = ['Circle', 'Triangle', 'Square', 'Star', 'Moon'];

    // Check if all symbols found
    if (gameState.symbolsFound.length === 5) {
        // Check if in correct order
        let correct = true;
        for (let i = 0; i < correctOrder.length; i++) {
            if (gameState.symbolsFound[i] !== correctOrder[i]) {
                correct = false;
                break;
            }
        }

        if (correct) {
            gameState.puzzlesSolved.push('symbols');
            addLog("All symbols found in correct order! The sequence is complete.", true);
            playSound('knock', 1000);
        } else {
            addLog("You found all symbols, but the order is wrong...", true);
            triggerJumpscare('darkness');
            // Reset to try again
            gameState.symbolsFound = [];
        }
    }
}

function checkKeyCompletion() {
    if (gameState.keyPieces.length === 3) {
        addLog("All three key pieces collected! You can now assemble the key.", true);
        gameState.puzzlesSolved.push('key-assembly');
        // Auto-assemble
        setTimeout(() => {
            showModal('Key Assembly', '<p>You carefully fit the three pieces together. They click into place, forming a complete key.</p>', [
                {
                    text: 'Continue',
                    callback: () => {
                        addToInventory({ name: 'Assembled Key', id: 'full-key' });
                        closeModal();
                    }
                }
            ]);
        }, 1000);
    }
}

function showMetalBox() {
    if (hasItem('Assembled Key')) {
        if (!gameState.metalBoxOpened) {
            gameState.metalBoxOpened = true;
            addLog("You unlock the metal box with the assembled key!", true);
            playSound('knock', 800);

            setTimeout(() => {
                showModal('Metal Box Contents', `<p>Inside the box you find:</p><ul><li>A red keycard</li><li>A final journal page</li></ul>`, [
                    {
                        text: 'Take Items',
                        callback: () => {
                            addToInventory({ name: 'Red Keycard', id: 'keycard' });
                            closeModal();

                            setTimeout(() => {
                                showModal('Final Journal Page', `<p>${clues.journal3}</p><p>This is it. The way out.</p>`);
                            }, 500);
                        }
                    }
                ]);
            }, 1000);
        } else {
            addLog("The box is already empty.");
            closeModal();
        }
    } else {
        addLog("The box is locked. You need a key.");
        closeModal();
    }
}

function showKnockInterface() {
    let knockCount = 0;
    let knockPattern = [];
    let knockTimer;

    const updateKnockDisplay = () => {
        const display = knockPattern.map(k => '🔊').join(' ');
        document.getElementById('knock-display').textContent = display || 'Knock on the door...';
    };

    showModal('Knock on Door', '<p>You can knock on the door. Maybe there\'s a pattern?</p><div id="knock-display">Knock on the door...</div>', [
        {
            text: 'KNOCK',
            callback: () => {
                playSound('knock', 200);
                knockPattern.push(Date.now());
                updateKnockDisplay();

                // Reset timer for detecting pauses
                clearTimeout(knockTimer);
                knockTimer = setTimeout(() => {
                    // Check pattern
                    checkKnockPattern(knockPattern);
                }, 2000);
            }
        },
        {
            text: 'Reset',
            callback: () => {
                knockPattern = [];
                updateKnockDisplay();
                clearTimeout(knockTimer);
            }
        }
    ]);
}

function checkKnockPattern(pattern) {
    if (pattern.length < 2) {
        addLog("Nothing happens...");
        return;
    }

    // Check if it's 3 knocks, pause, 2 knocks
    if (pattern.length === 5) {
        // Calculate pauses
        let pauses = [];
        for (let i = 1; i < pattern.length; i++) {
            pauses.push(pattern[i] - pattern[i-1]);
        }

        // Check if there's a significant pause between knock 3 and 4
        const avgShortPause = (pauses[0] + pauses[1] + pauses[3]) / 3;
        const longPause = pauses[2];

        if (longPause > avgShortPause * 3 && longPause > 1000) {
            // Correct pattern!
            gameState.puzzlesSolved.push('door-knock');
            closeModal();
            addLog("The door clicks! It's unlocked!", true);
            playSound('knock', 1000);

            setTimeout(() => {
                // Check for secret ending
                if (gameState.secretDiscovered && gameState.wardrobeMoved && gameState.allUVMessagesRead) {
                    triggerEnding('secret');
                } else {
                    triggerEnding('good');
                }
            }, 2000);
            return;
        }
    }

    // Wrong pattern
    addLog("You knock... but nothing happens. Maybe the pattern is wrong?");
    gameState.knockAttempts += 1;

    if (gameState.knockAttempts >= 3) {
        closeModal();
        triggerJumpscare('door');
    }
}

// Check for moon symbol on ceiling
function checkCeiling() {
    if (!gameState.symbolsFound.includes('Moon')) {
        addLog("Looking up at the ceiling, you notice a faint moon shape in the water stains near the light bulb!", true);
        gameState.symbolsFound.push('Moon');
        addLog("Moon symbol found! (Symbol 5/5)", true);
        checkSymbolSequence();
    } else {
        addLog("You see the moon-shaped water stain on the ceiling.");
    }
}

// ===== ENDINGS =====
function triggerEnding(type) {
    const endingScreen = document.getElementById('ending-screen');
    const endingTitle = document.getElementById('ending-title');
    const endingText = document.getElementById('ending-text');

    document.getElementById('main-view').style.display = 'none';

    switch(type) {
        case 'good':
            endingScreen.className = 'good';
            endingTitle.textContent = 'THE ESCAPE';
            endingText.innerHTML = `
                <p>The door swings open slowly, revealing a dimly lit corridor beyond.</p>
                <p>The breathing from the walls stops abruptly. Complete silence.</p>
                <p>You step out carefully. Behind you, the door slams shut with tremendous force.</p>
                <p>The corridor looks normal. Old, but normal. You can see an exit sign at the far end.</p>
                <p style="margin-top: 30px; color: #6b9eff;">You understood what Marcus tried to teach you.</p>
                <p style="color: #6b9eff;">Some doors open only for those who listen.</p>
                <p style="margin-top: 20px; color: #888;">But you can still hear the breathing in your dreams.</p>
                <p style="margin-top: 40px; font-size: 0.9em;">Time: ${formatTime(gameState.timeElapsed)}</p>
                <p style="font-size: 0.9em;">Jumpscares triggered: ${gameState.jumpscareCount}</p>
            `;
            break;

        case 'bad':
            endingScreen.className = 'bad';
            endingTitle.textContent = 'THE TENANT';
            endingText.innerHTML = `
                <p>The lights die completely. Absolute darkness.</p>
                <p>The breathing becomes rapid, close. So close you can feel it on your neck.</p>
                <p>The walls seem to close in. You hear the creaking of wood, but it sounds organic, alive.</p>
                <p>Your vision fades. Not to black—to nothing.</p>
                <p style="margin-top: 30px; color: #ff6b6b;">The room has claimed another tenant.</p>
                <p style="color: #ff6b6b;">Your nameplate is already on the wall outside.</p>
                <p style="color: #ff6b6b;">You've always lived here.</p>
                <p style="margin-top: 20px; color: #8b0000;">You'll never leave.</p>
                <p style="margin-top: 40px; font-size: 0.9em;">Time survived: ${formatTime(gameState.timeElapsed)}</p>
            `;
            playSound('breathing', 5000);
            break;

        case 'secret':
            endingScreen.className = 'secret';
            endingTitle.textContent = 'THE TRUTH';
            endingText.innerHTML = `
                <p>The door opens. You escape into the corridor.</p>
                <p>But as you walk toward the exit, you hear it.</p>
                <p>Breathing. From every door. Every single door in this endless corridor.</p>
                <p>Each door has a nameplate with dates spanning decades. 1987. 1992. 2001. 2015. Last month.</p>
                <p style="margin-top: 30px; color: #9d4edd;">Room 7B was never special.</p>
                <p style="color: #9d4edd;">The entity isn't in one room—it's in the BUILDING.</p>
                <p style="color: #9d4edd;">Marcus knew. The others knew. Now you know.</p>
                <p style="margin-top: 20px; color: #c77dff;">But who would believe you?</p>
                <p style="margin-top: 30px; font-size: 0.95em;">You stand outside the building, looking up. Every window is dark except one on the seventh floor.</p>
                <p style="font-size: 0.95em;">A silhouette stands there, watching you.</p>
                <p style="margin-top: 20px; font-size: 0.95em;">It will wait for you to tell someone.</p>
                <p style="font-size: 0.95em;">And when they come to investigate...</p>
                <p style="margin-top: 40px; font-size: 0.9em;">Time: ${formatTime(gameState.timeElapsed)}</p>
                <p style="font-size: 0.9em;">Secret ending unlocked!</p>
            `;
            break;
    }

    endingScreen.style.display = 'flex';
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== GAME LOOP =====
let gameInterval;

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('main-view').style.display = 'block';

    initSound();

    addLog("You slowly regain consciousness...");
    addLog("The room is dim, lit only by a flickering bulb overhead.");
    addLog("You need to find a way out.");

    // Start game loop
    gameInterval = setInterval(() => {
        gameState.timeElapsed++;
        gameState.idleTime++;

        // Update timer display
        const timeRemaining = gameState.maxTime - gameState.timeElapsed;
        document.getElementById('timer').textContent = formatTime(timeRemaining);

        // Idle timeout jumpscare
        if (gameState.idleTime >= 15 && gameState.jumpscareCount < 5) {
            triggerJumpscare('watcher');
            gameState.idleTime = 0;
        }

        // Time limit bad ending
        if (timeRemaining <= 0) {
            clearInterval(gameInterval);
            triggerEnding('bad');
        }

        // Timer color changes
        if (timeRemaining <= 300) { // 5 minutes
            document.getElementById('timer').style.color = '#ff0000';
        } else if (timeRemaining <= 600) { // 10 minutes
            document.getElementById('timer').style.color = '#ff9900';
        }
    }, 1000);

    // Ambient sounds
    setInterval(() => {
        if (Math.random() < 0.3) {
            playSound('breathing', 2000);
        }
    }, 10000);
}

// ===== EVENT LISTENERS =====
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('close-modal').addEventListener('click', closeModal);

// Object click handlers
document.querySelectorAll('.object').forEach(obj => {
    obj.addEventListener('click', (e) => {
        const objectId = e.target.dataset.object;
        examineObject(objectId);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }

    // Secret: Look up at ceiling with 'U' key
    if (e.key === 'u' || e.key === 'U') {
        if (document.getElementById('main-view').style.display !== 'none') {
            checkCeiling();
        }
    }
});

// Click anywhere on room to reset idle timer
document.getElementById('room-view').addEventListener('click', () => {
    gameState.idleTime = 0;
});
