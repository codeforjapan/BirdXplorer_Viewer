type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function FeatureIcon({ className, isActive }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_194_1217)">
        <path
          d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19ZM5 10H14V12H5V10ZM5 7H14V9H5V7Z"
          fill={isActive ? "var(--color-primary)" : "var(--color-gray-2)"}
        />
      </g>
      <defs>
        <clipPath id="clip0_194_1217">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </svg>
  );
}
