// Define la estructura de un producto financiero
export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string; // ISO format
  date_revision: string;
}