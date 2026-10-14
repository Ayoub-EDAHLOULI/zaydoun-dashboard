import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Visually hide the header text (e.g. the actions column) */
  srOnlyHeader?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** CSS grid-template-columns, e.g. "2.2fr 1fr 1fr 1fr 1fr 64px" */
  template: string;
  ariaLabel: string;
  /** Narrowest width before the table scrolls horizontally */
  minWidth?: number;
  /** Shown instead of rows when there are none */
  empty?: ReactNode;
}

// Header on border-subtle, 64px rows, horizontal scroll on small screens
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  template,
  ariaLabel,
  minWidth = 760,
  empty,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-bg-surface">
      <div role="table" aria-label={ariaLabel} style={{ minWidth }}>
        <div role="rowgroup">
          <div
            role="row"
            className="grid h-11 items-center gap-4 bg-border-subtle px-5 text-xs font-medium tracking-[0.04em] text-text-secondary"
            style={{ gridTemplateColumns: template }}
          >
            {columns.map((c) => (
              <span
                key={c.key}
                role="columnheader"
                className={cn(c.srOnlyHeader && "sr-only", c.className)}
              >
                {c.header}
              </span>
            ))}
          </div>
        </div>
        <div role="rowgroup">
          {rows.length === 0 && empty ? (
            <div className="border-t border-border">{empty}</div>
          ) : (
            rows.map((row) => (
              <div
                key={rowKey(row)}
                role="row"
                className="grid min-h-16 items-center gap-4 border-t border-border px-5 py-2 text-sm transition-colors hover:bg-bg-elevated"
                style={{ gridTemplateColumns: template }}
              >
                {columns.map((c) => (
                  <div key={c.key} role="cell" className={cn("min-w-0", c.className)}>
                    {c.cell(row)}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
