export function formatWidth({
  value,
  unit,
}: {
  value: number;
  unit: "px" | "%";
}) {
  switch (unit) {
    case "px":
      return `${value}px`;
    case "%":
      return `${value}%`;
    default:
      return `${value}px`;
  }
}
