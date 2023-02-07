interface ChipProps {
  label: string;
}

export default function Chip({ label }: ChipProps) {
  return (
    <div className="flex select-none items-center justify-center rounded-full px-4 py-1 text-sm font-medium text-black ring-1 ring-black">
      {label}
    </div>
  );
}
