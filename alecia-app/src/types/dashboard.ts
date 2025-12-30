
export interface TransportItem {
  type: 'car' | 'train' | 'plane';
  destination: string;
  time: string;
  status?: string;
}

export interface OfficeData {
  city: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  transport: {
    items: TransportItem[];
  };
}
