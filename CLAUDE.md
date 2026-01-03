# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monster Tamer is a Pokemon-like RPG game built with Phaser 3. This is a tutorial project for learning game development with vanilla JavaScript (ES6 modules) and the Phaser 3 framework. The game runs entirely in the browser without a build step.

## Development Setup

### Running the Game

The project uses a simple local web server to serve static files. The recommended setup is:

- Use VS Code with the LiveServer extension (Ritwick Dey)
- Launch via VS Code: use the "Launch Chrome against localhost" configuration (default port 5500)
- Alternatively, use any static file server pointing to the project root

**Note:** Assets (images and audio) are NOT included in the repository. Download them from the releases page and extract to the `/assets` folder before running.

### Code Formatting

- Prettier is configured for automatic formatting on save
- Settings: single quotes, semicolons, 120 char line width
- Format manually: use VS Code's format command or Prettier extension

### TODO Highlighting

The project uses special TODO comment markers:
- `TODO:NOW` - Urgent tasks (red)
- `TODO:` - Standard tasks (yellow)
- `TODO:FUTURE` - Future enhancements (green)

## Architecture

### Game Structure

The game is built using Phaser 3's scene system. All scenes extend `BaseScene`, which provides:
- Standard lifecycle hooks (init, preload, create, update)
- Controls integration
- Fullscreen toggle (F key)
- Scene resume/cleanup handling

Key scenes:
- **PreloadScene**: Loads all game assets (images, audio, fonts, JSON data)
- **TitleScene**: Main menu
- **WorldScene**: Overworld exploration with Tiled tilemaps
- **BattleScene**: Turn-based battle system using state machine pattern
- **DialogScene**: Handles all text conversations
- **MonsterPartyScene**: Monster team management
- **InventoryScene**: Item management
- **CutsceneScene**: Scripted story events

### State Management

#### DataManager (Global State)

The `dataManager` singleton (utils/data-manager.js) manages all game state:
- Player position, direction, and current location
- Monster party (max 6 monsters)
- Inventory items
- Game options (text speed, battle animations, sound, volume, menu color)
- Progress tracking (items picked up, events viewed, defeated NPCs, flags)
- Persistence via localStorage

**Key patterns:**
- Use `DATA_MANAGER_STORE_KEYS` constants to access state
- Call `dataManager.saveData()` after significant changes
- State is automatically loaded on game start
- Use `dataManager.store.get(key)` and `dataManager.store.set(key, value)` for basic access

#### StateMachine Pattern

The BattleScene uses a state machine to manage battle flow through states like:
- INTRO, PRE_BATTLE_INFO, BRING_OUT_MONSTER
- PLAYER_INPUT, ENEMY_INPUT, BATTLE
- POST_ATTACK_CHECK, GAIN_EXPERIENCE, FINISHED

Each state has an `onEnter` callback that executes when transitioning to that state.

### Data Loading

Game data is stored in JSON files under `/assets/data/`:
- **monsters.json**: Monster definitions with stats, attacks, levels
- **attacks.json**: Attack definitions
- **items.json**: Item definitions
- **npcs.json**: NPC data including dialog and trainer battles
- **encounters.json**: Wild monster encounter tables
- **events.json**: Story event definitions
- **signs.json**: Readable sign text
- **animations.json**: Sprite animation configurations
- **[area].json**: Tiled map files for different areas

Access this data via `DataUtils` helper methods like `DataUtils.getMonsterById(scene, id)` or `DataUtils.getItem(scene, id)`.

### World/Map System

Maps are created with Tiled and exported as JSON. The game uses:
- Multiple tilemap layers (ground, decoration, collision)
- Object layers for NPCs, items, encounter zones, events, warp zones
- Tiled custom properties for object configuration
- 64x64 pixel tile size (`TILE_SIZE` constant in config.js)

Helper utilities in `tiled-utils.js` parse Tiled object properties.

### Battle System

Battles use:
- Turn-based combat with attack selection
- Attack animations using custom Attack classes (Ice Shard, Slash, etc.)
- Experience and leveling system
- Monster capturing with items
- Trainer battles (NPC battles) vs wild encounters

The `AttackManager` handles attack execution and damage calculation.

### Asset Management

Assets are referenced using key constants:
- **asset-keys.js**: Image, audio, and general asset keys
- **font-keys.js**: Web font keys
- **tiled-keys.js**: Tilemap and tileset keys
- **attack-keys.js**: Attack animation keys

Always use these constants instead of string literals.

### Controls System

The `Controls` class (utils/controls.js) wraps Phaser input:
- Keyboard input handling
- Input locking during animations/transitions
- Consistent key bindings across scenes

All scenes have access to `this._controls` from BaseScene.

## Code Conventions

### JSDoc Type Definitions

The codebase uses JSDoc extensively for type checking:
- Type definitions in `types/typedef.js`
- JSDoc comments on all classes, methods, and parameters
- `jsconfig.json` enables type checking in VS Code

When adding code, maintain JSDoc documentation for IntelliSense and type safety.

### File Organization

- `/src/scenes/` - Phaser scene classes
- `/src/battle/` - Battle system (monsters, attacks, UI)
- `/src/world/` - World/overworld systems (characters, items)
- `/src/common/` - Shared UI components (menus, bars)
- `/src/utils/` - Helper utilities and managers
- `/src/assets/` - Asset key definitions
- `/src/lib/` - External library wrappers (Phaser, tweakpane)
- `/src/types/` - TypeScript-style type definitions

### Constants and Configuration

Global configuration is in `config.js`:
- `TILE_SIZE`: 64 pixels
- `TEXT_SPEED`: Slow/Medium/Fast timing values
- `MENU_COLOR`: Color theme definitions
- Debug flags like `ENABLE_ZONE_DEBUGGING`

Use `Object.freeze()` for all constant objects and enums.

### Scene Keys and Asset Keys

Always use centralized key constants:
- `SCENE_KEYS` object for scene identifiers
- Asset key files for all game assets
- Never use magic strings for scene or asset references

## Common Patterns

### Scene Transitions

Use `createSceneTransition()` helper for smooth scene changes with fade effects.

### Animation and Tweens

Phaser tweens are used extensively for UI animations:
- Health bar animations
- Menu transitions
- Battle monster movements
- Text reveal effects

Check for `skipAnimations` flags to allow users to speed through animations.

### Audio

Use the helpers in `audio-utils.js`:
- `playBackgroundMusic(scene, key)` for music
- `playSoundFx(scene, key)` for sound effects
- Respects user's sound settings from DataManager

### Text Rendering

Use `text-utils.js` helpers for consistent text styling with the Kenney Future Narrow font.

## Important Notes

- The game is built with vanilla JavaScript ES6 modules - no build tools or transpilation
- Phaser 3.60.0 is loaded from CDN
- All game state must go through DataManager to ensure proper saving/loading
- Monster party has a hard limit of 6 monsters
- Maps support multiple areas with interior/exterior designations for proper music transitions
