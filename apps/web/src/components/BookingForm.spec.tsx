import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookingForm } from './BookingForm';

describe('BookingForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates required fields', async () => {
    render(
      <BookingForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />,
    );

    const submitButton = screen.getByText('Create Booking');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates end time is after start time', async () => {
    render(
      <BookingForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />,
    );

    const titleInput = screen.getByLabelText('Title');
    const startInput = screen.getByLabelText('Start Time');
    const endInput = screen.getByLabelText('End Time');
    const submitButton = screen.getByText('Create Booking');

    fireEvent.change(titleInput, { target: { value: 'Test Meeting' } });
    fireEvent.change(startInput, {
      target: { value: '2025-12-20T15:00' },
    });
    fireEvent.change(endInput, { target: { value: '2025-12-20T14:00' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('End time must be after start time'),
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', () => {
    render(
      <BookingForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />,
    );

    expect(screen.getByText('Checking availability...')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeDisabled();
  });

  it('handles conflict error from API', async () => {
    mockOnSubmit.mockRejectedValue(
      new Error('Time slot conflicts with existing booking'),
    );

    render(
      <BookingForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />,
    );

    const titleInput = screen.getByLabelText('Title');
    const startInput = screen.getByLabelText('Start Time');
    const endInput = screen.getByLabelText('End Time');
    const submitButton = screen.getByText('Create Booking');

    fireEvent.change(titleInput, { target: { value: 'Test Meeting' } });
    fireEvent.change(startInput, {
      target: { value: '2025-12-20T14:00' },
    });
    fireEvent.change(endInput, { target: { value: '2025-12-20T15:00' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Time slot conflicts with existing booking'),
      ).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <BookingForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />,
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
