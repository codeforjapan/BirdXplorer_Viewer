type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function SearchIcon({ className, isActive }: IconProps) {
  const fillColor = isActive ? "var(--color-primary)" : "var(--color-gray-2)";

  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_323_1113)">
        <path d="M6.5 11.6001H1V13.8001H6.5V11.6001Z" fill={fillColor} />
        <path
          d="M18.787 13.525C19.359 12.656 19.7 11.622 19.7 10.5C19.7 7.464 17.236 5 14.2 5C11.164 5 8.69995 7.464 8.69995 10.5C8.69995 13.536 11.164 16 14.2 16C15.322 16 16.356 15.659 17.236 15.087L21.4489 19.3L23 17.749L18.787 13.525ZM14.2 13.8C12.385 13.8 10.9 12.315 10.9 10.5C10.9 8.685 12.385 7.2 14.2 7.2C16.015 7.2 17.5 8.685 17.5 10.5C17.5 12.315 16.015 13.8 14.2 13.8Z"
          fill={fillColor}
        />
        <path d="M6.5 6.1001H1V8.3001H6.5V6.1001Z" fill={fillColor} />
        <path d="M12 17.1001H1V19.3001H12V17.1001Z" fill={fillColor} />
      </g>
      <defs>
        <clipPath id="clip0_323_1113">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </svg>
  );
}
