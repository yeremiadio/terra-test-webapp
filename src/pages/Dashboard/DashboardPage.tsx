import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { DatePicker } from '@/components/DatePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetCoordinatesByImeiQuery,
  useGetDashboardMetricsQuery,
  useGetGpsDataByImeiQuery,
  useGetLatestGpsAllQuery,
} from '@/stores/gpsStore/gpsStoreApi';
import { GoogleMaps } from '@/components/GoogleMaps';
import { Polyline } from '@react-google-maps/api';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';
import MovementStatusChart from './_components/MovementStatusChart';
import { ChartData } from 'chart.js';
import { Button } from '@/components/ui/button';
import { terraColors } from '@/utils/constants/colors';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/configs/routes';

dayjs.extend(duration);

interface LatLng {
  lat: number;
  lng: number;
}

interface SnappedPointResponse {
  location: {
    latitude: number;
    longitude: number;
  };
  originalIndex?: number;
  placeId?: string;
}

type Props = {};

const DashboardPage = (_: Props) => {
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({ from: new Date('2025-04-13'), to: new Date('2025-04-30') });
  const [selectedImei, setSelectedImei] = useState<string>('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const [snappedPoints, setSnappedPoints] = useState<LatLng[]>([]);
  const { data: gpsData, isLoading } = useGetLatestGpsAllQuery({
    startDate: selectedDateRange?.from,
    endDate: selectedDateRange?.to,
  });
  const { data: gpsImei } = useGetGpsDataByImeiQuery(selectedImei, {
    skip: !selectedImei,
  });
  const { data: dashboardMetrics } = useGetDashboardMetricsQuery(
    {
      imei: selectedImei,
      startDate: selectedDateRange?.from,
      endDate: selectedDateRange?.to,
    },
    { skip: !selectedImei },
  );
  const { data: dataCoordinates } = useGetCoordinatesByImeiQuery(
    {
      imei: selectedImei,
      startDate: selectedDateRange?.from,
      endDate: selectedDateRange?.to,
    },
    { skip: !selectedImei },
  );

  const MAX_POINTS_PER_REQUEST = 100;

  const snapToRoads = async (
    points: LatLng[],
    apiKey: string,
  ): Promise<LatLng[]> => {
    // Batch the points if more than 100 points (Roads API limit)
    const batches: LatLng[][] = [];
    for (let i = 0; i < points.length; i += MAX_POINTS_PER_REQUEST) {
      batches.push(points.slice(i, i + MAX_POINTS_PER_REQUEST));
    }

    const results: LatLng[] = [];

    for (const batch of batches) {
      const pathParam = batch.map((p) => `${p.lat},${p.lng}`).join('|');
      const url = `https://roads.googleapis.com/v1/snapToRoads?path=${encodeURIComponent(
        pathParam,
      )}&interpolate=true&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.snappedPoints) {
          const snappedPointsBatch: LatLng[] = data.snappedPoints.map(
            (p: SnappedPointResponse) => ({
              lat: p.location.latitude,
              lng: p.location.longitude,
            }),
          );
          results.push(...snappedPointsBatch);
        } else {
          console.error('No snapped points returned for batch', data);
          results.push(...batch); // fallback to raw points
        }
      } catch (error) {
        console.error('Error calling Snap to Roads API:', error);
        results.push(...batch); // fallback to raw points
      }
    }

    return results;
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (gpsData?.data && gpsData.data.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      gpsData.data.forEach((gps) => {
        bounds.extend({ lat: gps.lat, lng: gps.lng });
      });
      map.fitBounds(bounds);
    }
  };

  const imeis = useMemo(
    () =>
      gpsData?.data.map((item) => ({
        label: item.imei,
        value: item.imei,
      })) || [],
    [gpsData?.data],
  );

  const movementStatusChartData = useMemo<
    ChartData<'doughnut', number[], string>
  >(() => {
    if (!dashboardMetrics?.baseMetrics.movementStats)
      return { labels: [], datasets: [] };

    const movementStats = dashboardMetrics.baseMetrics.movementStats;
    const labelsRaw = Object.keys(movementStats);
    const dataRaw = Object.values(movementStats);

    // Filter out negative values and their labels
    const filtered = labelsRaw
      .map((label, idx) => ({ label, value: dataRaw[idx] }))
      .filter((item) => item.value >= 0);

    const labels = filtered.map(
      (item) =>
        item.label
          .replace(/([A-Z])/g, ' $1') // insert space before uppercase
          .replace(/^./, (str) => str.toUpperCase()), // capitalize first letter
    );
    const data = filtered.map((item) => item.value);
    const colors = terraColors;
    const backgroundColor = labels.map((_, idx) => colors[idx % colors.length]);

    return {
      labels,
      datasets: [
        {
          label: 'GPS Movement Status',
          data,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
        },
      ],
    };
  }, [dashboardMetrics?.baseMetrics.movementStats]);

  useEffect(() => {
    const fetchSnappedPoints = async () => {
      if (
        !dataCoordinates ||
        (!!dataCoordinates && dataCoordinates.length === 0)
      )
        return;
      const snapped = await snapToRoads(
        dataCoordinates,
        import.meta.env.VITE_MAPS_API_KEY,
      );
      setSnappedPoints(snapped);
    };

    fetchSnappedPoints();
  }, [dataCoordinates]);

  useEffect(() => {
    if (
      mapRef.current &&
      Array.isArray(dataCoordinates) &&
      dataCoordinates.length > 1
    ) {
      const bounds = new window.google.maps.LatLngBounds();
      dataCoordinates.forEach((gps) => {
        bounds.extend({ lat: gps.lat, lng: gps.lng });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [dataCoordinates]);

  useEffect(() => {
    function getDefaultImei() {
      if (gpsData?.data && gpsData.data.length > 0 && !selectedImei) {
        const firstImei = gpsData.data[0].imei;
        setSelectedImei(firstImei);
      }
    }
    getDefaultImei();
  }, [gpsData?.data, selectedImei]);

  const metricsMap = useMemo(() => {
    if (!dashboardMetrics?.baseMetrics) return [];
    const dur = dayjs.duration(
      dashboardMetrics.baseMetrics.totalDuration || 0,
      'seconds',
    );
    const formattedDuration = `${dur.days() > 0 ? `${dur.days()} d ` : ''}${dur.hours()} h ${dur.minutes()} min`;
    const list = [
      {
        title: 'Total Distance',
        value: dashboardMetrics.baseMetrics.totalDistance.toLocaleString() || 0,
        unit: 'km',
      },
      {
        title: 'Total Duration',
        value: formattedDuration,
        unit: '',
      },
      {
        title: 'Average Speed',
        value: dashboardMetrics.baseMetrics.averageSpeed.toLocaleString() || 0,
        unit: 'km/h',
      },
      {
        title: 'Maximum Speed',
        value: dashboardMetrics.baseMetrics.maxSpeed.toLocaleString() || 0,
        unit: 'km/h',
      },
      {
        title: 'Minimum Speed',
        value: dashboardMetrics.baseMetrics.minSpeed.toLocaleString() || 0,
        unit: 'km/h',
      },
    ];
    return list;
  }, [dashboardMetrics?.baseMetrics]);

  return (
    <div className="p-2 lg:p-4 my-4">
      <div className="flex flex-row gap-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="font-semibold pb-1">Hello there!👋</h2>
          <p>Monitor your Farm operations with real-time insights</p>
        </div>
        <div className="flex flex-row gap-2 flex-wrap items-center justify-end">
          <Select value={selectedImei} onValueChange={setSelectedImei}>
            <SelectTrigger
              disabled={isLoading}
              className="w-full lg:w-[180px] bg-white"
            >
              <SelectValue
                placeholder={isLoading ? 'Loading...' : 'Select Fleet...'}
              />
            </SelectTrigger>
            <SelectContent>
              {imeis.map((imei) => (
                <SelectItem key={imei.value} value={imei.value}>
                  {imei.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker
            onChange={(date) => setSelectedDateRange(date)}
            value={selectedDateRange}
            defaultMonth={new Date('2025-04-01')}
            disabled={(date) =>
              date > new Date('2025-04-30') || date < new Date('2025-04-12')
            }
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Total Devices */}
          {metricsMap.map(({ title, unit, value }) => (
            <div
              key={title}
              className="bg-white p-4 rounded-md shadow flex flex-col items-start"
            >
              <span className="text-xs text-gray-500 mb-1">{title}</span>
              <span className="text-xl font-bold">
                {value || 0} {unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md h-max">
          <h2 className="font-semibold pb-2">Fleet Tracking</h2>
          <GoogleMaps
            onLoad={handleMapLoad}
            center={
              snappedPoints.length > 0 ? snappedPoints[0] : { lat: 0, lng: 0 }
            }
            mapContainerStyle={{ height: '50vh' }}
            zoom={16}
          >
            {snappedPoints.length > 0 && (
              <Polyline
                path={snappedPoints}
                options={{
                  strokeColor: '#FBBF24',
                  strokeWeight: 6,
                }}
              />
            )}
            {!!gpsImei && (
              <PointMarker
                position={{
                  lat: gpsImei.lat,
                  lng: gpsImei.lng,
                }}
                isActive={true}
                useBigMarker={true}
              >
                <div className="ml-56 min-w-48 bg-white flex-col gap-2 p-3 shadow-md">
                  <h3 className="text-sm font-semibold">{gpsImei.imei}</h3>
                  <p className="text-[8px] text-gray-500 mb-1">
                    {gpsImei.location}
                  </p>
                  <p className="text-xs text-gray-500">
                    Speed: {gpsImei.speed} km/h
                  </p>
                  <p className="text-xs text-gray-500">
                    Altitude: {gpsImei.altitude} m
                  </p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(gpsImei.date).toLocaleString()}
                  </p>
                </div>
              </PointMarker>
            )}
          </GoogleMaps>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md h-max">
            <h2 className="font-semibold pb-2">Fleet Movement Status</h2>
            <div className="w-full h-96 flex items-center justify-center">
              <MovementStatusChart
                data={movementStatusChartData}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      align: 'start',
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context: any) {
                          const value = context.parsed;
                          if (typeof value !== 'number')
                            return context.label || '';
                          const durationObj = dayjs.duration(value, 'seconds');
                          let label = context.label ? `${context.label}: ` : '';
                          const minutes = durationObj.minutes();
                          if (minutes < 0) return `0 min`;
                          if (durationObj.hours() > 0)
                            label += `${durationObj.hours()} h `;
                          label += `${minutes} min`;
                          return label;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-md h-max">
            <h2 className="font-semibold pb-2">Latest Tracking History</h2>
            <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
              {dataCoordinates
                ?.slice()
                .sort(
                  (a, b) =>
                    (dayjs(b.timestamp).toDate().getTime() ?? 0) -
                    (dayjs(a.timestamp).toDate().getTime() ?? 0),
                )
                .slice(0, 5)
                .map((coordinate, idx) => (
                  <div
                    key={idx}
                    className="rounded-md shadow-sm border border-gray-200 p-2"
                  >
                    <div className="flex flex-row justify-between my-1">
                      <p className="text-[12px] flex-[0.5] font-semibold">
                        Location:
                      </p>
                      <p className="text-[11px] flex-[0.5]">
                        {coordinate.location}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-between my-1">
                      <p className="text-[12px] flex-[0.5] font-semibold">
                        Last Update:
                      </p>
                      <p className="text-[11px] flex-[0.5]">
                        {dayjs(coordinate.timestamp).format(
                          'DD MMMM YYYY hh:mm',
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <Button
              onClick={() => navigate(ROUTES.fleetById(selectedImei))}
              variant={'ghost'}
              className="w-full mt-4"
            >
              View Detail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
