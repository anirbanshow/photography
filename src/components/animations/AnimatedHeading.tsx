type HeadingProps = {
  as?: "h1" | "h2" | "h3";
  lines: string[];
  className?: string;
  italicLast?: boolean;
  enter?: boolean;
};

export function AnimatedHeading({ as: Tag = "h2", lines, className, italicLast, enter }: HeadingProps) {
  return (
    <Tag className={`display animated-heading ${className ?? ""}`} aria-label={lines.join(" ")} data-heading={enter ? "enter" : "scroll"}>
      {lines.map((line, index) => (
        <span className="heading-mask" aria-hidden="true" key={index}>
          {italicLast && index === lines.length - 1 ? <em>{line}</em> : <span>{line}</span>}
        </span>
      ))}
    </Tag>
  );
}
