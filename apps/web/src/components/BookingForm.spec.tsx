import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookingForm } from './BookingForm';

describe('BookingForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to find datetime inputs
  // Material-UI TextField with type="datetime-local" renders as inputs
  // Dialog renders in a portal, so we search in document, not container
  const getDateTimeInputs = () => {
    const searchContainer = document;
    
    // Strategy 1: Try to find by label text (most reliable)
    try {
      const startInput = screen.getByLabelText(/start date & time/i) as HTMLInputElement;
      const endInput = screen.getByLabelText(/end date & time/i) as HTMLInputElement;
      if (startInput && endInput) {
        return [startInput, endInput];
      }
    } catch (e) {
      // Continue to next strategy
    }

    // Strategy 2: Find all inputs in container and filter by type="datetime-local"
    const allInputs = Array.from(searchContainer.querySelectorAll('input')) as HTMLInputElement[];
    const datetimeInputs = allInputs.filter(input => input.type === 'datetime-local');
    if (datetimeInputs.length >= 2) {
      return datetimeInputs;
    }

    // Strategy 3: Find all inputs that are not buttons/hidden
    // Material-UI might render datetime-local as text inputs in tests
    const formInputs = allInputs.filter(input => {
      const type = input.type || '';
      return type !== 'button' && type !== 'submit' && type !== 'hidden' && 
             type !== 'checkbox' && type !== 'radio' && type !== 'file';
    });
    
    // If we have at least 3 inputs, the first is title, next two are datetime
    if (formInputs.length >= 3) {
      // Find title input to exclude it
      const titleInput = screen.queryByRole('textbox', { name: /meeting title/i }) as HTMLInputElement | null;
      if (titleInput) {
        const nonTitleInputs = formInputs.filter(input => input !== titleInput);
        if (nonTitleInputs.length >= 2) {
          return [nonTitleInputs[0], nonTitleInputs[1]];
        }
      }
      // Fallback: assume positions [1] and [2] are datetime inputs
      return [formInputs[1], formInputs[2]];
    }
    
    // Strategy 4: Try to find by helper text (last resort)
    try {
      const startHelper = screen.getByText(/when does the meeting start/i);
      const endHelper = screen.getByText(/when does the meeting end/i);
      if (startHelper && endHelper) {
        const startFormControl = startHelper.closest('.MuiFormControl-root');
        const endFormControl = endHelper.closest('.MuiFormControl-root');
        if (startFormControl && endFormControl) {
          const startInput = startFormControl.querySelector('input') as HTMLInputElement;
          const endInput = endFormControl.querySelector('input') as HTMLInputElement;
          if (startInput && endInput) {
            return [startInput, endInput];
          }
        }
      }
    } catch (e) {
      // Continue
    }
    
    return [];
  };

  it('validates required fields', async () => {
    render(
      <BookingForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Wait for dialog to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Create New Booking')).toBeInTheDocument();
    });

    // Wait for inputs to be rendered (Dialog renders in a portal, so use document)
    await waitFor(() => {
      const inputs = document.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });

    // Try to fill in datetime fields to pass HTML5 validation, but leave title empty
    const datetimeInputs = getDateTimeInputs();
    if (datetimeInputs.length >= 2) {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);
      const startValue = futureDate.toISOString().slice(0, 16);
      futureDate.setHours(futureDate.getHours() + 1);
      const endValue = futureDate.toISOString().slice(0, 16);
      
      fireEvent.change(datetimeInputs[0], { target: { value: startValue } });
      fireEvent.change(datetimeInputs[1], { target: { value: endValue } });
    }

    // Submit the form directly using fireEvent.submit to bypass HTML5 validation
    const form = document.querySelector('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Please enter a title for your booking')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates end time is after start time', async () => {
    render(
      <BookingForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Wait for dialog to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Create New Booking')).toBeInTheDocument();
    });

    // Wait for inputs to be rendered (Dialog renders in a portal)
    await waitFor(() => {
      const inputs = document.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });

    const titleInput = screen.getByRole('textbox', { name: /meeting title/i });
    const datetimeInputs = getDateTimeInputs();
    expect(datetimeInputs.length).toBeGreaterThanOrEqual(2);
    const startInput = datetimeInputs[0];
    const endInput = datetimeInputs[1];
    const submitButton = screen.getByText('Create Booking');

    fireEvent.change(titleInput, { target: { value: 'Test Meeting' } });
    
    // Use future dates: start at +3 hours, end at +2 hours (end before start)
    // Format for datetime-local: YYYY-MM-DDTHH:mm (local time, not UTC)
    const now = new Date();
    const startDate = new Date(now.getTime() + 3 * 60 * 60 * 1000); // +3 hours
    const endDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    
    // Format as local datetime string (YYYY-MM-DDTHH:mm)
    const formatLocalDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    const startValue = formatLocalDateTime(startDate);
    const endValue = formatLocalDateTime(endDate);
    
    // Use input event to properly trigger Material-UI onChange
    fireEvent.input(startInput, { target: { value: startValue } });
    fireEvent.input(endInput, { target: { value: endValue } });
    
    // Also trigger change event
    fireEvent.change(startInput, { target: { value: startValue } });
    fireEvent.change(endInput, { target: { value: endValue } });
    
    // Wait for state to update - verify inputs have the values
    await waitFor(() => {
      expect(startInput.value).toBe(startValue);
      expect(endInput.value).toBe(endValue);
    });
    
    // Wait a bit more for React state to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Submit the form directly instead of clicking button
    const form = document.querySelector('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText('End time must be after start time'),
      ).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <BookingForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Wait for dialog to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Create New Booking')).toBeInTheDocument();
    });

    // Wait for inputs to be rendered (Dialog renders in a portal)
    await waitFor(() => {
      const inputs = document.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });

    const titleInput = screen.getByRole('textbox', { name: /meeting title/i });
    const datetimeInputs = getDateTimeInputs();
    expect(datetimeInputs.length).toBeGreaterThanOrEqual(2);
    const startInput = datetimeInputs[0];
    const endInput = datetimeInputs[1];
    const submitButton = screen.getByText('Create Booking');

    fireEvent.change(titleInput, { target: { value: 'Test Meeting' } });
    
    // Use future dates to avoid validation errors
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);
    const startValue = futureDate.toISOString().slice(0, 16);
    futureDate.setHours(futureDate.getHours() + 1);
    const endValue = futureDate.toISOString().slice(0, 16);
    
    fireEvent.change(startInput, { target: { value: startValue } });
    fireEvent.change(endInput, { target: { value: endValue } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });
    expect(titleInput).toBeDisabled();
  });

  it('handles conflict error from API', async () => {
    mockOnSubmit.mockRejectedValue(
      new Error('Time slot conflicts with existing booking'),
    );

    render(
      <BookingForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Wait for dialog to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Create New Booking')).toBeInTheDocument();
    });

    // Wait for inputs to be rendered (Dialog renders in a portal)
    await waitFor(() => {
      const inputs = document.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });

    const titleInput = screen.getByRole('textbox', { name: /meeting title/i });
    const datetimeInputs = getDateTimeInputs();
    expect(datetimeInputs.length).toBeGreaterThanOrEqual(2);
    const startInput = datetimeInputs[0];
    const endInput = datetimeInputs[1];
    const submitButton = screen.getByText('Create Booking');

    fireEvent.change(titleInput, { target: { value: 'Test Meeting' } });
    
    // Use future dates to avoid validation errors
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);
    const startValue = futureDate.toISOString().slice(0, 16);
    futureDate.setHours(futureDate.getHours() + 1);
    const endValue = futureDate.toISOString().slice(0, 16);
    
    fireEvent.change(startInput, { target: { value: startValue } });
    fireEvent.change(endInput, { target: { value: endValue } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Time slot conflicts with existing booking'),
      ).toBeInTheDocument();
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <BookingForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
