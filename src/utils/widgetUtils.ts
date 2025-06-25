export function formatWidth({
  value,
  unit,
}: {
  value: number;
  unit: "PX" | "PT";
}) {
  switch (unit) {
    case "PX":
      return `${value}px`;
    case "PT":
      return `${value}pt`;
    default:
      return `${value}px`;
  }
}
