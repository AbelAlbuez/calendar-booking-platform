import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookingList } from './BookingList';
import { BookingDto } from '@calendar-booking/shared';

describe('BookingList', () => {
  const mockOnCancel = jest.fn();
  const mockOnRefresh = jest.fn();

  const mockBookings: BookingDto[] = [
    {
      id: '1',
      userId: 'user-123',
      title: 'Team Meeting',
      startUtc: '2025-12-20T14:00:00Z',
      endUtc: '2025-12-20T15:00:00Z',
      status: 'Active',
      createdAt: '2025-01-18T10:00:00Z',
      updatedAt: '2025-01-18T10:00:00Z',
    },
    {
      id: '2',
      userId: 'user-123',
      title: 'Lunch',
      startUtc: '2025-12-20T12:00:00Z',
      endUtc: '2025-12-20T13:00:00Z',
      status: 'Active',
      createdAt: '2025-01-18T09:00:00Z',
      updatedAt: '2025-01-18T09:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no bookings', () => {
    render(
      <BookingList bookings={[]} onCancel={mockOnCancel} onRefresh={jest.fn()} loading={false} />,
    );

    expect(screen.getByText('No bookings yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first booking to get started!')).toBeInTheDocument();
  });

  it('renders all bookings', () => {
    render(
      <BookingList
        bookings={mockBookings}
        onCancel={mockOnCancel}
        onRefresh={mockOnRefresh}
        loading={false}
      />,
    );

    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  it('shows cancel button for active bookings', () => {
    render(
      <BookingList
        bookings={mockBookings}
        onCancel={mockOnCancel}
        onRefresh={mockOnRefresh}
        loading={false}
      />,
    );

    // Find delete icon buttons by testId
    const deleteIcons = screen.getAllByTestId('DeleteOutlineIcon');
    expect(deleteIcons).toHaveLength(2);
  });

  it('triggers cancel action when button clicked', async () => {
    render(
      <BookingList
        bookings={mockBookings}
        onCancel={mockOnCancel}
        onRefresh={mockOnRefresh}
        loading={false}
      />,
    );

    // Find delete icon buttons and click the first one
    const deleteIcons = screen.getAllByTestId('DeleteOutlineIcon');
    // Click the parent button element
    fireEvent.click(deleteIcons[0].closest('button')!);

    // The component opens a dialog, so we need to confirm the cancellation
    const confirmButton = await screen.findByText('Yes, Cancel Booking');
    fireEvent.click(confirmButton);

    expect(mockOnCancel).toHaveBeenCalledWith('1');
  });

  it('disables cancel buttons when loading', () => {
    render(
      <BookingList
        bookings={mockBookings}
        onCancel={mockOnCancel}
        onRefresh={mockOnRefresh}
        loading={true}
      />,
    );

    // Find delete icon buttons and check their parent buttons are disabled
    const deleteIcons = screen.getAllByTestId('DeleteOutlineIcon');
    deleteIcons.forEach((icon) => {
      const button = icon.closest('button');
      expect(button).toBeDisabled();
    });
  });
});
