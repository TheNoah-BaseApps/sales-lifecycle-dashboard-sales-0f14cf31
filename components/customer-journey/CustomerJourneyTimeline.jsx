import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/utils';
import { Globe, Store, UserCheck, Calendar } from 'lucide-react';

const eventIcons = {
  website_visit: Globe,
  store_visit: Store,
  signup: UserCheck,
};

const eventColors = {
  website_visit: 'border-blue-500 bg-blue-50',
  store_visit: 'border-green-500 bg-green-50',
  signup: 'border-purple-500 bg-purple-50',
};

export default function CustomerJourneyTimeline({ identifier }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (identifier) {
      fetchJourney();
    }
  }, [identifier]);

  const fetchJourney = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/contacts/journey/${encodeURIComponent(identifier)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Contact not found');
        }
        throw new Error('Failed to fetch customer journey');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching journey:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.events || data.events.length === 0) {
    return (
      <Alert>
        <AlertDescription>No journey data found for this contact</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journey Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-semibold">{data.contact.contact_identifier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Website Visits</p>
              <p className="font-semibold">{data.summary.totalWebsiteVisits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Store Visits</p>
              <p className="font-semibold">{data.summary.totalStoreVisits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Signups</p>
              <p className="font-semibold">{data.summary.totalSignups}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {data.events.map((event, index) => {
              const Icon = eventIcons[event.type] || Calendar;
              const colorClass = eventColors[event.type] || 'border-gray-500 bg-gray-50';

              return (
                <div key={index} className="relative pl-12">
                  <div className={`absolute left-0 p-2 rounded-full border-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold capitalize">
                        {event.type.replace('_', ' ')}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(`${event.date}T${event.time}`)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      {event.type === 'website_visit' && (
                        <>
                          <p>IP: {event.data.ip}</p>
                          <p>Pages: {event.data.page_visits}</p>
                          <p>Duration: {event.data.website_duration}s</p>
                          <p>Location: {event.data.location}</p>
                        </>
                      )}
                      {event.type === 'store_visit' && (
                        <>
                          <p>Location: {event.data.location}</p>
                          <p>Visits: {event.data.number_of_visits}</p>
                        </>
                      )}
                      {event.type === 'signup' && (
                        <>
                          <p>Username: {event.data.username}</p>
                          <p>Email: {event.data.email}</p>
                          <p>Location: {event.data.location}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}