import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookingList } from './BookingList';
import { BookingDto } from '@calendar-booking/shared';

describe('BookingList', () => {
  const mockOnCancel = jest.fn();

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
      <BookingList bookings={[]} onCancel={mockOnCancel} loading={false} />,
    );

    expect(
      screen.getByText('No bookings yet. Create your first booking!'),
    ).toBeInTheDocument();
  });

  it('renders all bookings', () => {
    render(
      <BookingList
        bookings={mockBookings}
        onCancel={mockOnCancel}
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
        loading={false}
      />,
    );

    const cancelButtons = screen.getAllByText('Cancel');
    expect(cancelButtons).toHaveLength(2);
  });

  it('triggers cancel action when button clicked', () => {
    render(
      <BookingList
        bookings={mockBookings}
        onCancel={mockOnCancel}
        loading={false}
      />,
    );

    const cancelButtons = screen.getAllByText('Cancel');
    fireEvent.click(cancelButtons[0]);

    expect(mockOnCancel).toHaveBeenCalledWith('1');
  });

  it('disables cancel buttons when loading', () => {
    render(
      <BookingList
        bookings={mockBookings}
        onCancel={mockOnCancel}
        loading={true}
      />,
    );

    const cancelButtons = screen.getAllByText('Cancel');
    cancelButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
