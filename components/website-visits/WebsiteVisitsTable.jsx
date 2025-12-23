import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import ExportButton from '@/components/shared/ExportButton';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

export default function WebsiteVisitsTable({ visits, onUpdate, loading }) {
  const [user, setUser] = useState(null);

  useState(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const canModify = user && ['admin', 'manager'].includes(user.role);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this visit?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/website-visits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete visit');
      }

      onUpdate();
    } catch (error) {
      alert('Failed to delete visit: ' + error.message);
    }
  };

  const columns = [
    {
      header: 'IP Address',
      accessorKey: 'ip',
    },
    {
      header: 'Contact',
      accessorKey: 'owner_contact',
    },
    {
      header: 'Visits',
      accessorKey: 'number_of_visits',
    },
    {
      header: 'Duration',
      accessorKey: 'website_duration',
      cell: (row) => `${row.website_duration}s`,
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => formatDate(row.date),
    },
    {
      header: 'Time',
      accessorKey: 'time',
      cell: (row) => formatTime(row.time),
    },
  ];

  if (canModify) {
    columns.push({
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportButton data={visits} filename="website-visits" disabled={!visits || visits.length === 0} />
      </div>
      <DataTable columns={columns} data={visits} loading={loading} />
    </div>
  );
}