type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function PlayButtonIcon({ className, isActive }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        fill={isActive ? "var(--color-primary)" : "var(--color-gray-2)"}
        r="8"
      />
      <path d="M12 8L6 11.4641L6 4.5359L12 8Z" fill="white" />
    </svg>
  );
}