export interface UserInfo {
  name: string;
  email: string;
}

export interface LoginResponse {
  user_info: UserInfo;
  token: string;
}

export interface Item {
  id: string;
  name: string;
  detail: string;
  price: string;
  category: string;
  unique_number: string;
}

export interface CartItem extends Item {
  quantity: number;
}