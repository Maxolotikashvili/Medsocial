import { HttpParams } from '@angular/common/http';

type Primitive = string | number | boolean;
type QueryValue = Primitive | Primitive[] | null | undefined;

export function buildHttpParams(query: Record<string, QueryValue>): HttpParams;
export function buildHttpParams<T extends object>(query: T): HttpParams;
export function buildHttpParams(query: object): HttpParams {
  let params = new HttpParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item != null) {
          params = params.append(key, String(item));
        }
      });
      return;
    }

    params = params.set(key, String(value));
  });

  return params;
}
