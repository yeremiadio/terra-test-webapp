import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';
import {
  useGetDashboardMetricsQuery,
  useGetLatestGpsAllQuery,
} from '@/stores/gpsStore/gpsStoreApi';
import { transformIodata } from '@/utils/functions/transformIoData';
import { useRef, useEffect, useMemo } from 'react';
import { BarChart } from './_components/BarChart';
import { ChartData } from 'chart.js';

type Props = {};

function snakeToTitleCase(str: string) {
  // Replace underscores with spaces, then insert spaces before capital letters (except the first letter), and capitalize the first letter
  const withSpaces = str
    .replace(/_/g, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^ /, '');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

const DashboardPage = (_: Props) => {
  const { data: gpsData } = useGetLatestGpsAllQuery({});
  const { data: dashboardMetrics } = useGetDashboardMetricsQuery({});
  const mapRef = useRef<google.maps.Map | null>(null);

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

  useEffect(() => {
    if (mapRef.current && gpsData?.data && gpsData.data.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      gpsData.data.forEach((gps) => {
        bounds.extend({ lat: gps.lat, lng: gps.lng });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [gpsData]);

  const barChartData = useMemo<ChartData<'bar', number[], string>>(() => {
    if (!dashboardMetrics?.gsmSignalDistribution)
      return { labels: [], datasets: [] };

    const labels = Object.keys(dashboardMetrics.gsmSignalDistribution);
    const data = Object.values(dashboardMetrics.gsmSignalDistribution);

    const colors = [
      '#E94F37', // red,
      '#F59E42', // orange
      '#FBBF24', // yellow
      '#17A773', // green
      '#10B981', // teal
    ];
    const backgroundColor = labels.map((_, idx) => colors[idx % colors.length]);

    return {
      labels,
      datasets: [
        {
          label: 'GSM Signal Strength',
          data,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderRadius: 12,
          borderWidth: 1,
        },
      ],
    };
  }, [dashboardMetrics?.gsmSignalDistribution]);
  return (
    <div>
      <h2 className="font-semibold pb-1">Hello there!👋</h2>
      <p>Monitor your Farm operations with real-time insights</p>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Total Devices */}
          <div className="bg-white p-4 rounded-md shadow flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">Total Devices</span>
            <span className="text-xl font-bold">
              {gpsData?.data.length || 0}
            </span>
          </div>
          {/* Total Odometer */}
          <div className="bg-white p-4 rounded-md shadow flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">Total Odometer</span>
            <span className="text-xl font-bold">
              {dashboardMetrics?.totalOdometerSum.value !== undefined
                ? dashboardMetrics.totalOdometerSum.value.toLocaleString()
                : 0}{' '}
              {dashboardMetrics?.totalOdometerSum.unit}
            </span>
          </div>
          {/* Battery Voltage */}
          <div className="bg-white p-4 rounded-md shadow flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">
              Average Battery Voltage
            </span>
            <span className="text-xl font-bold">
              {dashboardMetrics?.averageBatteryVoltage.value !== undefined
                ? dashboardMetrics.averageBatteryVoltage.value.toFixed(2)
                : 0}{' '}
              {dashboardMetrics?.averageBatteryVoltage.unit}
            </span>
          </div>
          {/* GNSS */}
          <div className="bg-white p-4 rounded-md shadow flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">GNSS Fix</span>
            <span className="text-xl font-bold">
              <span className="text-green-500">
                {dashboardMetrics?.gnssFix.good} Good
              </span>{' '}
              /{' '}
              <span className="text-red-500">
                {dashboardMetrics?.gnssFix.bad} Bad
              </span>
            </span>
          </div>
        </div>
        {/* Map Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md h-max">
            <h2 className="font-semibold pb-2">Device Current Location</h2>
            <GoogleMaps
              onLoad={handleMapLoad}
              mapContainerStyle={{ height: '50vh' }}
              zoom={16}
            >
              {gpsData?.data.map((gps) => (
                <PointMarker
                  key={gps.imei}
                  position={{ lat: gps.lat, lng: gps.lng }}
                  isActive={gps.status_mesin === 'ON'}
                  useBigMarker={true}
                >
                  <div className="ml-56 min-w-48 bg-white flex-col gap-2 p-3 shadow-md">
                    <h3 className="text-sm font-semibold">{gps.imei}</h3>
                    <p className="text-[8px] text-gray-500 mb-1">
                      {gps.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      Speed: {gps.speed} km/h
                    </p>
                    <p className="text-xs text-gray-500">
                      Altitude: {gps.altitude} m
                    </p>
                    <p className="text-xs text-gray-500">
                      Date: {new Date(gps.date).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500"></p>
                    <div>
                      {Object.entries(transformIodata(gps.iodata)).map(
                        ([key, value]) => {
                          return (
                            <p key={key} className="text-xs text-gray-500">
                              {snakeToTitleCase(key)}:{' '}
                              {typeof value === 'object'
                                ? `${value.value} ${value.unit}`
                                : value}
                            </p>
                          );
                        },
                      )}
                    </div>
                  </div>
                </PointMarker>
              ))}
            </GoogleMaps>
          </div>
          <div className="bg-white p-4 rounded-md h-max">
            <h2 className="font-semibold pb-2">GSM Signal Distribution</h2>
            {dashboardMetrics?.gsmSignalDistribution ? (
              <div className="w-full h-64 flex items-center justify-center">
                <BarChart
                  data={barChartData}
                  options={{
                    scales: {
                      x: {
                        grid: { display: false },
                      },
                      y: {
                        grid: { display: false },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
