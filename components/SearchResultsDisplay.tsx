import React from 'react';
import { SearchResult } from '../types';

interface SearchResultsDisplayProps {
  results: SearchResult | null;
  loading: boolean;
  error: string | null;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ results, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
        <p className="ml-4 text-xl text-gray-400">AI is thinking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-900 bg-opacity-30 rounded-lg text-center">
        <p className="font-semibold text-lg">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!results || !results.text) {
    return null;
  }

  const formatTextWithLineBreaks = (text: string) => {
    // Replace markdown list items for better rendering
    const formattedText = text.replace(/^- /gm, '• ');
    return formattedText.split('\n').map((line, index) => (
      <p key={index} className="mb-1 last:mb-0">{line}</p>
    ));
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-inner mt-4">
      <h3 className="text-xl font-bold text-purple-400 mb-4">AI's Findings:</h3>
      <div className="prose prose-invert max-w-none mb-6 leading-relaxed">
        {formatTextWithLineBreaks(results.text)}
      </div>

      {results.groundingChunks && results.groundingChunks.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-300 mb-3">Sources:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {results.groundingChunks.map((chunk, index) => (
              chunk.web && chunk.web.uri ? (
                <li key={`web-${index}`} className="text-gray-400">
                  <a
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                  >
                    {chunk.web.title || chunk.web.uri}
                  </a>
                </li>
              ) : chunk.maps && chunk.maps.uri ? (
                <li key={`maps-${index}`} className="text-gray-400">
                  <a
                    href={chunk.maps.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                  >
                    {chunk.maps.title || chunk.maps.uri} (Map)
                  </a>
                </li>
              ) : chunk.placeAnswerSources && chunk.placeAnswerSources.reviewSnippets.length > 0 ? (
                chunk.placeAnswerSources.reviewSnippets.map((review, reviewIndex) => (
                  <li key={`review-${index}-${reviewIndex}`} className="text-gray-400">
                    Review: <a
                      href={review.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                    >
                      {review.title || review.uri}
                    </a>
                  </li>
                ))
              ) : null
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay;
