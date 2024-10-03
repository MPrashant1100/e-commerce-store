// lib/store.ts
export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends Item {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount?: number;
}

export interface CheckoutResult {
  order: Order;
  generatedCouponCode?: string;
}

export interface AdminStats {
  itemsPurchased: number;
  totalPurchaseAmount: number;
  discountCodes: string[];
  totalDiscountAmount: number;
}

class Store {
  private items: Item[] = [
    { id: "1", name: "Product 1", price: 10 },
    { id: "2", name: "Product 2", price: 20 },
    { id: "3", name: "Product 3", price: 30 },
  ];

  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private discountCodes: string[] = [];
  private orderCount: number = 0;
  private readonly NTH_ORDER = 3; // Every 3rd order gets a discount
  private readonly DISCOUNT_PERCENTAGE = 0.1; // 10% discount

  getItems(): Item[] {
    return this.items;
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  addToCart(itemId: string, quantity: number): void {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Item not found");

    const existingCartItem = this.cart.find((i) => i.id === itemId);
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      this.cart.push({ ...item, quantity });
    }
  }

  checkout(discountCode?: string): CheckoutResult {
    if (this.cart.length === 0) throw new Error("Cart is empty");

    let total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let discountAmount = 0;

    if (discountCode && this.discountCodes.includes(discountCode)) {
      discountAmount = total * this.DISCOUNT_PERCENTAGE;
      total -= discountAmount;
      this.discountCodes = this.discountCodes.filter(
        (code) => code !== discountCode
      );
    }

    this.orderCount++;
    const order: Order = {
      id: `order-${this.orderCount}`,
      items: [...this.cart],
      total,
      discountCode,
      discountAmount: discountAmount || undefined,
    };

    this.orders.push(order);
    this.cart = [];

    let generatedCouponCode: string | undefined;
    if (this.orderCount % this.NTH_ORDER === 0) {
      generatedCouponCode = this.generateDiscountCode();
    }

    return {
      order,
      generatedCouponCode,
    };
  }

  private generateDiscountCode(): string {
    const code = `DISCOUNT-${Math.random().toString(36).substring(7)}`;
    this.discountCodes.push(code);
    return code;
  }

  getAdminStats(): AdminStats {
    const totalItems = this.orders.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );
    const totalPurchaseAmount = this.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const totalDiscountAmount = this.orders.reduce(
      (sum, order) => sum + (order.discountAmount || 0),
      0
    );

    return {
      itemsPurchased: totalItems,
      totalPurchaseAmount,
      discountCodes: this.discountCodes,
      totalDiscountAmount,
    };
  }
}

export const store = new Store();
