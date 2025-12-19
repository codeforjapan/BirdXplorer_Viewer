type IconProps = {
  className?: string;
  isActive?: boolean;
};

export function NoteIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_332_5637)">
        <path
          d="M2.00008 15.3334H12.6667V14H2.00008V3.33335H0.666748V14C0.666748 14.7334 1.26675 15.3334 2.00008 15.3334ZM14.0001 0.666687H4.66675C3.93341 0.666687 3.33341 1.26669 3.33341 2.00002V11.3334C3.33341 12.0667 3.93341 12.6667 4.66675 12.6667H14.0001C14.7334 12.6667 15.3334 12.0667 15.3334 11.3334V2.00002C15.3334 1.26669 14.7334 0.666687 14.0001 0.666687ZM14.0001 11.3334H4.66675V2.00002H14.0001V11.3334Z"
          fill="var(--color-primary)"
        />
      </g>
      <defs>
        <clipPath id="clip0_332_5637">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </svg>
  );
}
