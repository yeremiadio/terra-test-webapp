import { cn } from '@/lib/utils';
import { useGetLatestGpsAllQuery } from '@/stores/gpsStore/gpsStoreApi';
import { ROUTES } from '@/utils/configs/routes';
import { Link } from 'react-router-dom';

const FleetPage = () => {
  const { data: gpsData } = useGetLatestGpsAllQuery({});
  return (
    <div className="p-2 lg:p-4 my-4">
      <div className="flex flex-row flex-wrap gap-4">
        {gpsData?.data.map((data) => (
          <Link key={data.imei} to={ROUTES.fleetById(data.imei)}>
            <div className="bg-white p-4 rounded-md shadow flex flex-col items-start w-full md:w-96 hover:shadow-lg cursor-pointer">
              <div className="flex flex-row items-center justify-between mt-2 w-full">
                <h3 className="text-gray-900 text-md font-semibold">
                  IMEI: {data?.imei ?? '-'}
                </h3>
                <div className="flex flex-end items-center gap-2">
                  <div className="flex flex-row justify-center items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full bg-green-500 absolute animate-ping',
                        data?.status_mesin === 'OFF' && 'bg-red-500',
                      )}
                    />
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full bg-green-500',
                        data?.status_mesin === 'OFF' && 'bg-red-500',
                      )}
                    />
                  </div>
                  <div>{data?.status_mesin ?? 'OFF'}</div>
                </div>
              </div>
              <p className="text-sm font-light">
                Location: {data.location ?? '-'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FleetPage;
