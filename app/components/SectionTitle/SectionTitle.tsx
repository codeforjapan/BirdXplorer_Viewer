type SectionTitleProps = {
  title: string;
  className?: string;
};

export function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <h2
      className={`md:text-heading-l text-heading-m text-white ${className ?? ""}`}
    >
      {title}
    </h2>
  );
}
