# A Quiet Engagement

A prototype for a **portrait-based immersive sim** — every character is a circular painted portrait on a 2D floor plan, and all the depth lives in systems and contextual actions instead of art. One self-contained HTML file, no engine, no build step, no assets.

**Premise:** Harrowgate Manor, tonight. Baron Casimir Voss announces his engagement — and you, *the Cormorant*, are an uninvited guest with work to do. Eliminate the Baron and walk out the front doors. How is entirely your affair.

## Design goals

1. **Visually interesting without an artist** — procedural canvas portraits, flat-shape floor plans, light and glow. Everything readable, nothing hand-drawn.
2. **Hitman-style systemic sandbox** — NPC schedules, vision cones and line of sight, trespass zones, disguises, witnesses, alarms, and "accident" kills that emerge from systems rather than scripted missions.
3. **Tabletop-RPG verb freedom** — tap anything, even across the room, and see every conceivable action. Greyed options tell you exactly what's missing ("needs: poison in pocket; barman looking away"), like a DM answering "can I…?". Choose an action and your character walks over and attempts it, re-checking conditions on arrival.
4. **Fear & Hunger-style combat when it goes loud** — body parts as individual targets, dismemberment (yours included), bleeding, and a literal coin flip to escape.

## Playing

Open `index.html` in a browser (or serve the repo with any static server). Works on phones — tap to move, tap things for actions.

- **Tap / click** — move, or open an action menu on people and objects (the world pauses while you decide)
- **WASD / arrows** — direct movement (cancels a queued action)
- **Focus** — show all vision cones and names
- **Notebook** — contract, gathered intelligence, tradecraft notes
- **Satchel** — items; some (coins) are used by tapping the world

## Systems in the prototype

- ~19 NPCs on looping schedules across foyer, ballroom, bar, terrace, kitchen, service corridor, and a locked study
- Perception: view distance + facing cone + wall raycasts; lights-out and a snuffed lantern shrink vision
- Suspicion → guard escort → alarm escalation; civilians report crimes to guards; bodies can be carried, stashed, and discovered
- Disguises (waiter / musician / guard) gate zone access
- Intel from eavesdropping on conversations, pickpocketing, and reading documents unlocks verbs and dialogue levers (one reroutes the target's whole schedule)
- Five-plus routes to the target: the reserve brandy, a garnished canapé, a terrace railing, a quiet blade, or open steel — plus distraction tools (fuse box, waltz requests, a champagne tower, thrown coins)
- Hitman-style end ratings from *The Ghost* to *The Butcher*

## Repo layout

- `index.html` — A Quiet Engagement (current prototype)
- `oubliette/index.html` — The Oubliette, the first prototype: a tile-based grim dungeon crawler with the same portrait aesthetic and the original limb-combat implementation
- `tests/nav-test.js` — Node script validating the shipped world geometry: pathfinding reachability for every object and NPC waypoint, locked-door blocking, and line-of-sight through walls (`node tests/nav-test.js`)

## Status / next

Prototype. Known directions: NPC memory of compromised disguises, item planting and drink swapping, more dialogue levers, combat balance, saving runs.
