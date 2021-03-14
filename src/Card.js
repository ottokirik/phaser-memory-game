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

  init(position, index) {
    this.position = position;
    if (this.opened) {
      this.close();
    }
    this.setPosition(-this.width, -this.height);
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

  move() {
    this.scene.tweens.add({
      targets: this,
      x: this.position.x,
      y: this.position.y,
      delay: this.position.delay,
      ease: 'Linear',
      duration: 250,
    });
  }
}
