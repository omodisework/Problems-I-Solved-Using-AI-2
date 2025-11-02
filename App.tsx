import React, { useState, useCallback } from 'react';
import { GeolocationState, SearchResult, ApiKeyError } from './types';
import { searchDesigners } from './services/geminiService';
import GeolocationDisplay from './components/GeolocationDisplay';
import SearchResultsDisplay from './components/SearchResultsDisplay';
import Button from './components/Button';
import ApiKeyPrompt from './components/ApiKeyPrompt';

const App: React.FC = () => {
  const [geolocationState, setGeolocationState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    country: null,
    error: null,
    loading: true,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<ApiKeyError>({ isError: false, message: '' });

  const handleLocationUpdate = useCallback((
    latitude: number,
    longitude: number,
    country: string
  ) => {
    setGeolocationState(prevState => ({ ...prevState, latitude, longitude, country, loading: false, error: null }));
    setSearchQuery(`Find professional graphic designers and their portfolios or agencies`);
  }, []);

  const handleApiKeyPromptClose = useCallback(() => {
    setApiKeyError({ isError: false, message: '' });
  }, []);

  const handleSearch = useCallback(async () => {
    if (!geolocationState.country) {
      setSearchError('Please allow geolocation and wait for your country to be determined.');
      return;
    }
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query.');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const results = await searchDesigners(searchQuery, geolocationState.country, (errorMsg) => {
        if (errorMsg.includes("Requested entity was not found.")) {
          setApiKeyError({ isError: true, message: errorMsg });
        } else {
          setSearchError(errorMsg);
        }
      });
      setSearchResults(results);
    } catch (error: any) {
      console.error('Search failed:', error);
      setSearchError(`Failed to fetch results: ${error.message || 'Unknown error'}`);
    } finally {
      setSearchLoading(false);
    }
  }, [geolocationState.country, searchQuery]);

  return (
    <div className="relative flex flex-col h-full">
      {apiKeyError.isError && (
        <ApiKeyPrompt onApiKeySelected={handleApiKeyPromptClose} errorMessage={apiKeyError.message} />
      )}

      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 drop-shadow-lg">
        AI Graphic Designer Finder
      </h1>

      <GeolocationDisplay
        onLocationUpdate={handleLocationUpdate}
        geolocationState={geolocationState}
        setGeolocationState={setGeolocationState}
      />

      <div className="flex-grow overflow-y-auto custom-scrollbar p-2 -mx-2">
        <SearchResultsDisplay
          results={searchResults}
          loading={searchLoading}
          error={searchError}
        />
        {!searchLoading && !searchError && !searchResults && (
          <p className="text-center text-gray-500 mt-8">
            Enter a query and click "Find Designers" to get started!
          </p>
        )}
      </div>

      <div className="sticky bottom-0 bg-gray-950 p-4 border-t border-gray-700 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 rounded-b-lg">
        <input
          type="text"
          className="flex-grow p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
          placeholder="e.g., UI/UX design agencies, freelance illustrators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          disabled={geolocationState.loading || !geolocationState.country || searchLoading}
        />
        <Button
          onClick={handleSearch}
          loading={searchLoading}
          disabled={geolocationState.loading || !geolocationState.country || !searchQuery.trim()}
          className="w-full sm:w-auto min-w-[150px]"
        >
          Find Designers
        </Button>
      </div>
    </div>
  );
};

export default App;
