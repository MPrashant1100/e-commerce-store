interface Item {
    name: string;
    price: number;
  }
  
  interface Order {
    orderNumber: number;
    items: Item[];
    totalAmount: number;
    discountedTotal: number;
  }
  
  let orders: Order[] = []; 
  let cart: Item[] = [];  
  let discountCodes: string[] = []; 
  let nextOrderNumber = 1; 
  
  // Function to increment the order number
  const incrementOrderNumber = (): number => {
    return nextOrderNumber++;
  };
  
  export { orders, cart, discountCodes, incrementOrderNumber };
  