class Ship {
  constructor(length) {
    this.length = length;
    this.hp = length;
  }

  hit = () => this.hp--;

  isSunk = () => this.hp === 0;
}

export default Ship;
