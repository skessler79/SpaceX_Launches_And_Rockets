export interface Props {
  date?: any;
  kind: "date" | "datetime" | "custom";
  format: string;
  relative: boolean;
}
