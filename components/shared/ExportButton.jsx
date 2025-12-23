import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

export default function ExportButton({ data, filename, disabled }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    try {
      exportToCSV(data, filename);
    } catch (error) {
      alert('Failed to export data');
      console.error('Export error:', error);
    }
  };

  return (
    <Button onClick={handleExport} disabled={disabled} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}