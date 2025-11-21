type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function DashboardIcon({ className, isActive }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_323_805)">
        <path
          d="M19.7778 2H4.22222C3 2 2 3 2 4.22222V19.7778C2 21 3 22 4.22222 22H19.7778C21 22 22 21 22 19.7778V4.22222C22 3 21 2 19.7778 2ZM4.22222 19.7778V4.22222H10.8889V19.7778H4.22222ZM19.7778 19.7778H13.1111V12H19.7778V19.7778ZM19.7778 9.77778H13.1111V4.22222H19.7778V9.77778Z"
          fill={isActive ? "var(--color-primary)" : "var(--color-gray-2)"}
        />
      </g>
      <defs>
        <clipPath id="clip0_323_805">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
