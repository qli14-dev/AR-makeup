# HORROR ESCAPE ROOM GAME DESIGN
## "THE FORGOTTEN PATIENT"

---

## 1. NARRATIVE BACKSTORY

**The Story:**
You wake up in a dimly lit therapy room of an abandoned psychiatric facility. The year is unclear, but everything feels stuck in the 1970s. You have no memory of how you got here.

Through scattered documents and audio recordings, you'll discover this was "Treatment Room 7" - a controversial isolation chamber used by Dr. Heinrich Volker for experimental therapy on patients with "persistent delusions." The room was sealed after Patient #347 disappeared during treatment in 1978. The facility was shut down, but the room... remains.

You are not the first person to wake up here. Others have tried to escape. Some succeeded. Others... didn't.

The entity haunting the room is Patient #347, trapped between reality and delusion, reliving the trauma over and over. If you don't escape before "treatment time" ends (60 minutes), you'll become part of the room forever.

**The Twist:** You eventually discover you ARE Patient #347, and this is your mind's desperate attempt to break free from the trauma loop. Escaping means accepting the truth.

---

## 2. ROOM LAYOUT & ATMOSPHERE

### Room Dimensions & Structure
```
┌─────────────────────────────────────┐
│                                     │
│  [Bookshelf]           [Window]     │
│                        (Barred)     │
│                                     │
│                     [Clock]         │
│  [Desk]          [Therapy Chair]   │
│  [Drawer]                           │
│                                     │
│              [Coffee Table]         │
│  [Safe Box]     [Rug]              │
│  (Hidden)                           │
│                                     │
│            [Bed]                    │
│  [Painting]    (Metal Frame)        │
│                                     │
│                                     │
│  [Mirror]                [Door]     │
│  (Cracked)               (LOCKED)   │
│                                     │
└─────────────────────────────────────┘

Additional Elements:
- Radiator (old, rusty) in corner
- Ventilation grate near ceiling
- Flickering fluorescent light overhead
- Small closet (locked initially)
- Medicine cabinet on wall
```

### Atmosphere Details
- **Lighting:** Single overhead fluorescent light flickers every 30-45 seconds
- **Ambient Sounds:**
  - Electrical buzzing from light
  - Distant dripping water in walls
  - Occasional footsteps in corridor outside
  - Wind whistling through window cracks
  - Soft radio static when player is near certain objects
  - Clock ticking (but the clock is stopped)
- **Visual Details:**
  - Peeling wallpaper with water damage
  - Faint scratch marks on door (finger-shaped)
  - Dark stains on carpet (ambiguous - could be anything)
  - Dust particles visible in flashlight beam
  - Condensation on window that occasionally spells words
  - Shadows that don't quite match objects

---

## 3. INTERACTIVE OBJECTS LIST

### ESSENTIAL OBJECTS (Required for progression)

| Object | Location | Purpose | Contains/Reveals |
|--------|----------|---------|------------------|
| **Therapy Desk** | Left wall | Has 3 drawers | Top: Flashlight (dead batteries), Middle: Patient files, Bottom: LOCKED (needs small key) |
| **Bookshelf** | Left wall | 15 books | 4 books have numbers underlined, 1 book has a small key taped inside back cover |
| **Painting** | Left of bed | Removable frame | Behind: 4-digit code scratched into wall (6-2-7-9) |
| **Bed** | Center-right | Can look under | Under: Old journal with symbol patterns |
| **Rug** | Center floor | Can be lifted | Underneath: carved symbols matching journal |
| **Mirror** | Bottom left | Cracked, can inspect | Shows reflections wrongly; close inspection reveals code hint written in corner |
| **Clock** | Top wall | Stopped at 3:47 | Hands can be moved; correct position unlocks hidden compartment |
| **Window** | Top right | Barred, frosted | Condensation forms numbers periodically (3-4-7) |
| **Closet Door** | (in room) | Locked with 4-digit code | Contains UV flashlight, tape recorder, doctor's note |
| **Safe Box** | Behind painting, lower wall | Symbol-pattern lock (5 symbols) | Contains: Rusty door key (FINAL KEY) |
| **Medicine Cabinet** | Near door | Has mirror door | Contains: Batteries, note about "Patient 347", sedatives (red herring) |
| **Coffee Table** | Center | Drawer underneath | Contains: Matches, candle, photograph (dated 3/47/1978 - wrong format, hint) |
| **Therapy Chair** | Center-right | Leather, restraints visible | Under seat cushion: folded paper with riddle |
| **Radiator** | Corner | Old, rusty | One section unscrews to reveal small key inside |
| **Ventilation Grate** | Upper wall | Screwed shut | Can be opened with screwdriver (from desk bottom drawer); contains audio tape |

### RED HERRINGS & ATMOSPHERIC OBJECTS

| Object | Purpose |
|--------|---------|
| **Pill Bottles** | Various locations, create unease, no gameplay use |
| **Newspaper Clippings** | On walls, provide creepy backstory but not essential |
| **Fake Portrait** | Doctor's portrait with "watching eyes" effect |
| **Phone (disconnected)** | On desk, picking up receiver triggers whispers |
| **Water Glass** | On table, mysteriously refills if player looks away |
| **Pencils/Papers** | Scattered, player can "take notes" (UI feature) |
| **Bible** | On bookshelf, has passages underlined (thematic, not puzzle) |

### JUMPSCARE TRIGGER OBJECTS

| Object | Trigger |
|--------|---------|
| **Mirror** | Stare for >10 seconds |
| **Window** | Approach after 3 wrong code attempts |
| **Closet** | Try to force open before solving |
| **Phone** | Pick up after first jumpscare |
| **Bed** | Look under 3+ times |

---

## 4. PUZZLE DESIGN & FLOW

### PUZZLE FLOWCHART

```
START: Player wakes up on bed
    ↓
[PHASE 1: EXPLORATION]
→ Discover room is locked
→ Find FLASHLIGHT (dead) in desk
→ Explore room, collect CLUES
    ↓
[PHASE 2: FIND BATTERIES]
→ Notice Medicine Cabinet
→ Need to open it somehow
→ Discover RADIATOR section unscrews
→ Find SMALL KEY in radiator
→ Open Medicine Cabinet
→ Get BATTERIES
→ Insert batteries into flashlight
    ↓
[PHASE 3: CLOSET CODE PUZZLE]
→ Use flashlight to inspect dark corners
→ Find numbers hidden around room:
    • Window condensation: 3-4-7
    • Photo date: 3/47/1978 → 3-4-7
    • Clock stopped at: 3:47
→ Enter 3-4-7-8 in CLOSET lock
→ Get UV FLASHLIGHT, TAPE RECORDER, DOCTOR'S NOTE
    ↓
[PHASE 4: SYMBOL PUZZLE]
→ Read doctor's note: "The patient sees patterns everywhere"
→ Use UV flashlight on walls, books, furniture
→ Discover glowing symbols on:
    • Under rug (carved)
    • In journal under bed
    • On painting frame edge
→ Lift rug, find 5 symbols in sequence
→ Match symbols to safe box lock
→ Open SAFE BOX
    ↓
[PHASE 5: CLOCK MANIPULATION]
→ Safe box is EMPTY at first (!!!!)
→ Realize: "Time isn't right"
→ Find clue: "When treatment began: 10:15"
→ Move clock hands to 10:15
→ Hear mechanical CLICK
→ Check safe box again → RUSTY KEY appears
    ↓
[PHASE 6: FINAL ESCAPE]
→ Use RUSTY KEY on door
→ Door opens → ENDING SEQUENCE
```

---

## 5. DETAILED PUZZLE DESCRIPTIONS

### PUZZLE 1: "Power Up" (Battery Quest)
**Objective:** Get the flashlight working

**Steps:**
1. **Find Flashlight:** In desk top drawer (opens freely)
2. **Problem:** Flashlight has no batteries
3. **Clue Discovery:** Notice medicine cabinet above sink area
4. **Obstacle:** Cabinet is stuck/locked
5. **Investigation:** Inspect radiator near cabinet
6. **Solution:** Notice one section of radiator is loose
7. **Action:** Unscrew radiator section (click interaction)
8. **Reward:** Find SMALL KEY inside
9. **Use Key:** Open medicine cabinet
10. **Reward:** Get BATTERIES + read note about Patient 347

**Clues:**
- Flashlight is obviously dead when first picked up
- Medicine cabinet rattles when clicked (something inside)
- Radiator has one darker section (visual hint)

**What Unlocks:** Functional flashlight + ability to see in dark areas + Patient 347 lore

**Wrong Actions:**
- Trying to force cabinet → Jumpscare #1 (banging from inside)

---

### PUZZLE 2: "The Forgotten Number" (Closet Code)
**Objective:** Open the locked closet with 4-digit code

**Clue Locations:**
1. **Window condensation:** Numbers fade in/out: "3-4-7"
2. **Clock on wall:** Stopped at 3:47
3. **Photograph on coffee table:** Date stamp reads "3/47/1978" (month/day/year - but 47th month doesn't exist = hint it's 3-4-7)
4. **Mirror corner:** (requires flashlight) Scratched: "Patient # = final digit"
5. **Medicine cabinet note:** "Patient 347 treatment date"

**Solution Logic:**
- Three separate sources point to 3-4-7
- "Patient number" mentioned multiple times
- Patient #347 → 4th digit is 8 (from year 1978) OR just 7 from 347
- **CORRECT CODE: 3-4-7-8** (from year) or **3-4-7-7** (from patient number)
- Let's use: **3-4-7-8**

**What Unlocks:**
- Closet opens
- Contains: UV FLASHLIGHT, TAPE RECORDER (with tape), DOCTOR'S NOTE

**Wrong Codes:**
- 1st wrong attempt: Buzzer sound, red light
- 2nd wrong: Lights flicker
- 3rd wrong: Jumpscare #2 (shadow passes behind player in reflection)
- 4th wrong: Door jiggles violently for 3 seconds

---

### PUZZLE 3: "Hidden Symbols" (UV Light Revelation)
**Objective:** Discover secret symbols using UV light

**Steps:**
1. **Obtain UV flashlight** from closet (Puzzle 2)
2. **Read doctor's note:** "Patient 347 claimed to see symbols invisible to others. Perhaps they were right."
3. **Use UV light** around room
4. **Discoveries:**
   - Walls have UV-glowing symbols (5 different symbols)
   - Bookshelf: Symbols on spine edges
   - Under rug: Hand-carved symbols (visible without UV, but glowing)
   - Painting frame: Tiny symbols along edge
   - Journal under bed: Full page of symbol explanations

**Symbol Key (from journal):**
```
△ = Beginning
◐ = Darkness
☿ = Cure
⚷ = Prison
⌛ = End
```

**Correct Sequence:** (visible under rug when lifted)
```
△ → ◐ → ⚷ → ☿ → ⌛
(Beginning → Darkness → Prison → Cure → End)
```

**What Unlocks:**
- Safe box behind painting opens
- Reveals: EMPTY SPACE (wait, what?)
- This triggers the realization for Puzzle 4

**Wrong Patterns:**
- 2 wrong attempts: Symbols glow red
- 3 wrong attempts: Jumpscare #3 (symbols fly at screen)

---

### PUZZLE 4: "Time Paradox" (Clock Manipulation)
**Objective:** Realize the safe box opens at the "right time"

**Steps:**
1. **Problem:** Safe box is empty after opening (players will be confused)
2. **Clue Discovery:**
   - Play TAPE RECORDER (from closet)
   - Tape plays: Dr. Volker's voice: "Treatment begins at 10:15 sharp. That's when the medicine takes effect."
   - Another note found: "Time stopped when they left me here"
3. **Investigation:** Look at clock (still showing 3:47)
4. **Realization:** Clock hands can be moved!
5. **Solution:** Click and drag clock hands to 10:15
6. **Effect:**
   - Mechanical whirring sound from walls
   - Lights flicker
   - Safe box clicks
7. **Check Safe Box:** Now contains the RUSTY DOOR KEY

**Clues:**
- Clock is interactable (cursor changes)
- Tape recording mentions specific time
- Doctor's note: "Time is the final barrier"

**What Unlocks:** RUSTY KEY (final key to escape)

**Wrong Times:**
- Setting to 12:00 (midnight): Room goes dark for 5 seconds
- Setting to 6:66 (if possible): Jumpscare #4

---

### PUZZLE 5: "The Final Door" (Escape)
**Objective:** Use the Rusty Key to escape

**Steps:**
1. Approach the main door with RUSTY KEY
2. Insert key into lock
3. Turn key slowly (interaction)
4. **TWIST:** Door opens, but instead of freedom, player sees a mirror showing themselves lying on the therapy chair
5. **Choice appears:**
   - [Accept the Truth] = Good Ending
   - [Refuse to Believe] = Bad Ending

**Endings:**
- **Good Ending:** Player accepts they are Patient 347. Screen fades to white. Final shot: Empty room, door open, freedom implied.
- **Bad Ending:** Player refuses. Door slams shut. Room resets. "Try again, Patient 347" appears. Loop continues.

---

## 6. JUMPSCARE DESIGN

### JUMPSCARE #1: "The Cabinet Bang"
**Trigger:** Try to force open medicine cabinet before finding the small key (3+ click attempts)

**Sequence:**
1. Player clicks cabinet repeatedly
2. 3rd click: No response for 2 seconds (silence)
3. Sudden LOUD BANG from inside cabinet
4. Cabinet door shakes violently
5. Quick flash of bloody handprint on inside of glass
6. Distorted scream (2 seconds)
7. Everything stops
8. Cabinet returns to normal

**Aftermath:** Player must step back. Cabinet won't open until proper key is used.

**Duration:** 4 seconds total

---

### JUMPSCARE #2: "The Shadow Figure"
**Trigger:** Enter wrong closet code 3 times

**Sequence:**
1. 3rd wrong code entered
2. Keypad flashes red
3. Lights flicker rapidly (3 seconds)
4. During flicker, a tall shadow figure appears in player's peripheral vision (right side)
5. Player can turn to look
6. If they turn: Figure is closer, features are blurred, hollow eyes
7. Sudden LOUD STATIC noise
8. Screen distorts (VHS effect)
9. Figure rushes at camera
10. Cut to black (1 second)
11. Player is back in center of room, facing closet

**Aftermath:** Heartbeat sound effect continues for 20 seconds. Can try code again.

**Duration:** 8 seconds total

---

### JUMPSCARE #3: "Symbol Attack"
**Trigger:** Enter wrong symbol pattern 3 times on safe box

**Sequence:**
1. 3rd wrong pattern entered
2. Symbols on safe glow bright red
3. All UV symbols in room start glowing through walls
4. Symbols begin floating off surfaces
5. They spin around player (2 seconds)
6. Symbols rush toward screen all at once
7. Loud whisper: "YOU DON'T UNDERSTAND"
8. Screen filled with symbols
9. Flash to white
10. Back to normal

**Aftermath:** Safe box resets. Player can try again.

**Duration:** 6 seconds total

---

### JUMPSCARE #4: "The Mirror Reflection"
**Trigger:** Stare at cracked mirror for more than 10 continuous seconds

**Sequence:**
1. Player looks at mirror
2. At first, normal reflection
3. After 5 seconds: Reflection's eyes blink independently
4. After 8 seconds: Reflection smiles slightly (player didn't smile)
5. After 10 seconds: Reflection suddenly LUNGES at glass
6. Loud CRACK sound
7. Mirror spiderwebs further
8. Reflection shows distorted, screaming face pressed against glass
9. Quick cut to black
10. Player is turned around, facing away from mirror

**Aftermath:** Mirror is more cracked now. Faint handprint visible on surface.

**Duration:** 5 seconds (after 10-second buildup)

---

### JUMPSCARE #5: "The Window Visitor"
**Trigger:** Look out window after 30 minutes in-game OR after 4 total wrong attempts across all puzzles

**Sequence:**
1. Player approaches window
2. Frosted glass shows vague shadows outside
3. Condensation forms letters: "L E T M E I N"
4. Shadows outside move closer
5. Sudden loud BANG on window
6. Flash of face pressed against glass from outside
7. Face is pale, eyes hollow, mouth open
8. Glass rattles violently
9. Loud breathing sound
10. Face slowly fades
11. Window returns to normal

**Aftermath:** Player is pushed back slightly. Window can't be interacted with for 60 seconds.

**Duration:** 7 seconds total

---

### PASSIVE HORROR MOMENTS (Not full jumpscares)

**Trigger:** Time-based or observation-based

1. **The Watching Painting:** Doctor's portrait eyes follow player slowly
2. **Moving Objects:** Look away from coffee table, look back - objects have moved
3. **Breath on Glass:** Condensation appears on mirror as if someone breathed on it
4. **Footsteps:** Heavy footsteps in corridor outside door when player is near it
5. **Whispers:** Faint whispering when player holds still for >15 seconds (words unclear)
6. **Radio Static:** Random bursts of static from unknown source
7. **Door Handle Jiggle:** Door handle moves as if someone is trying to get in (every 10 minutes)

---

## 7. CODE & CLUE SUMMARY

### All Codes:
| Lock/Puzzle | Code/Answer | Location of Clues |
|-------------|-------------|-------------------|
| **Closet 4-digit lock** | 3478 | Window (347), Clock (3:47), Photo (3/47/1978), Patient # (347) |
| **Safe box symbol lock** | △ ◐ ⚷ ☿ ⌛ | Under rug (carved sequence) + Journal (symbol meanings) + UV walls |
| **Clock hands** | 10:15 | Tape recording + Doctor's note |
| **Door lock** | Rusty Key | Inside safe box (after clock puzzle) |

### All Keys:
| Key | Found | Unlocks |
|-----|-------|---------|
| **Small Key** | Inside radiator | Medicine cabinet |
| **Rusty Key** | In safe box (appears after clock set to 10:15) | Main door |

### All Essential Items:
| Item | Location | Use |
|------|----------|-----|
| **Flashlight** | Desk top drawer | See in dark areas |
| **Batteries** | Medicine cabinet | Power flashlight |
| **UV Flashlight** | Closet | Reveal hidden symbols |
| **Tape Recorder** | Closet | Play tape with time clue |
| **Journal** | Under bed | Symbol meanings |
| **Small Key** | Radiator | Open medicine cabinet |
| **Rusty Key** | Safe box | Open final door |

---

## 8. PROGRESSION & PACING

### Time Pressure Mechanic:
**Total time limit: 60 minutes (optional, can be turned off)**

**Escalation over time:**
- **0-15 min:** Calm, exploration phase, minimal scares
- **15-30 min:** Ambient horror increases, more frequent sounds
- **30-45 min:** Door jiggling more frequent, passive horror moments escalate
- **45-55 min:** Lights flicker more, whispers get louder, countdown appears
- **55-60 min:** Frantic phase, constant tension, entity presence felt
- **60+ min:** BAD ENDING (if not escaped)

**Failure States:**
1. **Time Runs Out:** Screen fades to black, hear door opening, footsteps entering, cut to "You became part of the room" message
2. **Too Many Jumpscares:** After 7 major jumpscares, entity becomes "aware" - final jumpscare and game over
3. **Giving Up:** Player can click "I can't escape" option → Bad ending

---

## 9. GOOD ENDING vs BAD ENDING

### GOOD ENDING: "Acceptance"
**Requirements:**
- Solve all puzzles
- Open door with Rusty Key
- Choose [Accept the Truth]

**Sequence:**
1. Door opens slowly
2. Bright white light from outside
3. Player sees themselves on therapy chair in reflection
4. Voice (player's own): "I am Patient 347. I was trapped by my own mind."
5. Flashback images: Dr. Volker trying to help, not harm
6. Realization: The room is a mental prison, not physical
7. Player walks toward light
8. Fade to white
9. Final scene: Empty room, door open, sunlight streaming in
10. Text: "Patient 347 - Status: Released"
11. Credits

**Message:** Freedom comes from accepting reality, not fighting it.

---

### BAD ENDING 1: "Denial"
**Requirements:**
- Open door with Rusty Key
- Choose [Refuse to Believe]

**Sequence:**
1. Player refuses to accept truth
2. Mirror shatters
3. Laughter echoes
4. Door slams shut violently
5. Lights go out
6. Shadows swirl around player
7. Screen cuts to black
8. Text: "Try again, Patient 347"
9. Player wakes up on bed again - room reset
10. Hint: "The truth will set you free"

**Message:** Denial keeps you trapped.

---

### BAD ENDING 2: "Time's Up"
**Requirements:**
- Take longer than 60 minutes

**Sequence:**
1. Clock strikes (even though it's stuck)
2. All lights go out
3. Door unlocks and opens on its own
4. Heavy breathing from doorway
5. Footsteps enter room
6. Player can't move
7. Shadow figure approaches
8. Screen fades to black as figure reaches player
9. Text: "Patient 347 - Status: Missing"
10. "You are not the first. You will not be the last."

**Message:** Time runs out for everyone.

---

### BAD ENDING 3: "Broken Mind"
**Requirements:**
- Trigger 7+ major jumpscares (repeated failures)

**Sequence:**
1. After 7th jumpscare, player stumbles
2. Vision becomes blurry, red-tinted
3. Whispers grow louder: "Give in... give in..."
4. Player's hands appear on screen - shaking
5. Everything in room becomes distorted
6. Multiple shadow figures surround player
7. All voices speak at once: "ONE OF US"
8. Cut to black
9. Text: "Patient 347 - Status: Unresponsive"
10. Final shot: Player sitting in therapy chair, empty stare

**Message:** Fear can break you.

---

## 10. IMPLEMENTATION NOTES

### View & Controls:
**Camera:**
- First-person view
- Mouse/finger drag to look around (360° in room)
- Smooth camera movement, slight head bob when walking

**Movement:**
- Click/tap to move to location (point-and-click style) OR
- WASD/Arrow keys for direct control (optional)
- No running - slow, deliberate walking pace adds tension

**Interactions:**
- Hover/tap on object → Highlight outline + cursor change
- Click → Interact (pick up, examine, open, etc.)
- Examinable objects → Open close-up view modal
- Inventory → Bottom of screen, drag items to use
- Code entry → On-screen keypad appears

---

### UI Elements:

**HUD:**
```
┌────────────────────────────────────────┐
│                                        │
│  [Objective hint - top left]           │
│                                        │
│                                        │
│        [Main Game View]                │
│                                        │
│                                        │
│  [Inventory - bottom center]           │
│  [Flashlight] [Key] [Note] [Tape]      │
│                                        │
│  [Timer: 45:32] - bottom right         │
└────────────────────────────────────────┘
```

**Inventory:**
- Holds up to 8 items
- Click item to select/use
- Combine items by dragging one onto another
- Right-click/long-press to examine

**Code Input:**
- On-screen number pad (0-9)
- Enter/Submit button
- Wrong attempt counter visible

**Close-Up View:**
- Object fills screen
- Can rotate some objects
- Zoom in on specific areas
- "Back" button to return

---

### Audio Design:

**Ambient Layer:**
- Constant low hum (electrical)
- Dripping water (every 5-7 seconds)
- Wind outside (whooshing)
- Old building creaks

**Interactive Sounds:**
- Footsteps on carpet (muffled)
- Drawer opening (wood scraping)
- Key in lock (metallic click)
- Pages turning (paper rustle)
- Object pickup (soft grab sound)

**Horror Sounds:**
- Distant screaming (very faint)
- Breathing (not player's)
- Whispers (layered voices)
- Static bursts
- Heartbeat (during tension)

**Jumpscare Sounds:**
- Sudden loud bangs
- Distorted screams
- Audio glitching
- Deep bass rumble
- High-pitched violin screech

**Music:**
- Minimal/no music during exploration
- Tense drone when close to solving puzzle
- Heartbeat rhythm during high tension
- Orchestral swell for jumpscares
- Melancholic piano for good ending

---

### Visual Effects:

**Lighting:**
- Single overhead light (main source)
- Flashlight creates cone of light
- UV flashlight = purple glow
- Shadows are dynamic and long
- Lens flare when light flickers

**Post-Processing:**
- Slight film grain (adds age)
- Vignette (darkens edges)
- Chromatic aberration during jumpscares
- Screen shake (subtle) during footsteps
- Blur effect when player is "dizzy"

**Particle Effects:**
- Dust motes in flashlight beam
- Condensation on cold surfaces
- Faint fog near floor
- Sparkles on reflective objects

---

### Technical Features:

**Save System:**
- Auto-save after each puzzle completion
- Can't save-scum jumpscare triggers
- Progress saved: puzzles completed, items collected, codes entered

**Difficulty Options:**
- **Easy:** Hints available, 90-minute timer, fewer jumpscares
- **Normal:** Subtle hints, 60-minute timer, standard jumpscares
- **Hard:** No hints, 45-minute timer, more frequent horror events
- **Nightmare:** Permadeath (one attempt), 30 minutes, entity actively hunts

**Accessibility:**
- Adjustable text size
- Colorblind mode (code colors)
- Reduce jumpscare intensity option
- Turn off timer/pressure
- Text-to-speech for notes

**Replayability:**
- Randomize some clue locations (advanced)
- Alternative puzzle solutions
- Hidden achievements (speed run, no jumpscares, find all secrets)
- Collectible lore items (20+ scattered notes)

---

## 11. STEP-BY-STEP PLAYER EXPERIENCE

**Minute 0-5: Awakening**
1. Fade in from black
2. Player lying on bed, room spinning slightly
3. Hear own breathing, heartbeat
4. Can slowly sit up and look around
5. Objective appears: "Find a way out"
6. Attempt door → Locked
7. Begin exploration

**Minute 5-15: Discovery Phase**
1. Find dead flashlight
2. Explore room systematically
3. Read first notes (backstory)
4. Find small key in radiator
5. Open medicine cabinet
6. Get batteries
7. Flashlight works!

**Minute 15-25: First Real Puzzle**
1. Notice closet is locked
2. Find number clues (window, clock, photo)
3. Possibly trigger jumpscare if wrong code
4. Solve closet code: 3478
5. Get UV flashlight and tape recorder
6. Play tape → learn about 10:15

**Minute 25-40: Deep Investigation**
1. Use UV light on everything
2. Discover symbols
3. Find journal under bed
4. Lift rug → see symbol sequence
5. Enter symbols in safe box
6. Safe opens → EMPTY (confusion!)
7. Re-examine clues

**Minute 40-50: Realization**
1. Remember tape: "10:15"
2. Try clock manipulation
3. Set clock to 10:15
4. Hear mechanical sound
5. Check safe again → KEY APPEARS!
6. Joy and relief

**Minute 50-60: The Escape**
1. Approach door with key
2. Unlock door slowly
3. Door opens → twist revealed
4. See self in chair
5. CHOICE MOMENT
6. Choose ending
7. Ending sequence plays
8. Credits

---

## 12. ADVANCED FEATURES (Optional Expansion)

### Hidden Secrets:
1. **Secret Note #21:** Hidden in Bible, reveals Dr. Volker's guilt
2. **Patient Audio Logs:** 5 hidden tapes scattered in room
3. **Alternative Symbol Meaning:** Different interpretation changes lore
4. **Easter Egg:** Enter specific code to hear developer message

### Multiple Rooms (DLC Concept):
- **Treatment Room 7** (main room)
- **Doctor's Office** (unlocked with special key)
- **Patient Ward** (accessible through vent)
- **Basement** (where truth is revealed)

### Entity AI:
- Entity (Patient 347's shadow) actively patrols in NIGHTMARE mode
- Must hide when entity is near
- Entity reacts to noise (knocking over objects)
- Can't look directly at entity or instant jumpscare

---

## 13. MARKETING & TONE

**Target Audience:**
- Horror game fans (18-35 years old)
- Escape room enthusiasts
- Puzzle game players
- Psychological horror fans (Silent Hill, Layers of Fear)

**Tone:**
- Psychological over gore
- Atmospheric over action
- Mystery over violence
- Claustrophobic and intimate
- Sad and tragic (not just scary)

**Comparable Games:**
- Layers of Fear (first-person horror)
- The Room series (puzzle mechanics)
- Silent Hill (psychological horror)
- Resident Evil 7 (first-person tension)
- Amnesia (helpless feeling)

**Tagline Ideas:**
- "The mind is the darkest prison"
- "Not all escape rooms have exits"
- "Patient 347 is waiting"
- "Treatment ends in 60 minutes"

---

## 14. FULL PUZZLE SOLUTION WALKTHROUGH

For testing/debugging purposes:

1. Wake up, check door (locked)
2. Open desk top drawer → GET FLASHLIGHT (dead)
3. Inspect radiator → Unscrew section → GET SMALL KEY
4. Use small key on medicine cabinet → GET BATTERIES
5. Combine batteries + flashlight → FLASHLIGHT WORKS
6. Inspect window (see 347), clock (3:47), photo (3/47/78)
7. Enter code 3478 on closet → Opens
8. GET UV FLASHLIGHT, TAPE RECORDER, DOCTOR'S NOTE
9. Play tape → Hear "10:15" time
10. Use UV light around room → Find symbols
11. Look under bed → GET JOURNAL (symbol meanings)
12. Lift rug → See carved symbols: △ ◐ ⚷ ☿ ⌛
13. Move painting → Reveal SAFE BOX
14. Enter symbol sequence on safe → Opens (empty!)
15. Click clock → Move hands to 10:15 → Hear click
16. Check safe box again → RUSTY KEY appears
17. Use rusty key on door → Opens
18. Choose "Accept the Truth" → GOOD ENDING

**Perfect run time:** ~18-25 minutes (experienced players)
**Average first time:** ~45-55 minutes

---

## CONCLUSION

This design creates a tense, atmospheric horror escape room that relies on:
- **Psychological horror** over gore
- **Environmental storytelling** through objects and notes
- **Clever puzzle design** that makes logical sense
- **Meaningful jumpscares** that punish mistakes
- **Satisfying twist** that reframes the entire experience
- **Multiple endings** for replayability

The game should feel like a real escape room experience, but with the added terror of supernatural elements and time pressure. Every object has purpose, every scare has meaning, and the final revelation makes players rethink everything they've experienced.

**Core Philosophy:** "The scariest prison is the one we build in our own minds."

---

**END OF DESIGN DOCUMENT**

*Document Version: 1.0*
*Last Updated: 2025-12-09*
*Designer: Claude*
*Project Code: "FORGOTTEN PATIENT"*
