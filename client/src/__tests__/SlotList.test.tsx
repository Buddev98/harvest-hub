import { render, screen } from '@testing-library/react';
import SlotList from '../components/SlotList';

const mockSlots = [
  { date: '2025-04-05', timeSlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'] },
  { date: '2025-04-06', timeSlots: ['01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM'] },
];

describe('SlotList Component', () => {
  test('renders without crashing', () => {
    render(<SlotList slots={mockSlots} />);
  });

  test('displays the correct number of slots', () => {
    render(<SlotList slots={mockSlots} />);
    const slotDates = screen.getAllByRole('heading', { level: 3 });
    expect(slotDates).toHaveLength(mockSlots.length);
  });

  test('displays the correct date and time slots', () => {
    render(<SlotList slots={mockSlots} />);
    mockSlots.forEach((slot) => {
      expect(screen.getByText(slot.date)).toBeInTheDocument();
      slot.timeSlots.forEach((timeSlot) => {
        expect(screen.getByText(timeSlot)).toBeInTheDocument();
      });
    });
  });
});
