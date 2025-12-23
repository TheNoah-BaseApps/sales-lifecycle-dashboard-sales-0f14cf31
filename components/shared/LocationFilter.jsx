import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

export default function LocationFilter({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Location
      </Label>
      <Input
        id="location"
        type="text"
        placeholder="Filter by location..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}