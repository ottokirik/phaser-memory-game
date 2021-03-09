import { GameObjects } from 'phaser';
import { IMAGES } from './keys';

export class Card extends GameObjects.Sprite {
  opened = false;

  constructor(scene, id) {
    super(scene, 0, 0, IMAGES.CARD);
    this.scene = scene;
    this.id = id;
    this.scene.add.existing(this);

    this.setInteractive();
  }

  open() {
    this.opened = true;
    this.flip(`${IMAGES.CARD}${this.id}`);
  }

  close() {
    this.opened = false;
    this.flip(IMAGES.CARD);
  }

  flip(texture) {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: 'Linear',
      duration: 250,
      onComplete: () => {
        this.show(texture);
      },
    });
  }

  show(texture) {
    this.setTexture(texture);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: 'Linear',
      duration: 250,
    });
  }
}
