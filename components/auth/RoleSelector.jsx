import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const roles = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features and user management' },
  { value: 'manager', label: 'Manager', description: 'Full CRUD access to all workflows' },
  { value: 'analyst', label: 'Analyst', description: 'Read-only access to workflows and analytics' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to dashboard summary' },
];

export default function RoleSelector({ value, onChange, disabled }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role *</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              <div>
                <p className="font-medium">{role.label}</p>
                <p className="text-xs text-gray-500">{role.description}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}