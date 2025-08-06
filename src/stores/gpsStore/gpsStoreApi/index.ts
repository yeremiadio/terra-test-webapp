import {
  BackendResponse,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types';
import {
  IGnssStatus,
  IGpsCoordinateParams,
  IGpsCoordinates,
  IGpsDashboardMetrics,
  IGpsData,
} from '@/types/api/gps';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_ENDPOINT + '/gps';

export const gpsApi = createApi({
  reducerPath: 'gpsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: [
    'gps-list',
    'gps-detail',
    'gps-dashboard-metrics',
    'gps-coordinates',
    'gnss-status',
    'gps-trends-detail',
  ],
  endpoints: (builder) => ({
    getGpsData: builder.query<
      TPaginationResponse<IGpsData[]>,
      TBackendPaginationRequestObject<
        Partial<{
          imei: string;
          startDate: Date;
          endDate: Date;
        }>
      >
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
        url: `/latest/${imei}`,
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
    getCoordinatesByImei: builder.query<
      IGpsCoordinates[],
      IGpsCoordinateParams
    >({
      query: ({ imei, ...rest }) => ({
        url: '/coordinates/' + imei,
        method: 'GET',
        rest,
      }),
      transformResponse: (response: BackendResponse<IGpsCoordinates[]>) =>
        response.data,
      providesTags: (_, __, imei) => [{ type: 'gps-coordinates', imei }],
    }),
    getGnssStatusTotal: builder.query<IGnssStatus, string>({
      query: (imei) => ({
        url: '/gnss-status/' + imei,
        method: 'GET',
      }),
      transformResponse: (response: BackendResponse<IGnssStatus>) =>
        response.data,
      providesTags: (_, __, imei) => [{ type: 'gnss-status', imei }],
    }),
    getGpsTrendsByImei: builder.query<
      {
        labels: string[];
        values: number[];
      },
      {
        imei: string;
        iodataKey: string;
        startDate?: Date;
        endDate?: Date;
      }
    >({
      query: (obj) => ({
        url: '/trends',
        method: 'GET',
        params: obj,
      }),
      transformResponse: (
        response: BackendResponse<{
          labels: string[];
          values: number[];
        }>,
      ) => response.data,
      providesTags: (_, __, imei) => [{ type: 'gps-trends-detail', imei }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetGpsDataQuery,
  useGetGpsDataByImeiQuery,
  useGetLatestGpsAllQuery,
  useGetDashboardMetricsQuery,
  useGetCoordinatesByImeiQuery,
  useGetGnssStatusTotalQuery,
  useGetGpsTrendsByImeiQuery,
  util: { resetApiState: resetGpsDataQuery },
} = gpsApi;
