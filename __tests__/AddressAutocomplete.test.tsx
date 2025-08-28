import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { AddressData } from '@/types/address';

// Mock fetch
global.fetch = jest.fn();

// Mock the debounce function
jest.mock('@/lib/address-validation', () => ({
  ...jest.requireActual('@/lib/address-validation'),
  debounce: (fn: any) => fn, // Remove debouncing for tests
}));

const mockAddressData: AddressData = {
  formatted: '123 Main St, New York, NY 10001, USA',
  components: {
    street1: '123 Main St',
    street2: undefined,
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US'
  },
  coordinates: {
    lat: 40.7128,
    lng: -74.0060
  },
  placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA'
};

const mockSuggestions = {
  predictions: [
    {
      place_id: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
      description: '123 Main St, New York, NY, USA',
      structured_formatting: {
        main_text: '123 Main St',
        secondary_text: 'New York, NY, USA'
      }
    }
  ],
  status: 'OK'
};

const mockPlaceDetails = {
  place_id: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
  formatted_address: '123 Main St, New York, NY 10001, USA',
  address_components: [
    { long_name: '123', short_name: '123', types: ['street_number'] },
    { long_name: 'Main St', short_name: 'Main St', types: ['route'] },
    { long_name: 'New York', short_name: 'New York', types: ['locality'] },
    { long_name: 'New York', short_name: 'NY', types: ['administrative_area_level_1'] },
    { long_name: '10001', short_name: '10001', types: ['postal_code'] },
    { long_name: 'United States', short_name: 'US', types: ['country'] }
  ],
  geometry: {
    location: {
      lat: 40.7128,
      lng: -74.0060
    }
  }
};

describe('AddressAutocomplete', () => {
  const mockOnChange = jest.fn();
  const mockOnError = jest.fn();
  const mockOnLoadingChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders with placeholder text', () => {
    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
        placeholder="Enter address..."
      />
    );

    expect(screen.getByPlaceholderText('Enter address...')).toBeInTheDocument();
  });

  it('shows loading state when fetching suggestions', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuggestions
    });

    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
        onLoadingChange={mockOnLoadingChange}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, '123 Main');

    await waitFor(() => {
      expect(mockOnLoadingChange).toHaveBeenCalledWith(true);
    });
  });

  it('displays suggestions when user types', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuggestions
    });

    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, '123 Main');

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('New York, NY, USA')).toBeInTheDocument();
    });
  });

  it('handles suggestion selection', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlaceDetails
      });

    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, '123 Main');

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    const suggestion = screen.getByText('123 Main St');
    await userEvent.click(suggestion);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(mockAddressData);
    });
  });

  it('handles keyboard navigation', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuggestions
    });

    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, '123 Main');

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    // Test arrow down navigation
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const suggestion = screen.getByRole('option', { selected: true });
    expect(suggestion).toHaveClass('bg-orange-50');

    // Test arrow up navigation
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(suggestion).not.toHaveClass('bg-orange-50');

    // Test escape key
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
        onError={mockOnError}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, '123 Main');

    await waitFor(() => {
      expect(screen.getByText(/Failed to load address suggestions/)).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith('API Error');
    });
  });

  it('validates required field', () => {
    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
        required
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeRequired();
  });

  it('disables input when disabled prop is true', () => {
    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
        disabled
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <AddressAutocomplete
        value=""
        onChange={mockOnChange}
        placeholder="Enter address..."
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-label', 'Address input with autocomplete');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('closes suggestions when clicking outside', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuggestions
    });

    render(
      <div>
        <AddressAutocomplete
          value=""
          onChange={mockOnChange}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, '123 Main');

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const outside = screen.getByTestId('outside');
    await userEvent.click(outside);

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
