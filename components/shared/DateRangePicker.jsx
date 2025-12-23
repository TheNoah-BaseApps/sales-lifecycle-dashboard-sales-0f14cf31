import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const handleStartDateChange = (e) => {
    onChange({
      start: e.target.value,
      end: endDate,
    });
  };

  const handleEndDateChange = (e) => {
    onChange({
      start: startDate,
      end: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
    </div>
  );
}