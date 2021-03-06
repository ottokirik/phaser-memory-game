import { GameObjects } from 'phaser';
import { CARD } from './keys';

export class Card extends GameObjects.Sprite {
  constructor(scene, id, { x, y }) {
    super(scene, x, y, `${CARD}${id}`);
    this.scene = scene;
    this.id = id;
    this.setOrigin(0, 0);
    this.scene.add.existing(this);
  }
}
