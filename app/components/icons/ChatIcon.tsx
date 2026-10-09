type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function ChatIcon({ className, isActive }: IconProps) {
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
      <path
        clipRule="evenodd"
        d="M2 5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V15C22 16.1046 21.1046 17 20 17H13.4142L9.70711 20.7071C9.31658 21.0976 8.68342 21.0976 8.29289 20.7071L4.58579 17H4C2.89543 17 2 16.1046 2 15V5ZM7 8C7 7.44772 7.44772 7 8 7H16C16.5523 7 17 7.44772 17 8C17 8.55228 16.5523 9 16 9H8C7.44772 9 7 8.55228 7 8ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H8Z"
        fill={fillColor}
        fillRule="evenodd"
      />
    </svg>
  );
}
