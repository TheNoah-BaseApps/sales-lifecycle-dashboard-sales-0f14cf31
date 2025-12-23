import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { Globe, Store, UserCheck } from 'lucide-react';

const activityIcons = {
  website_visit: Globe,
  store_visit: Store,
  signup: UserCheck,
};

const activityColors = {
  website_visit: 'text-blue-600 bg-blue-100',
  store_visit: 'text-green-600 bg-green-100',
  signup: 'text-purple-600 bg-purple-100',
};

const activityLabels = {
  website_visit: 'Website Visit',
  store_visit: 'Store Visit',
  signup: 'Customer Signup',
};

export default function ActivityFeed({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || Globe;
            const colorClass = activityColors[activity.type] || 'text-gray-600 bg-gray-100';
            const label = activityLabels[activity.type] || activity.type;

            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.identifier}</p>
                  <p className="text-xs text-gray-500">
                    {activity.location} • {formatDateTime(activity.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}