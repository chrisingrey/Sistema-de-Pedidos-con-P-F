import Customer from "../models/customer.model";
import Product from "../models/product.model";

export default interface ProcessingContext {
  customer?: Customer;
  products: Product[];
}
