import React from 'react';
import { Item } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { dispatch } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
      <p className="text-gray-600 mt-2 text-sm line-clamp-2 flex-grow">{item.detail}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-blue-600 font-bold">${item.price}</span>
        <span className="text-sm text-gray-500">{item.category}</span>
      </div>
      <button
        onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
        className="mt-4 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </button>
    </div>
  );
};

export default ItemCard;