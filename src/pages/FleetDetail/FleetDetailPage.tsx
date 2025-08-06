import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';
import { cn } from '@/lib/utils';
import {
  useGetGnssStatusTotalQuery,
  useGetGpsDataByImeiQuery,
  useGetGpsTrendsByImeiQuery,
} from '@/stores/gpsStore/gpsStoreApi';
import { getGnssStatus } from '@/utils/functions/getGnssStatus';
import { getGsmSignalStatus } from '@/utils/functions/getGsmSignalStatus';
import { getIconIoData } from '@/utils/functions/getIconIoData';
import { getSleepMode } from '@/utils/functions/getSleepMode';
import { snakeToTitleCase } from '@/utils/functions/snakeToTitleCase';
import { keyMap, transformIodata } from '@/utils/functions/transformIoData';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);
dayjs.locale('en');
import { useParams } from 'react-router-dom';
import PlotAreaChart from './PlotAreaChart';
import { terraColors } from '@/utils/constants/colors';
import { ChartData, ScriptableContext } from 'chart.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import IoDataTrendChart from './IoDataTrendChart';

const addAlphatoHexColor = (color: string, opacity?: number): string => {
  const validOpacity = opacity !== undefined ? opacity : 1;
  const newOpacity = Math.round(Math.min(Math.max(validOpacity, 0), 1) * 255);
  const hexOpacity = newOpacity.toString(16).padStart(2, '0').toUpperCase();
  return color + hexOpacity;
};

const FleetDetailPage = () => {
  const [selectedTrend, setSelectedTrend] = useState<string>('16');
  const { id: fleetId } = useParams<'id'>();
  const { data: detailTrends, isLoading } = useGetGpsTrendsByImeiQuery(
    {
      imei: fleetId ?? '',
      iodataKey: selectedTrend,
    },
    {
      skip: !fleetId || !selectedTrend,
      refetchOnFocus: true,
    },
  );
  const { data: detailImei } = useGetGpsDataByImeiQuery(fleetId ?? '', {
    skip: !fleetId,
    refetchOnFocus: true,
  });
  const { data: gnssStatus } = useGetGnssStatusTotalQuery(fleetId ?? '', {
    skip: !fleetId,
    refetchOnFocus: true,
  });
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (mapRef.current && !!detailImei) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: detailImei.lat, lng: detailImei.lng });
      mapRef.current.fitBounds(bounds);
    }
  }, [detailImei, mapRef]);

  const gnssStatusChart = useMemo<
    ChartData<'polarArea', number[], string>
  >(() => {
    if (!gnssStatus) return { labels: [], datasets: [] };
    const labels = Object.entries(gnssStatus).map(([statusKey, _]) =>
      getGnssStatus(Number(statusKey)),
    );
    const datasets = [
      {
        label: 'Status',
        data: Object.entries(gnssStatus).map(([_, total]) => total),
        backgroundColor: terraColors,
      },
    ];
    return { labels, datasets };
  }, [gnssStatus]);

  const trendsChart = useMemo<
    ChartData<'line', { x: string; y: number }[], string>
  >(() => {
    if (!detailTrends) return { labels: [], datasets: [] };
    const label = snakeToTitleCase(keyMap[selectedTrend]);
    const originalLabels = detailTrends.labels;
    const originalValues = detailTrends.values;
    // Format ISO8601 diasumsikan di logTimestamp
    const filteredData = originalLabels
      .map((timestamp, index) => {
        const dateObj = new Date(timestamp);
        return {
          timestamp,
          minute: dateObj.getMinutes(),
          index,
        };
      })
      // Filter hanya pada jam yang kelipatan 3 (0, 3, 6, 9, 12, 15, 18, 21)
      .filter((item) => item.minute % 30 === 0);

    // Ambil labels dan values yang sudah difilter
    const labels = filteredData.map((item) => item.timestamp);
    const values = filteredData.map((item) => originalValues[item.index]);
    const DEFAULT_COLOR = terraColors[terraColors.length - 1];
    const datasets = [
      {
        label,
        data: values.map((v, idx) => {
          return {
            x: labels[idx],
            y: v,
          };
        }),
        borderColor: DEFAULT_COLOR,
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        // pointRadius(ctx) {
        //   if (ctx.dataIndex === ctx.dataset.data.length - 1) {
        //     return 2;
        //   }
        //   return 0;
        // },
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, width } = chart;
          const gradient = ctx.createLinearGradient(width * 1.5, 0, 0, 0);
          gradient.addColorStop(0.5, addAlphatoHexColor(DEFAULT_COLOR, 0.075));
          gradient.addColorStop(1, addAlphatoHexColor(DEFAULT_COLOR, 0.85));
          return gradient;
        },
      },
    ];
    return { labels, datasets };
  }, [detailTrends, selectedTrend]);
  return (
    <div className="p-2 lg:p-4 my-4">
      <div className="flex flex-wrap flex-row gap-4">
        <div className="bg-white p-4 rounded-md h-max flex-1 lg:flex-[0.45]">
          <div className="flex flex-row items-center justify-between mt-2">
            <h3 className="text-gray-900 text-md font-semibold">
              IMEI: {detailImei?.imei ?? '-'}
            </h3>
            <div className="flex flex-end items-center gap-2">
              <div className="flex flex-row justify-center items-center">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full bg-green-500 absolute animate-ping',
                    detailImei?.status_mesin === 'OFF' && 'bg-red-500',
                  )}
                />
                <div
                  className={cn(
                    'w-3 h-3 rounded-full bg-green-500',
                    detailImei?.status_mesin === 'OFF' && 'bg-red-500',
                  )}
                />
              </div>
              <div>{detailImei?.status_mesin ?? 'OFF'}</div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mt-2 mb-6">
            <h3 className="text-gray-700 text-sm flex-[0.5]">Location</h3>
            <p className="text-gray-900 text-sm font-semibold flex-[0.5] text-right">
              {detailImei?.location ?? '-'}
            </p>
          </div>
          <div className="my-4 grid grid-cols-1 gap-2 h-96 overflow-y-auto">
            {!!detailImei?.iodata &&
              Object.entries(transformIodata(detailImei.iodata)).map(
                ([key, value], index) => {
                  const Icon = getIconIoData(
                    Object.keys(detailImei.iodata)[index],
                  );
                  const formattedValue = (
                    key: string,
                    value: number,
                  ): string | number => {
                    switch (key) {
                      case 'gsmSignal':
                        return getGsmSignalStatus(value);
                      case 'sleepMode':
                        return getSleepMode(value);
                      case 'gnssStatus':
                        return getGnssStatus(value);
                      default:
                        return value.toLocaleString('id');
                    }
                  };
                  return (
                    <div
                      key={key}
                      className="flex flex-row items-center justify-between my-1 border border-gray-200 rounded-md p-3"
                    >
                      <Icon size={20} className="mr-3 text-gray-700" />
                      <h5 className="text-base text-gray-500 flex-1 m-0">
                        {snakeToTitleCase(key)}{' '}
                      </h5>
                      <p className="flex-1 text-right m-0">
                        {typeof value === 'object'
                          ? `${formattedValue(key, value.value)} ${value.unit}`
                          : value}
                      </p>
                    </div>
                  );
                },
              )}
          </div>
          <p className="text-center text-[11px] text-gray-500">
            Last Update:{' '}
            {detailImei?.date ? dayjs(detailImei.date).fromNow() : 'N/A'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 flex-1 gap-4">
          <div className="bg-white p-4 rounded-md h-max">
            <h2 className="font-semibold pb-2">Current Location</h2>
            <GoogleMaps
              onLoad={handleMapLoad}
              mapContainerStyle={{ height: '68vh' }}
              zoom={16}
            >
              {!!detailImei && (
                <PointMarker
                  position={{
                    lat: detailImei.lat,
                    lng: detailImei.lng,
                  }}
                  isActive={detailImei.status_mesin === 'ON'}
                  useBigMarker={true}
                />
              )}
            </GoogleMaps>
          </div>
          <div className="bg-white p-4 rounded-md h-max">
            <h2 className="font-semibold pb-2">GNSS Status</h2>
            <div className="h-[68vh]">
              <PlotAreaChart data={gnssStatusChart} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex md:flex-row gap-4">
        <div className="bg-white p-4 rounded-md h-max flex-1">
          <span className="font-semibold pb-2">Parameter Trends</span>
          <div className="flex flex-row flex-wrap gap-2 items-center justify-end my-2">
            <Select
              value={selectedTrend}
              onValueChange={(value) => {
                setSelectedTrend(value);
              }}
            >
              <SelectTrigger className="w-full lg:w-[180px] bg-white">
                <SelectValue
                  placeholder={
                    isLoading ? 'Loading...' : 'Select Parameters...'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {!!detailImei &&
                  Object.entries(transformIodata(detailImei.iodata)).map(
                    ([key], index) => (
                      <SelectItem
                        key={key}
                        value={Object.keys(detailImei.iodata)[index]}
                      >
                        {snakeToTitleCase(key)}
                      </SelectItem>
                    ),
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="h-96 w-full">
            <IoDataTrendChart data={trendsChart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetDetailPage;
