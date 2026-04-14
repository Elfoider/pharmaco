declare module "recharts" {
  import type { ComponentType, ReactNode } from "react";

  type GenericProps = Record<string, unknown> & { children?: ReactNode };

  export const ResponsiveContainer: ComponentType<GenericProps>;
  export const LineChart: ComponentType<GenericProps>;
  export const CartesianGrid: ComponentType<GenericProps>;
  export const XAxis: ComponentType<GenericProps>;
  export const YAxis: ComponentType<GenericProps>;
  export const Tooltip: ComponentType<GenericProps>;
  export const Legend: ComponentType<GenericProps>;
  export const Line: ComponentType<GenericProps>;
}
