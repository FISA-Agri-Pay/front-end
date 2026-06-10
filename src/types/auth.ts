export interface RegisterRequest {
  phone: string;
  name: string;
  address: string;
  addressDetail?: string;
  zipCode: string;
  residentId: string;
  password: string;
}
