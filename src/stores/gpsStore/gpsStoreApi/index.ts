import {
  BackendResponse,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types';
import { IGpsDashboardMetrics, IGpsData } from '@/types/api/gps';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_ENDPOINT + '/gps';

export const gpsApi = createApi({
  reducerPath: 'gpsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['gps-list', 'gps-detail', 'gps-dashboard-metrics'],
  endpoints: (builder) => ({
    getGpsData: builder.query<
      TPaginationResponse<IGpsData[]>,
      TBackendPaginationRequestObject<Partial<IGpsData>>
    >({
      query: (params) => {
        return {
          url: '',
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: TPaginationResponse<IGpsData[]>) =>
        response,
      providesTags: ['gps-list'],
    }),
    getGpsDataByImei: builder.query<IGpsData, string>({
      query: (imei) => ({
        url: `/${imei}`,
        method: 'GET',
      }),
      transformResponse: (response: BackendResponse<IGpsData>) => response.data,
      providesTags: (_, __, imei) => [{ type: 'gps-detail', imei }],
    }),
    getLatestGpsAll: builder.query<BackendResponse<IGpsData[]>, object>({
      query: (params) => {
        return {
          url: '/latest-for-all',
          method: 'GET',
          params,
        };
      },
    }),
    getDashboardMetrics: builder.query<IGpsDashboardMetrics, object>({
      query: (params) => ({
        url: '/metrics',
        method: 'GET',
        params,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetGpsDataQuery,
  useGetGpsDataByImeiQuery,
  useGetLatestGpsAllQuery,
  useGetDashboardMetricsQuery,
  util: { resetApiState: resetGpsDataQuery },
} = gpsApi;
