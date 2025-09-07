import Address from "./address.model";

export default interface Customer {
  id: string;
  name: string;
  email: string;
  membership: "bronze" | "silver" | "gold" | "platinum";
  address: Address;
  isActive: boolean;
}
