import { PaginatedResponse } from '../../core/models/procedures.model';

export interface PaginationMetadata {
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export function getTotalPages(data: PaginationMetadata): number {
  if (!data.count) {
    return 0;
  }

  const pageSize = getPageSize(data) ?? 20;
  return Math.ceil(data.count / pageSize);
}

function getPageSize(data: Pick<PaginationMetadata, 'next' | 'previous'>): number | null {
  const parseUrlPageSize = (url: string): number | null => {
    const match = url.match(/[?&](?:page_size|pageSize|size)=([0-9]+)/);
    return match ? Number(match[1]) : null;
  };

  if (typeof data.next === 'string' && data.next) {
    return parseUrlPageSize(data.next);
  }

  if (typeof data.previous === 'string' && data.previous) {
    return parseUrlPageSize(data.previous);
  }

  return null;
}
