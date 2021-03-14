import { Scene, Utils } from 'phaser';
import { Card } from './Card';
import { IMAGES, AUDIO } from './keys';
import { IMAGES_PATH, SOUNDS_PATH } from './paths';

export class GameScene extends Scene {
  cards = [];
  cardIds = [1, 2, 3, 4, 5];
  rows = 2;
  cols = 5;
  openedCard = null;
  openedCardsCount = 0;
  text = '';
  activeCardsCount = 0;
  timeout = 30;
  sounds = {};

  constructor(name) {
    super(name);
  }

  // Загрузить ресурсы
  preload() {
    this.load.image(IMAGES.BACKGROUND, `${IMAGES_PATH}background.png`);
    this.load.image(IMAGES.CARD, `${IMAGES_PATH}card.png`);
    this.cardIds.forEach((id) => {
      this.load.image(`${IMAGES.CARD}${id}`, `${IMAGES_PATH}card${id}.png`);
    });
    Object.keys(AUDIO).forEach((key) => {
      this.load.audio(AUDIO[key], `${SOUNDS_PATH}${AUDIO[key]}.mp3`);
    });
  }

  // Вывести картинки на экран
  create() {
    this.createBackground();
    this.createCards();
    this.createSounds();
    this.createText();
    this.createTimer();
    this.start();
  }

  start() {
    this.timeout = 30;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.activeCardsCount = 0;
    this.sounds.theme.play({ volume: 0.1 });
    this.initCards();
    this.showCards();
  }

  initCards() {
    const positions = this.getCardPositions();
    this.cards.forEach((card, index) => {
      card.init(positions.pop(), index);
    });
  }

  showCards() {
    this.cards.forEach((card) => card.move());
  }

  createBackground() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  }

  createCards() {
    this.cardIds.forEach((id) => {
      this.cards.push(new Card(this, id));
      this.cards.push(new Card(this, id));
    });

    this.input.on('gameobjectdown', this.onCardClicked, this);
  }

  onCardClicked(pointer, card) {
    if (this.activeCardsCount >= 2) {
      return;
    }

    if (card.opened) {
      return;
    }

    if (!this.openedCard) {
      this.sounds.card.play();
      card.open();
      this.openedCard = card;
      this.activeCardsCount += 1;
      return;
    }

    this.sounds.card.play();
    card.open();
    this.activeCardsCount += 1;

    const timeout = setTimeout(() => {
      if (this.openedCard.id === card.id) {
        this.sounds.success.play();
        this.openedCardsCount += 2;
      } else {
        this.openedCard.close();
        card.close();
      }

      this.openedCard = null;

      clearTimeout(timeout);

      if (this.openedCardsCount === this.cards.length) {
        this.sounds.complete.play();
        this.start();
      }

      this.activeCardsCount = 0;
    }, 900);
  }

  getCardPositions() {
    const cardTexture = this.textures.get(IMAGES.CARD).getSourceImage(); // получение изображения карты
    const [cardWidth, cardHeight] = [
      cardTexture.width + 4,
      cardTexture.height + 4,
    ];

    const offsetX =
      (this.sys.game.config.width - this.cols * cardWidth) / 2 + cardWidth / 2; // смещение, для позиционирования карт точно посередине
    const offsetY =
      (this.sys.game.config.height - this.rows * cardHeight) / 2 +
      cardHeight / 2;

    let positions = [];
    let positionDelay = 0;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        positionDelay += 1;
        positions.push({
          delay: positionDelay * 100,
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }

    return Utils.Array.Shuffle(positions);
  }

  createText() {
    this.text = this.add.text(10, 10, '', {
      font: '36px sans-serif',
      fill: '#000',
      stroke: '#fff',
      strokeThickness: 2,
    });
  }

  onTimerTick() {
    this.text.setText(`Time: ${this.timeout}`);

    if (this.timeout <= 0) {
      this.sounds.timeout.play();
      this.start();
      return;
    }

    this.timeout -= 1;
  }

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  }

  createSounds() {
    Object.keys(AUDIO).forEach((key) => {
      this.sounds[AUDIO[key]] = this.sound.add(AUDIO[key]);
    });
  }
}
