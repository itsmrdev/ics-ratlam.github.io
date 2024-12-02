import React, { useEffect, useState } from 'react';
import { getItems } from '../services/api';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import Cart from '../components/Cart';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
        toast.error('Failed to fetch items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-10">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Shop Items</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      <div className="pt-32 fixed inset-0 flex">
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found matching your search.</p>
            </div>
          )}
        </main>
        
        <aside className="w-[30%] min-w-[350px] border-l bg-gray-50 overflow-y-auto">
          <div className="p-4 h-full">
            <Cart />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;