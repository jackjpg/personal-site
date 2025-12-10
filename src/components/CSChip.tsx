interface CSChipProps {
  children: React.ReactNode;
}

export default function CSChip({ children }: CSChipProps) {
  return (
    <span className="cs-chip">
      {children}
    </span>
  );
}

