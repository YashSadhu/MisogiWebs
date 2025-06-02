import React, { useEffect, useState } from 'react';
import { useHackathonStore } from '../store/hackathonStore';
import HackathonCard from '../components/hackathons/HackathonCard';
import { Search } from 'lucide-react';
import Input from '../components/ui/Input';

const HomePage: React.FC = () => {
  const { hackathons, isLoading, error, fetchHackathons } = useHackathonStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);
  
  const filteredHackathons = hackathons.filter(hackathon => 
    hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Your Next Hackathon Challenge
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Browse upcoming hackathons, form teams, and build amazing projects together.
        </p>
      </div>
      
      <div className="mb-8 max-w-md mx-auto">
        <Input
          placeholder="Search hackathons by title, theme, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-5 w-5" />}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => fetchHackathons()}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
          
          {filteredHackathons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hackathons found matching your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;