export default interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}
