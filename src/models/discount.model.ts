export default interface Discount {
  type: "membership" | "volume" | "amount"; // Categorizes the type of discount
  value: number; // The monetary value of the discount
  description: string; // A human-readable explanation of the discount
}
