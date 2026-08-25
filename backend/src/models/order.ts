export interface Order {
  id: string;
  code: string;
  client: string;
  product: string;
  quantity: number;
  sector_id: number;
  status: 'pending' | 'active' | 'terminated';
  position: number;
  updated_at: string;
}
