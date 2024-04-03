interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: number;
  avatar_url: string;
  is_deleted: string;
}
interface Ads {
  id: number;
  title: string;
  main_image_url: string;
  description: string;
  price: number;
  phone: string;
  type: Type;
  town_id: number;
  user_id: number;
  category_id: number;
  created_at: string;
  is_published: boolean;
}

enum Type {
  sell,
  buy,
  rent,
}
