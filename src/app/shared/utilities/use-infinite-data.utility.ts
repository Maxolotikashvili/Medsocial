import { HttpErrorResponse } from '@angular/common/http';
import { inject, signal, computed, Injector } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap, scan, tap, distinctUntilChanged, filter, catchError, EMPTY, map } from 'rxjs';
import { ErrorService } from '../../core/services/error.service';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export function useInfiniteData<T extends { name?: string }, P>(
  fetchFn: (params: P, page: number) => Observable<PaginatedResponse<T>>,
  initialParams: P,
  returnNames: boolean = false
) {
  const errorService = inject(ErrorService);
  const injector = inject(Injector);
  
  const page = signal<number>(1);
  const params = signal<P>(initialParams);
  const loading = signal<boolean>(false);
  const hasNextPage = signal<boolean>(true);
  const data$ = toObservable(computed(() => ({ p: params(), pg: page() })), { injector }).pipe(
    filter(({ pg }) => pg === 1 || hasNextPage()),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    tap(() => {loading.set(true)}),
    
    switchMap(({ p, pg }) => fetchFn(p, pg).pipe(
      map(res => {
        hasNextPage.set(res.next !== null);
        
        const items = returnNames 
          ? res.results.map(item => item.name as string) 
          : res.results;
          
        return items;
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