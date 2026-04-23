import { HttpErrorResponse } from '@angular/common/http';
import { inject, signal, computed, Injector } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap, scan, tap, distinctUntilChanged, filter, catchError, EMPTY, map } from 'rxjs';
import { ErrorService } from '../../core/services/error.service';
import { PaginatedResponse } from '../../core/models/procedures.model';
import { TransformConfig } from '../../core/models/utility.model';
import { transformObject } from './object-transformer.utility';

export function useInfiniteData<T extends object, P>(
  fetchFn: (params: P, page: number) => Observable<PaginatedResponse<T>>,
  options: { initialParams?: P, transform?: TransformConfig<T> } = {} )
  {
  const errorService = inject(ErrorService);
  const injector = inject(Injector);
  
  const page = signal<number>(1);
  const params = signal<P>(options.initialParams || {} as P);
  const loading = signal<boolean>(false);
  const hasNextPage = signal<boolean>(true);
  const response = signal<PaginatedResponse<T> | null>(null);

  const data$ = toObservable(computed(() => ({ p: params(), pg: page() })), { injector }).pipe(
    filter(({ pg }) => pg === 1 || hasNextPage()),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    tap(() => {loading.set(true)}),
    
    switchMap(({ p, pg }) => fetchFn(p, pg).pipe(
      map(res => {
        response.set(res);
        hasNextPage.set(res.next !== null);
        
        if (options.transform) {
          return transformObject(res.results, options.transform);
        }

        return res.results;
      }),
      catchError((error: HttpErrorResponse) => {
        errorService.handleError(error);
        hasNextPage.set(false);
        return EMPTY;
      })
    )),
    scan((acc, curr) => (page() === 1 ? curr : [...acc, ...curr]), [] as any[]),
    tap(() => loading.set(false))
  );

  const data = toSignal(data$, { injector, initialValue: [] as any[] });

  return { data, loading, params,hasNextPage,
    response,
    nextPage: () => {
      if (!loading() && hasNextPage()) {
        page.update(p => p + 1);
      }
    },
    
    updateParams: (newParams: P) => {
      hasNextPage.set(true);
      params.set(newParams);
      page.set(1);
    }
  };
}