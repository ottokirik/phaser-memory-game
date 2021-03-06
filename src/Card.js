import { GameObjects } from 'phaser';
import { CARD } from './keys';

export class Card extends GameObjects.Sprite {
  opened = false;

  constructor(scene, id, { x, y }) {
    super(scene, x, y, CARD);
    this.scene = scene;
    this.id = id;
    this.setOrigin(0, 0);
    this.scene.add.existing(this);

    this.setInteractive();
  }

  open() {
    this.setTexture(`${CARD}${this.id}`);
    this.opened = true;
  }

  close() {
    this.setTexture(CARD);
    this.opened = false;
  }
}
