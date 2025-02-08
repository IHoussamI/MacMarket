export interface CartItem {
  cartId: number;
  items: {      
      productId: number;
      productName: string;
      price: number;
      quantity: number;
  };
  selected?: boolean; 
}
