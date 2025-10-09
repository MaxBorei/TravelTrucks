export type Transmission = 'automatic' | 'manual';
export type Engine = 'diesel' | 'petrol' | 'hybrid';
export type Form = 'panelTruck' | 'fullyIntegrated' | 'alcove';

export type EquipmentKey =
  | 'AC'
  | 'kitchen'
  | 'bathroom'
  | 'TV'
  | 'refrigerator'
  | 'microwave'
  | 'gas'
  | 'water';

export interface CamperGalleryItem {
  thumb: string;
  original?: string;
}

export interface UpstreamReview {
  reviewer_name?: string;
  reviewer_rating: number; 
  comment?: string;
}

export interface Camper {
  id: string;
  name: string;
  price: number;
  rating: number;           
  location: string;
  description: string;
  form?: Form | string;

  length?: string;
  width?: string;
  height?: string;
  tank?: string;
  consumption?: string;

  AC?: boolean;
  bathroom?: boolean;
  kitchen?: boolean;
  TV?: boolean;
  radio?: boolean;
  refrigerator?: boolean;
  microwave?: boolean;
  gas?: boolean;
  water?: boolean;

  transmission: Transmission;
  engine: Engine;

  gallery?: CamperGalleryItem[];
  reviews?: UpstreamReview[];
}

export interface CampersQuery {
  page?: number;
  limit?: number;
  location?: string;
  transmission?: Transmission | '';
  engine?: Engine | '';
  vehicleType?: Form | '';     
  filters?: EquipmentKey[];    
  sort?: 'price' | 'rating' | '';
  order?: 'asc' | 'desc';
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
