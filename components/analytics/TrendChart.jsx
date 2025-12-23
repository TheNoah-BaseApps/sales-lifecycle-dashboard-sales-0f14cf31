import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export default function TrendChart({ data }) {
  if (!data || (!data.websiteVisits && !data.storeVisits && !data.signups)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No trend data available</p>
        </CardContent>
      </Card>
    );
  }

  // Combine all dates
  const allDates = new Set([
    ...(data.websiteVisits || []).map(d => d.date),
    ...(data.storeVisits || []).map(d => d.date),
    ...(data.signups || []).map(d => d.date),
  ]);

  const sortedDates = Array.from(allDates).sort();

  const getCountForDate = (dataArray, date) => {
    const item = dataArray?.find(d => d.date === date);
    return item ? item.count : 0;
  };

  const maxValue = Math.max(
    ...(data.websiteVisits || []).map(d => d.count),
    ...(data.storeVisits || []).map(d => d.count),
    ...(data.signups || []).map(d => d.count),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Website Visits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Store Visits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">Signups</span>
            </div>
          </div>

          <div className="space-y-3">
            {sortedDates.map((date, index) => {
              const websiteCount = getCountForDate(data.websiteVisits, date);
              const storeCount = getCountForDate(data.storeVisits, date);
              const signupCount = getCountForDate(data.signups, date);

              return (
                <div key={index} className="space-y-1">
                  <div className="text-xs text-gray-500">{formatDate(date)}</div>
                  <div className="flex gap-1">
                    <div
                      className="bg-blue-500 h-6 rounded"
                      style={{ width: `${(websiteCount / maxValue) * 100}%` }}
                      title={`Website: ${websiteCount}`}
                    />
                    <div
                      className="bg-green-500 h-6 rounded"
                      style={{ width: `${(storeCount / maxValue) * 100}%` }}
                      title={`Store: ${storeCount}`}
                    />
                    <div
                      className="bg-purple-500 h-6 rounded"
                      style={{ width: `${(signupCount / maxValue) * 100}%` }}
                      title={`Signups: ${signupCount}`}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>W: {websiteCount}</span>
                    <span>S: {storeCount}</span>
                    <span>U: {signupCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}