import { Product } from "../Modals/UpdateProductModal";

export interface IReview {
    id: string;
    rating: number;
    reviewText: string;
    createdAt: string;
    updatedAt: string;
    product: Product;
    user: IUser;
    status: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    image: string;
}

