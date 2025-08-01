export type BackendResponse<T> = {
  message: string;
  data: T;
};

export type BackendErrorResponse = {
  status: string;
  data: {
    statusCode: number;
    message: string;
    requestUrl: string;
  };
};

export type TPaginationResponse<T> = {
  data: T;
  meta: Meta;
};

export interface IBackendDataPageShape<D> {
  status: string;
  data: TPaginationResponse<D>;
}

export type TPaginationRequestObject = {
  page?: number;
  limit?: number;
};

export type TBackendPaginationRequestObject<D extends object> = D &
  TPaginationRequestObject;

export type Meta = {
  totalItems: number;
  itemCount: number;
  itemPerPage: number;
  totalPages: number;
  currentPage: number;
};

export interface ErrorMessageBackendDataShape {
  status: number;
  data: {
    status: string;
    message: any;
  };
}
