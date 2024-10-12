// models/HttpErrorResponse.model.ts
export interface HttpErrorResponse {
  headers: {
    normalizedNames: Record<string, any>;
    lazyUpdate: any;
  };
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: {
    errorCode: string;
    message: string[];
  };
}
