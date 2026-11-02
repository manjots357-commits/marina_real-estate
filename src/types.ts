export interface PropertyLevel {
  levelNumber: string;
  name: string;
  description: string;
  sqFt: number;
  elevation: string;
  image: string;
  highlights: string[];
}

export interface Property {
  id: string;
  title: string;
  subTitle: string;
  location: string;
  country: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqFt: number;
  heroImage: string;
  gallery: string[];
  description: string;
  architecturalStyle: string;
  architect: string;
  levels?: PropertyLevel[];
  latitude: number;
  longitude: number;
  amenities: string[];
  featured?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface GroundingResult {
  text: string;
  links: GroundingLink[];
}
