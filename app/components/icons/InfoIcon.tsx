type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function InfoIcon({ className, isActive }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
        fill={isActive ? "var(--color-primary)" : "var(--color-gray-2)"}
      />
      <path
        d="M12 4C7.59 4 4 7.59 4 12C4 16.41 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
        fill={isActive ? "var(--color-primary)" : "var(--color-gray-2)"}
        opacity="0.3"
      />
    </svg>
  );
}

