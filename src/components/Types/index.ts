export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    images: string[];
    categoryId: string;
    quantity: number;
    condition: string;
    brandId: string;
    status: string;
    sellerId: string;
    createdAt: string;
    updatedAt: string;
    category: {
      id: string;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
    brand: {
      id: string;
      name: string;
      description: string;
      logo: string;
      createdAt: string;
      updatedAt: string;
    };
    seller: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      address: string;
    };
  }