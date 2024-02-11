//This's only the example how to get api with rtk query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: [],
  endpoints: (builder) => ({
    getUserByName: builder.query({
      query: (name: string) => `pokemon/${name}`,
    }),
  }),
})

// Export hooks for usage in functional components
export const { useGetUserByNameQuery } = userApi