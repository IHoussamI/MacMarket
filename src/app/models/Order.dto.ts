export interface OrderItemDTO {
    productName: string;
    unitPrice: number;
    quantity: number;
  }
  
  export interface OrderDTO {
    id: number;
    userId: number;
    totalAmount: number;
    orderDate: string;
    orderItems: OrderItemDTO[];
  }
  