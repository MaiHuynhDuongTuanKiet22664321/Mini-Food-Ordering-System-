const { v4: uuidv4 } = require('uuid');

class Order {
  constructor(userId, items) {
    this.id = uuidv4();
    this.userId = userId;
    this.items = items;
    this.totalPrice = 0;
    this.status = 'PENDING';
  }
}

module.exports = Order;
