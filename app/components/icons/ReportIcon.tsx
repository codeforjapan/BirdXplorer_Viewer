type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function ReportIcon({ className, isActive }: IconProps) {
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
      <g clipPath="url(#clip0_323_1058)">
        <path
          d="M16.81 8.93994L13.06 5.18994L4 14.2499V17.9999H7.75L16.81 8.93994ZM6 15.9999V15.0799L13.06 8.01994L13.98 8.93994L6.92 15.9999H6Z"
          fill={fillColor}
        />
        <path
          d="M19.71 6.04C20.1 5.65 20.1 5.02 19.71 4.63L17.37 2.29C17.17 2.09 16.92 2 16.66 2C16.41 2 16.15 2.1 15.96 2.29L14.13 4.12L17.88 7.87L19.71 6.04Z"
          fill={fillColor}
        />
        <path d="M22 20H2V24H22V20Z" fill={fillColor} />
      </g>
      <defs>
        <clipPath id="clip0_323_1058">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </svg>
  );
}
