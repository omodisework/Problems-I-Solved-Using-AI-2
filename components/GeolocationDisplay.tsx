import React, { useEffect, useState, useCallback } from 'react';
import { GeolocationState } from '../types';
import { NOMINATIM_REVERSE_API } from '../constants';
import LoadingSpinner from './LoadingSpinner';
// Added Button import
import Button from './Button';

interface GeolocationDisplayProps {
  onLocationUpdate: (latitude: number, longitude: number, country: string) => void;
  geolocationState: GeolocationState;
  setGeolocationState: React.Dispatch<React.SetStateAction<GeolocationState>>;
}

const GeolocationDisplay: React.FC<GeolocationDisplayProps> = ({
  onLocationUpdate,
  geolocationState,
  setGeolocationState,
}) => {
  const fetchCountryFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`${NOMINATIM_REVERSE_API}&lat=${latitude}&lon=${longitude}`);
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.statusText}`);
      }
      const data = await response.json();
      const country = data.address?.country || 'Unknown Country';
      setGeolocationState(prevState => ({
        ...prevState,
        country,
        loading: false,
        error: null,
      }));
      onLocationUpdate(latitude, longitude, country);
    } catch (error: any) {
      console.error('Reverse geocoding error:', error);
      setGeolocationState(prevState => ({
        ...prevState,
        country: null,
        loading: false,
        error: `Could not determine country: ${error.message}`,
      }));
    }
  }, [onLocationUpdate, setGeolocationState]);

  const getUserLocation = useCallback(() => {
    setGeolocationState(prevState => ({ ...prevState, loading: true, error: null }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeolocationState(prevState => ({
            ...prevState,
            latitude,
            longitude,
          }));
          fetchCountryFromCoordinates(latitude, longitude);
        },
        (error) => {
          let errorMessage = 'Geolocation access denied or unavailable.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Please enable location services for this site.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out.';
              break;
            default:
              errorMessage = `An unknown geolocation error occurred: ${error.message}`;
          }
          setGeolocationState(prevState => ({
            ...prevState,
            loading: false,
            error: errorMessage,
            latitude: null,
            longitude: null,
            country: null,
          }));
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGeolocationState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
        latitude: null,
        longitude: null,
        country: null,
      }));
    }
  }, [fetchCountryFromCoordinates, setGeolocationState]);

  useEffect(() => {
    if (!geolocationState.country && !geolocationState.loading && !geolocationState.error) {
      getUserLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geolocationState.country, geolocationState.loading, geolocationState.error]); // Only run once on mount or if state indicates a retry is needed

  return (
    <div className="text-center p-4 bg-gray-800 rounded-lg shadow-inner mb-6">
      {geolocationState.loading && (
        <LoadingSpinner />
      )}
      {geolocationState.error && (
        <div className="text-red-400 mb-2">
          <p>{geolocationState.error}</p>
          <Button onClick={getUserLocation} className="mt-2 text-sm bg-blue-600 hover:bg-blue-700">
            Retry Geolocation
          </Button>
        </div>
      )}
      {geolocationState.country && (
        <p className="text-lg font-medium">
          Searching in: <span className="text-purple-400">{geolocationState.country}</span>
        </p>
      )}
      {!geolocationState.loading && !geolocationState.country && !geolocationState.error && (
        <p className="text-gray-400">Waiting for location permission...</p>
      )}
    </div>
  );
};

export default GeolocationDisplay;