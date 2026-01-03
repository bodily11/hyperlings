import Phaser from '../lib/phaser.js';
import { DIRECTION } from '../common/direction.js';
import { isGlobalShiftKeyHeld } from '../main.js';

export class Controls {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {boolean} */
  #lockPlayerInput;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #enterKey;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #fKey;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #shiftKey;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #spaceKey;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #leftKey;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #rightKey;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #upKey;
  /** @type {Phaser.Input.Keyboard.Key | undefined} */
  #downKey;

  /**
   * @param {Phaser.Scene} scene the Phaser 3 Scene the cursor keys will be created in
   */
  constructor(scene) {
    this.#scene = scene;
    // Use individual addKey calls for all keys instead of createCursorKeys
    // This ensures consistent behavior across scene transitions
    this.#leftKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.#rightKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.#upKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.#downKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.#spaceKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.#shiftKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.#enterKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.#fKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.#lockPlayerInput = false;
  }

  /** @type {boolean} */
  get isInputLocked() {
    return this.#lockPlayerInput;
  }

  /** @param {boolean} val the value that will be assigned */
  set lockInput(val) {
    this.#lockPlayerInput = val;
  }

  /** @returns {boolean} */
  wasEnterKeyPressed() {
    if (this.#enterKey === undefined) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(this.#enterKey);
  }

  /** @returns {boolean} */
  wasSpaceKeyPressed() {
    if (this.#spaceKey === undefined) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(this.#spaceKey);
  }

  /** @returns {boolean} */
  wasBackKeyPressed() {
    if (this.#shiftKey === undefined) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(this.#shiftKey);
  }

  /** @returns {boolean} */
  wasFKeyPressed() {
    if (this.#fKey === undefined) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(this.#fKey);
  }

  /**
   * Returns if the shift key is currently being held down.
   * Uses global browser state instead of Phaser's Key object to handle scene transitions.
   * This is necessary because shift key doesn't auto-repeat like arrow keys, so new scenes
   * don't receive keydown events for already-held shift keys.
   * @returns {boolean}
   */
  isShiftKeyDown() {
    return isGlobalShiftKeyHeld();
  }

  /** @returns {import('../common/direction.js').Direction} */
  getDirectionKeyJustPressed() {
    /** @type {import('../common/direction.js').Direction} */
    let selectedDirection = DIRECTION.NONE;
    if (this.#leftKey && Phaser.Input.Keyboard.JustDown(this.#leftKey)) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#rightKey && Phaser.Input.Keyboard.JustDown(this.#rightKey)) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#upKey && Phaser.Input.Keyboard.JustDown(this.#upKey)) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#downKey && Phaser.Input.Keyboard.JustDown(this.#downKey)) {
      selectedDirection = DIRECTION.DOWN;
    }

    return selectedDirection;
  }

  /** @returns {import('../common/direction.js').Direction} */
  getDirectionKeyPressedDown() {
    /** @type {import('../common/direction.js').Direction} */
    let selectedDirection = DIRECTION.NONE;
    if (this.#leftKey && this.#leftKey.isDown) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#rightKey && this.#rightKey.isDown) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#upKey && this.#upKey.isDown) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#downKey && this.#downKey.isDown) {
      selectedDirection = DIRECTION.DOWN;
    }

    return selectedDirection;
  }
}
