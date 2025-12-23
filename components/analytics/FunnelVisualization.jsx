import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FunnelVisualization({ data }) {
  if (!data || !data.stages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No funnel data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxVisitors = Math.max(...data.stages.map(s => s.uniqueVisitors));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.stages.map((stage, index) => {
            const width = maxVisitors > 0 ? (stage.uniqueVisitors / maxVisitors) * 100 : 0;
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
            const bgColor = colors[index % colors.length];

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stage.uniqueVisitors} ({stage.conversionRate.toFixed(2)}%)
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-8">
                  <div
                    className={`${bgColor} h-8 rounded-full flex items-center justify-end px-4 transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {stage.totalVisits} total
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data.metrics && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Conversion Rates</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{data.metrics.websiteToStore}%</p>
                <p className="text-xs text-gray-500">Website → Store</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{data.metrics.storeToSignup}%</p>
                <p className="text-xs text-gray-500">Store → Signup</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{data.metrics.overallConversion}%</p>
                <p className="text-xs text-gray-500">Overall</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}