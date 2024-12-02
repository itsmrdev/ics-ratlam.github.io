import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingCart, Trash2, Printer } from 'lucide-react';
import PrintModal from './PrintModal';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printType, setPrintType] = useState<'customer' | 'diein' | 'both'>('customer');

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handlePrint = (type: 'customer' | 'diein' | 'both') => {
    setPrintType(type);
    setPrintModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Shopping Cart
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex justify-between items-center text-lg font-bold mb-4">
            <span>Total:</span>
            <span>${state.total.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handlePrint('customer')}
              className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print Cust
            </button>
            <button
              onClick={() => handlePrint('diein')}
              className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print Die-in
            </button>
            <button
              onClick={() => handlePrint('both')}
              className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print Both
            </button>
          </div>
        </div>
      </div>

      {printModalOpen && (
        <PrintModal
          items={state.items}
          total={state.total}
          onClose={() => setPrintModalOpen(false)}
          printType={printType}
        />
      )}
    </>
  );
};

export default Cart;