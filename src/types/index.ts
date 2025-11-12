export interface Booth {
  id: string;
  number: string;
  x: number;
  y: number;
  width: number;
  height: number;
  price: number;
  size: '1x1' | '2x1'; // Dostępne rozmiary stoisk
  status: 'available' | 'reserved' | 'occupied';
  company?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  vat: number; // VAT jako procent, np. 23 dla 23%
}

export interface InvoiceAddress {
  companyName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  nip: string;
}

export interface Reservation {
  id: string;
  boothId: string;
  companyName: string;
  industry?: string;
  website?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  invoiceAddress: InvoiceAddress;
  services: string[];
  totalAmount: number;
  createdAt: Date;
  agreedToTerms: boolean;
  agreedToParticipation: boolean;
  agreedToConditions: boolean;
}

export interface ReservationFormData {
  companyName: string;
  industry?: string;
  website?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  invoiceAddress: InvoiceAddress;
  services: string[];
  agreedToTerms: boolean;
  agreedToParticipation: boolean;
  agreedToConditions: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}
