import React, { useRef, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { CartItem } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface PrintModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  printType: 'customer' | 'diein' | 'both';
}

const PrintModal: React.FC<PrintModalProps> = ({ items, total, onClose, printType }) => {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforePrint = () => {
      document.body.style.visibility = 'hidden';
      if (printRef.current) {
        printRef.current.style.visibility = 'visible';
      }
    };

    const handleAfterPrint = () => {
      document.body.style.visibility = 'visible';
      if (printRef.current) {
        printRef.current.style.visibility = 'visible';
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const handlePrint = async () => {
    try {
      // Create a plain serializable object
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          totalPrice: parseFloat(item.price) * item.quantity
        })),
        total: parseFloat(total.toFixed(2)),
        printType,
        timestamp: new Date().toISOString()
      };

      // Send order to server
      await api.post('/order', orderData);
      
      // Trigger print
      window.print();
      
      toast.success('Order submitted successfully');
      onClose();
    } catch (error) {
      console.error('Failed to submit order:', error);
      toast.error('Failed to submit order');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={printRef} className="bg-white rounded-lg w-full max-w-2xl mx-4 print:max-w-none print:mx-0">
        <div className="p-4 border-b flex justify-between items-center print:hidden">
          <h2 className="text-xl font-bold">Print Preview</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 print:text-xl print:text-center">
              Order Details - {printType.toUpperCase()}
            </h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Sr No</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="text-right py-2">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-bold">
              <span>{items.length} items</span>
              <span>Total Amount = ${total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {new Date().toLocaleString()}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print and Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;