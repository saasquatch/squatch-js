export function formatWidth({
  value,
  unit,
}: {
  value: number;
  unit: "PX" | "%";
}) {
  switch (unit) {
    case "PX":
      return `${value}px`;
    case "%":
      return `${value}%`;
    default:
      return `${value}px`;
  }
}
