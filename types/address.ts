export interface AddressData {
  formatted: string;
  components: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId: string;
}

export interface AddressAutocompleteProps {
  value: string;
  onChange: (address: AddressData) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onError?: (error: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface GooglePlaceResult {
  place_id: string;
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GooglePlacesResponse {
  predictions: Array<{
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }>;
  status: string;
}
