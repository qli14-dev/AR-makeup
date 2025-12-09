# THE TENANT - Horror Escape Room Game Design Document

## 🎮 Overview

**Genre:** Psychological Horror / Escape Room
**Platform:** Web Browser (HTML5)
**Play Time:** 20-30 minutes
**Theme:** Paranoia, isolation, entity horror

---

## 📖 Story Background

### The Setup
You are a journalist investigating disappearances in an old apartment building. Over the past 30 years, five tenants have vanished from Room 7B without a trace. The landlord claims the room has been empty since the 1980s, but you found recent signs of activity.

Following your instincts, you broke into Room 7B to investigate. Someone—or something—knocked you unconscious.

You wake up in the room. The door is sealed. The windows are painted black. And you hear breathing from inside the walls.

### The Truth
Room 7B was the home of Marcus Holloway, a man who suffered from severe paranoia and insomnia in 1987. He became convinced that something was living in the walls of his apartment—watching him, breathing, waiting.

Marcus covered the room with symbols, codes, and hidden messages, trying to communicate with or ward off the entity. Eventually, driven to the edge of sanity, he sealed himself inside the room. He was never seen again.

But Marcus wasn't insane. The entity was real.

**The Entity:** A presence that exists between the walls, feeding on fear and confusion. It doesn't kill—it *traps*. Those it captures become part of the building, eternal tenants in an endless nightmare.

### Escape is Possible
In his final lucid moments, Marcus created a way out for anyone who might become trapped. He designed a series of puzzles that prove the solver is rational, sane, and understanding of what happened. The entity respects this—barely.

But the entity has corrupted Marcus's puzzles with traps and jumpscares to test your resolve. Random attempts will fail. Panic will doom you. Only those who truly *see* what Marcus saw can escape.

And the terrible secret? Room 7B isn't special. The entity isn't confined to one room—**it's in the entire building**.

---

## 🏠 Room Layout

### Physical Description
**Shape:** Rectangular, approximately 15ft × 20ft
**Atmosphere:** Dim, oppressive, claustrophobic
**Lighting:** Single flickering overhead bulb (yellowish, 60W equivalent)
**Walls:** Peeling wallpaper, water stains, scratches
**Floor:** Worn wooden floorboards, one loose under carpet
**Smell:** Dust, decay, dampness
**Temperature:** Unnaturally warm despite cold radiator

### Object Placement (Bird's Eye View)

```
BACK WALL
┌─────────────────────────────────────────────┐
│  [Window-Boarded]    [Radiator]   [Vent]   │ BACK
│                                              │
│  [Wardrobe] [Mirror]        [Painting]      │
│                                              │
│                                [Bookshelf]   │ RIGHT
│                                [Desk]        │
│                                              │
│         [Mattress]      [Carpet]            │
│                    [Coffee Table]           │
│                                              │
│ [DOOR]                                      │ FRONT
└─────────────────────────────────────────────┘
LEFT                                      RIGHT
```

### Interactive Objects

1. **Door** (Left wall, 40% down) - Exit, requires special knock pattern
2. **Wardrobe** (Left wall, top) - Locked, can be pulled from wall
3. **Mirror** (Left wall, top) - Cracked, contains key piece when broken
4. **Painting** (Center-left, wall-mounted) - Hides safe behind it
5. **Window** (Back wall, center) - Boarded, no escape
6. **Vent** (Back wall, ceiling) - Contains UV flashlight
7. **Radiator** (Back wall, right) - Contains key piece in drain plug
8. **Bookshelf** (Right wall, top) - Contains hollow book with key piece
9. **Desk** (Right wall, center) - Has calendar, photo, clock - main puzzle clues
10. **Mattress** (Floor, center-left) - Examination triggers jumpscare
11. **Carpet** (Floor, center-right) - Must unroll to reveal star symbol and loose floorboard
12. **Coffee Table** (Floor, right) - Has circle symbol on leg

### Hidden Spaces
- **Behind painting:** 4-digit safe
- **Inside ceiling vent:** UV flashlight (requires screwdriver)
- **Radiator drain plug:** Key piece 1
- **Hollow book:** Key piece 2
- **Behind mirror:** Key piece 3 (requires breaking)
- **Under carpet:** Loose floorboard with metal box (requires key)
- **Behind wardrobe:** Scratched wall message (secret ending clue)

---

## 🧩 Puzzle System

The puzzles are connected in a logical chain. Each solution unlocks the next piece of the escape.

### PUZZLE 1: The Calendar Cipher
**Location:** Desk drawer
**Clue Components:**
- Old calendar from March 1987
- Three dates circled: March 7, October 12, November 24
- First date (March 7) is circled in RED multiple times
- Photo on desk shows Marcus holding sign: "When did it start?"
- Broken clock stuck at 3:07

**Solution:** 0307 (March 7th - the date Marcus was institutionalized)
**Opens:** Safe behind painting
**Wrong attempts:** Whispered counting from walls, 2+ failures trigger Mirror Jumpscare

---

### PUZZLE 2: The Symbol Sequence
**Location:** Journal page found in safe
**Clue:** "The walls remember the order: Circle, Triangle, Square, Star, Moon"

**Symbol Locations:**
1. **Circle** - Carved into coffee table leg
2. **Triangle** - Stain pattern on mattress
3. **Square** - Book spine on bookshelf
4. **Star** - Scratched into floorboard (must unroll carpet first)
5. **Moon** - Water stain on ceiling near light bulb (press 'U' key to look up)

**Solution:** Find all 5 symbols *in correct order*
**Result:** Confirms understanding of Marcus's system
**Wrong order:** Triggers Darkness Jumpscare (5 seconds pitch black), symbols reset

---

### PUZZLE 3: The UV Messages
**Location:** Throughout room, invisible without UV light
**Tool Required:** UV Flashlight (from ceiling vent)

**UV Messages:**
- Main wall: "My key broke. Find the THREE pieces."
- Near radiator: "COLD IRON HIDES THE FIRST"
- On mattress: "WORDS WITHOUT MEANING HOLD THE SECOND"
- On mirror: "BREAK YOUR REFLECTION TO SEE TRUTH"
- Painting signature: "M.H. 1987 - ROOM 7B - THE WALLS ARE THIN" (secret clue)
- Window boards: "NO EXIT"

**Solution:** Read messages to learn where key pieces are hidden
**Result:** Guides player to key piece locations

---

### PUZZLE 4: The Three Key Pieces
**Objective:** Assemble complete key to open metal box under floorboard

**Key Piece Locations:**
1. **Piece 1 - "COLD IRON"** → Radiator drain plug (iron radiator is cold)
2. **Piece 2 - "WORDS WITHOUT MEANING"** → Hollow book on shelf (damaged books)
3. **Piece 3 - "BROKEN REFLECTION"** → Behind mirror (must break it with screwdriver)

**Requirements:**
- Screwdriver (from safe) to break mirror and pry up floorboard
- UV flashlight to read clues about locations

**Solution:** Collect all three pieces, they auto-assemble into Assembled Key
**Result:** Can now open metal box

---

### PUZZLE 5: The Metal Box
**Location:** Under loose floorboard beneath carpet
**Lock:** Requires Assembled Key

**Contents:**
- Red Keycard (not actually used, red herring)
- Final Journal Page with knock pattern

**Journal Page:** "The door was never locked. It was WATCHING. Show it you know the truth. Knock three times, pause, knock twice."

---

### PUZZLE 6: The Door Knock Pattern
**Location:** Exit door
**Clue:** Final journal page

**Correct Pattern:**
- Knock 3 times (rapid succession)
- Pause (2+ seconds)
- Knock 2 times (rapid succession)

**Solution Mechanics:**
- Player clicks "KNOCK" button
- System detects pause between knock groups
- Must have significant pause between 3rd and 4th knock

**Success:** Door unlocks → Escape achieved
**Failure:** 3+ wrong attempts → Door Jumpscare → bad ending if 5+ total scares

---

### PUZZLE 7: The Hidden Truth (Secret Ending)
**Requirements:**
- Examine painting with UV light (reveals signature "M.H. 1987 - THE WALLS ARE THIN")
- Pull wardrobe from wall (reveals scratched message)
- Read scratched message: "IT NEVER LEFT. IT'S IN EVERY ROOM. WARN THEM."
- Complete all other puzzles
- Escape with correct knock pattern

**Result:** Unlocks Secret Ending revealing the building-wide horror

---

### Red Herrings (Misleading Elements)
- **Red Keycard:** Suggests card reader, but door uses knock pattern
- **Random numbers on walls:** Look like codes but are meaningless
- **Locked wardrobe:** Can't be opened, but moving it reveals truth
- **Phone in coffee table:** No dial tone, just static and breathing
- **Letters on floor:** Appear important but are grocery lists
- **Multiple circled dates:** Only first date matters for safe code

---

## 😱 Jumpscare System

### Design Philosophy
**NO GORE** - All scares are psychological
Focus on: shadows, sounds, implications, brief glimpses, atmosphere

### JUMPSCARE 1: The Watcher
**Trigger:** Stand still for 15+ seconds (idle timer)
**Visual:** Tall shadow figure appears in corner/peripheral vision (👁️)
**Audio:** Deep breathing sound (2 seconds)
**Duration:** 2 seconds
**After-Effect:**
- Lights flicker violently
- Heavy footsteps heard above ceiling
- Player feels watched

**Psychological Impact:** Creates urgency, punishes hesitation and overthinking

---

### JUMPSCARE 2: The Mirror Face
**Trigger:**
- Look at mirror 3+ times
- OR enter wrong safe code twice

**Visual:** Distorted face flashes in reflection (😱)
**Audio:** Sharp violin screech
**Duration:** 0.3 seconds (subliminal flash)
**After-Effect:**
- Mirror cracks further
- Whispers begin in room
- Player questions what they saw

**Psychological Impact:** Distrust of reflections, self-doubt

---

### JUMPSCARE 3: The Wall Knock
**Trigger:**
- Touch/examine walls 3+ times
- OR pull wardrobe before finding UV light

**Visual:** Screen shakes slightly (💀)
**Audio:** Loud, violent synchronized knocking from ALL walls (4 seconds)
**Duration:** 4 seconds of intense knocking, ends with single long scrape
**After-Effect:**
- Book falls from shelf
- Lights dim to 50% brightness
- Room feels smaller

**Psychological Impact:** Something is alive and angry in the walls

---

### JUMPSCARE 4: The Crawler
**Trigger:** Look under mattress for 2+ seconds total
**Visual:** Glimpse of pale hands retreating into darkness (🖐️)
**Audio:** Rapid crawling/scratching sound
**Duration:** 1.5 seconds
**After-Effect:**
- Mattress shifts position slightly
- Breathing sounds intensify
- Something moved while you weren't looking

**Psychological Impact:** You're not alone in the room

---

### JUMPSCARE 5: The Failed Escape
**Trigger:**
- Try door with wrong knock pattern
- OR knock randomly 3+ times

**Visual:** Door bulges inward, as if something is pressing against it (🚪)
**Audio:** Deep guttural sound from hallway side
**Duration:** 3 seconds
**After-Effect:**
- Door handle becomes icy cold
- Single scratch mark appears on door
- Fresh scratch marks, as if from claws

**Psychological Impact:** The entity is outside too - trapped both ways

---

### JUMPSCARE 6: The Darkness
**Trigger:** Enter symbol sequence in wrong order
**Visual:** Complete pitch black screen (5 seconds)
**Audio:** Heavy breathing in darkness, getting closer
**Duration:** 5 seconds of total darkness
**After-Effect:**
- Lights return at 60% brightness
- Room temperature drops
- Shadows are darker

**Psychological Impact:** Vulnerability, helplessness in darkness

---

### Jumpscare Progression System
- **Jumpscares 1-2:** Unnerving, atmospheric
- **Jumpscares 3-4:** Intense, startling
- **Jumpscares 5+:** Triggers Bad Ending (entity overwhelms player)

**Design Note:** Skilled players who solve puzzles correctly can complete the game with 0-2 jumpscares. Random exploration triggers 5+ scares and leads to bad ending.

---

## 🎬 Endings

### GOOD ENDING: "The Escape"
**Unlock Condition:** Complete knock pattern correctly with 0-4 jumpscares

**Scene:**
1. Door clicks open slowly
2. Breathing from walls stops abruptly - total silence
3. Corridor outside is lit and appears normal (dim but safe)
4. Player steps out
5. Door SLAMS violently behind them
6. Exit sign visible at corridor end

**Text:**
> *"You understood what Marcus tried to teach you.*
> *Some doors open only for those who listen.*
> *But you can still hear the breathing in your dreams."*

**Victory Stats:** Time, jumpscare count displayed

**Emotional Tone:** Relief mixed with lingering dread. You escaped, but you're scarred. The breathing will haunt you.

---

### BAD ENDING: "The Tenant"
**Unlock Conditions:**
- Trigger 5+ jumpscares
- OR fail escape attempt 3+ times
- OR time runs out (30 minutes)

**Scene:**
1. Lights die completely - pitch black
2. Breathing becomes rapid and CLOSE (you can feel it)
3. Walls creak and groan - sounds organic, alive
4. Player's vision fades to nothing (not black, just absence)
5. Sounds of wood creaking, chains, settling
6. Silence

**Text:**
> *"The room has claimed another tenant.*
> *Your nameplate is already on the wall outside.*
> *You've always lived here.*
> *You'll never leave."*

**Failure Stats:** Time survived displayed

**Emotional Tone:** Hopeless dread. You ARE Room 7B now. Forever.

---

### SECRET ENDING: "The Truth"
**Unlock Conditions:**
- Complete all puzzles
- Examine painting with UV light (see signature)
- Pull wardrobe and read wall scratches
- Escape with correct knock pattern
- All secret clues discovered

**Scene:**
1. Door opens, player escapes into corridor (as good ending)
2. But as player walks toward exit...
3. **Breathing sounds from EVERY door in the corridor**
4. Camera pans: dozens of doors, each with nameplates
5. Nameplates show dates: 1987, 1992, 2001, 2008, 2015, last month
6. Player reaches exit, turns back
7. Exterior shot: Player stands outside building at night
8. All windows are dark except ONE on 7th floor
9. Silhouette stands in that window, watching player
10. Fade to black

**Text:**
> *"Room 7B was never special.*
> *The entity isn't in one room—it's in the BUILDING.*
> *Marcus knew. The others knew. Now you know.*
> *But who would believe you?"*
>
> *"The building will wait. When you tell someone about this...*
> *And when they come to investigate...*
> *There will be a new tenant."*

**Secret Stats:** Time, "SECRET ENDING UNLOCKED" badge

**Emotional Tone:** Existential horror. The escape was meaningless. The entity is vast, patient, and unstoppable. You've become part of its cycle—bait for the next victim. Knowledge is a curse.

---

## 🎵 Sound Design

### Ambient Layer (Continuous)
- **Low frequency hum:** 35Hz (subsonic unease)
- **Distant muffled traffic:** Creates false sense of civilization nearby
- **Building settling creaks:** Random intervals
- **Water drips:** Occasional, from unseen source
- **Muffled sounds:** Footsteps, doors closing from "other rooms"

**Effect:** Player feels isolated but not alone. Something is happening beyond the walls.

---

### Breathing Pattern (Core Horror Element)
- **Base breathing:** Slow, rhythmic, from walls
- **Adaptive breathing:** Syncs with player actions
  - Faster when player rushes
  - Slower when player is idle
  - Stops briefly when puzzles solved correctly
  - Intensifies during jumpscares

**Effect:** Creates sense of being watched and mirrored. The entity is *aware* of you.

---

### Interactive Sounds
- **Drawer opening:** Wood scrape
- **Footsteps:** Floorboard creaks (different tones per area)
- **Light switch:** Click + electrical buzz
- **Safe dial:** Metallic clicking
- **Screwdriver on screws:** Metal threading sounds
- **Mirror breaking:** Sharp shatter + glass falling
- **Key assembly:** Metallic clinks
- **Door knocking:** Deep wood thuds
- **Wardrobe scraping:** Heavy furniture on wood

---

### Horror Sounds (Triggered)
- **Scratching:** Fingernails on wood (from walls)
- **Whispers:** Unintelligible, layered voices
- **Sudden knocks:** Loud, from inside walls
- **Footsteps above:** Heavy, dragging
- **Violin screeches:** High-pitched (jumpscare stinger)
- **Low growls:** Barely audible, subconscious threat
- **Player heartbeat:** Increases during tension

---

### Dynamic Audio System
- **Proximity hints:** Sounds intensify near correct puzzle elements
- **Wrong action punishment:** Discordant tones when wrong codes entered
- **Whisper clarity:** With each jumpscare, whispers become clearer (saying "stay")
- **Ending audio:** All sound cuts out for Good Ending escape moment

---

## 💡 Lighting System

### Base Lighting
- **Overhead bulb:** Yellowed, 60W equivalent
- **Flicker pattern:** Every 7-15 seconds randomly
- **Coverage:** 70% of room lit, corners always dark
- **Shadow behavior:** Harsh shadows, high contrast

---

### Dynamic Lighting Events
- **Post-jumpscare dimming:** -30% brightness after each scare
- **Wrong code flicker:** Rapid flickering during incorrect attempts
- **Symbol puzzle failure:** Complete darkness for 5 seconds
- **Near-bad-ending:** Drops to 20% emergency lighting
- **UV flashlight:** Purple glow, reveals hidden messages

---

### Shadow Anomalies (Subtle Horror)
- Corners remain pitch black even with light
- Shadows under furniture seem to shift
- Player's shadow sometimes has slight delay
- Entity shadow (jumpscare) appears without light source

---

## 🎮 Gameplay Mechanics

### Controls
- **Mouse:** Point and click objects to examine
- **Keyboard:**
  - ESC: Close modal/menu
  - U: Look up at ceiling (secret)
- **Clicking objects:** Examines them, opens interaction menu
- **Inventory:** Click items to use/select

---

### Game State Tracking
The game tracks:
- Items collected
- Clues discovered
- Puzzles solved
- Jumpscare count
- Time elapsed
- Idle time (for Watcher jumpscare)
- Mirror look count
- Wall touch count
- Mattress look time
- Knock attempts
- Secret clues found

---

### Timer System
- **Total time:** 30 minutes
- **Display:** Countdown clock (top-right)
- **Color changes:**
  - Green: 30-10 minutes remaining
  - Yellow: 10-5 minutes remaining
  - Red: Under 5 minutes
- **Time out:** Triggers Bad Ending

---

### Inventory System
- **Visible inventory:** Bottom-left panel
- **Items are tools:** Can be used on compatible objects
- **Key items:**
  - Screwdriver (opens vent, breaks mirror, pries floorboard)
  - UV Flashlight (reveals hidden messages, toggle on/off)
  - Key Pieces (auto-assemble when all 3 collected)
  - Assembled Key (opens metal box)
  - Journal Pages (contain crucial puzzle solutions)

---

### Action Log
- **Location:** Bottom-right panel
- **Function:** Records all actions and discoveries
- **Color coding:**
  - White: Normal actions
  - Red: Important discoveries
- **Scrollable:** Auto-scrolls to latest entry

---

### Progressive Difficulty
**Early game (0-10 min):**
- Simple object examination
- Calendar cipher is straightforward
- Safe provides tools immediately

**Mid game (10-20 min):**
- Symbol sequence requires careful searching
- UV light mechanic introduced
- Multiple locations to check

**Late game (20-30 min):**
- Key piece assembly requires backtracking
- Pattern recognition (knock sequence)
- Time pressure increases
- Jumpscare risk higher

---

## 🎯 Design Principles

### 1. **No Random Solutions**
Every puzzle has logical clues. No pixel hunting or trial-and-error required.

**Example:** The safe code (0307) is clued by:
- Calendar with March 7 circled in RED
- Clock frozen at 3:07
- Photo asking "When did it start?"

### 2. **Reward Thoroughness**
Players who examine everything and think critically escape faster with fewer scares.

**Example:** Reading ALL UV messages tells you exactly where key pieces are. Randomly searching triggers jumpscares.

### 3. **Punishment Fits the Crime**
Wrong actions have thematic consequences, not random punishments.

**Example:**
- Wrong safe code → whispers (entity knows you're guessing)
- Wrong symbols order → darkness (entity tests your fear)
- Looking under bed too long → see the crawler (curiosity punished)

### 4. **Story Through Environment**
The room tells Marcus's story without exposition dumps.

**Example:**
- Symbols everywhere → paranoia
- UV messages → lucid moments
- Broken key in 3 pieces → desperation
- Scratched wall message → final warning

### 5. **Psychological Over Gore**
Horror comes from implication, not explicit violence.

**Example:**
- You don't see the entity clearly
- Breathing implies presence
- Shadows move at edge of vision
- The unknown is scarier than the known

### 6. **Multiple Endings Reflect Player Behavior**
Your approach determines your fate.

- **Patient, observant player:** Good ending
- **Panicked, random player:** Bad ending
- **Thorough, story-focused player:** Secret ending

---

## 🧠 Psychological Horror Elements

### Paranoia Triggers
- **Breathing syncs with player:** Creates feeling of being mirrored
- **Shadows move slightly:** Doubt your perception
- **Idle timer jumpscare:** Punishes overthinking
- **Mirror reflection "off":** Self-distrust

### Isolation Elements
- **No outside help:** You're alone
- **Sealed exits:** Trapped completely
- **Muffled "other rooms":** Civilization is close but unreachable
- **Time limit:** No rescue coming

### Claustrophobia
- **Small room:** 15x20ft, cramped
- **Low ceiling:** Vent barely reachable
- **Walls feel closer:** After Wall Knock jumpscare
- **Furniture blocks movement:** Limited space

### Dread Building
- **Progressive dimming:** Room gets darker with each scare
- **Increasing audio:** Breathing and whispers intensify
- **Countdown timer:** Time pressure
- **Jumpscare escalation:** Each scare worse than last

### Existential Horror (Secret Ending)
- **Entity is everywhere:** Not just one room
- **Decades of victims:** This has been happening forever
- **You're bait now:** Your knowledge makes you part of the cycle
- **No escape really:** The building wins

---

## 📋 Walkthrough (Optimal Path)

**Time: ~15-20 minutes with 0-2 jumpscares**

1. **Start:** Wake up, examine room
2. **Desk:** Check calendar (March 7), photo, clock (3:07)
3. **Painting:** Look behind, find safe
4. **Safe:** Enter code 0307 → get screwdriver, journal page 1
5. **Read Journal:** Learn about Circle, Triangle, Square, Star, Moon sequence
6. **Coffee Table:** Find Circle on leg (1/5)
7. **Mattress:** Examine stains, find Triangle (2/5)
8. **Bookshelf:** Check books, find Square on spine (3/5)
9. **Carpet:** Unroll it, find Star on floorboard (4/5)
10. **Ceiling:** Press 'U' key, look up, find Moon in water stains (5/5)
11. **Vent:** Use screwdriver, open vent → get UV flashlight
12. **UV Mode:** Turn on UV light, examine room
13. **UV Messages:** Read all messages (wall, mattress, radiator, mirror)
14. **Radiator:** Check drain plug → get key piece 1
15. **Bookshelf:** Find hollow book → get key piece 2
16. **Mirror:** Break with screwdriver → get key piece 3
17. **Key Auto-Assembles:** All 3 pieces form complete key
18. **Floorboard:** Use screwdriver to pry up loose board under carpet
19. **Metal Box:** Use assembled key → get journal page 3
20. **Read Journal:** Learn knock pattern (3-pause-2)
21. **Wardrobe (Optional):** Pull from wall → read scratched message (secret ending)
22. **Door:** Perform knock pattern (knock 3x, pause, knock 2x)
23. **ESCAPE:** Good ending (or secret ending if found wall message)

---

## 🎨 Visual Style Guide

### Color Palette
- **Primary:** Dark browns, grays, blacks
- **Accent:** Dark red (#8b0000) for danger/interactive elements
- **Lighting:** Yellowed white (warm but sickly)
- **UV Mode:** Purple/magenta (#bf00ff)
- **UI Text:** Light gray (#d4d4d4)

### Typography
- **Font:** Courier New (monospace, typewriter feel)
- **Size:** Readable but not comfortable (adds to unease)
- **All caps for emphasis:** Object names, important clues

### UI Design
- **Minimal:** No modern UI elements
- **Diegetic where possible:** In-world interactions
- **Dark backgrounds:** Blend with environment
- **Subtle borders:** Room boundaries barely visible

### Visual Effects
- **Film grain:** Slight texture overlay
- **Vignette:** Darkened corners
- **Chromatic aberration:** Slight RGB split (unsettling)
- **Breathing animation:** Room subtly scales (1.0 to 1.02)
- **Flicker:** Light pulses irregularly

---

## 🔧 Technical Implementation

### Files
- `horror-escape-room.html` - Structure and layout
- `horror-escape-game.js` - Game logic, puzzles, jumpscares
- Inline CSS in HTML - Styling and visual effects

### Key Systems

**Game State Manager:**
- Tracks all progress
- Saves discovered clues
- Manages puzzle completion
- Counts jumpscares

**Inventory System:**
- Array of collected items
- Item use logic
- Visual display

**Modal System:**
- Examines objects
- Shows puzzles
- Displays endings

**Jumpscare Engine:**
- Trigger detection
- Visual/audio execution
- After-effects
- Bad ending threshold

**Timer System:**
- Countdown from 30 minutes
- Idle detection (15s → Watcher)
- Bad ending on timeout

**Sound Engine:**
- Web Audio API
- Procedural sound generation
- Dynamic ambient layer
- Trigger-based effects

---

## 📊 Playtesting Targets

### Difficulty
- **Expert players:** 15-20 minutes, 0-1 jumpscares
- **Average players:** 20-25 minutes, 2-3 jumpscares
- **Struggling players:** 25-30 minutes, 4-5 jumpscares (triggers bad ending)

### Scare Effectiveness
- **First jumpscare:** Should startle 80% of players
- **Subsequent scares:** Create tension even if expected
- **Bad ending:** Should feel inevitable and earned

### Story Clarity
- **Good ending:** 100% of players should understand they escaped
- **Bad ending:** 100% should understand they're trapped forever
- **Secret ending:** 60% should grasp the building-wide horror
- **Marcus's story:** 80% should piece together what happened from clues

### Puzzle Fairness
- **Calendar code:** 90% should solve in first try with clues
- **Symbol sequence:** 70% should find all symbols, 50% in correct order
- **UV messages:** 80% should read all messages
- **Knock pattern:** 60% should get it right first time after reading journal

---

## 🎓 Tips for Players

**Hidden in the design, not explicitly stated:**

1. **Read everything carefully.** Clues are exact, not vague.
2. **Don't rush.** Panic leads to jumpscares.
3. **Use UV light everywhere.** Messages are in multiple locations.
4. **The room tells a story.** Understanding Marcus helps you escape.
5. **Press U to look up.** The ceiling has secrets.
6. **Move furniture.** Things hide behind objects.
7. **Count carefully.** Patterns matter (knock sequence).
8. **Wrong attempts have consequences.** Think before trying codes.
9. **Explore BEFORE attempting escape.** Door won't open without preparation.
10. **For secret ending:** Examine everything with UV light, move the wardrobe.

---

## 🏆 Achievement Ideas (If Implemented)

- **The Escape Artist** - Complete good ending under 20 minutes
- **Fearless** - Complete game with 0 jumpscares
- **The Truth Seeker** - Unlock secret ending
- **Speedrunner** - Complete under 15 minutes
- **Survivor** - Escape with less than 2 minutes remaining
- **Observer** - Find all UV messages
- **Detective** - Piece together Marcus's full story
- **Patient** - Never trigger the Watcher jumpscare
- **Brave** - Break the mirror on first examination

---

## 🔮 Future Expansion Ideas

### Additional Rooms
- **Room 3F** - Different tenant, different puzzle style
- **Room 9A** - Time-looped room
- **Basement** - Where the entity originated

### New Mechanics
- **Flashlight battery:** Resource management
- **Sanity meter:** Visual/audio distortion
- **Multiple entities:** Different behaviors per room
- **Co-op mode:** Two players trapped, must communicate

### Story Expansion
- **Prequel:** Play as Marcus setting up the escape
- **Sequel:** Return to the building as investigator
- **The Landlord:** Horror from the entity's perspective

---

## 📝 Credits & Inspiration

**Genre Influences:**
- Silent Hill (psychological horror, symbolism)
- Resident Evil (puzzle-box environment)
- P.T. (looping dread, subtle changes)
- Escape room games (logical puzzle chains)
- The SCP Foundation (clinical horror, entities with rules)

**Design Philosophy:**
"True horror is not seeing the monster—it's knowing the monster sees you."

---

## 🎯 Core Experience Goals

When a player finishes "The Tenant," they should feel:

1. **Relief** - Escaped a genuinely threatening situation
2. **Accomplishment** - Solved clever, fair puzzles
3. **Unease** - The breathing still echoes in their mind
4. **Curiosity** - Want to understand the full story
5. **Dread (Secret Ending)** - Existential horror at the scale of the entity

**Success = Player thinks about the game hours after closing it.**

The breathing. The walls. The knowledge that some buildings are not empty even when they appear to be.

---

## 🎮 How to Play

1. Open `horror-escape-room.html` in a modern web browser
2. Click "ENTER THE ROOM" to start
3. Click objects in the room to examine them
4. Collect items and solve puzzles
5. Use inventory items by clicking them
6. Toggle UV flashlight to reveal hidden messages
7. Press U to look up at ceiling
8. Escape before time runs out

**Best Experience:**
- Play in a dark room with headphones
- Full screen mode
- No distractions

---

**END OF DESIGN DOCUMENT**

*Good luck, journalist. Room 7B is waiting.*
