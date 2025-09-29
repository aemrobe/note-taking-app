function Heading({ level, classname, children, ...props }) {
  const baseClasses = "font-bold focus:outline-none -tracking-150 text-2xl";

  const HeadingLevel = level;

  return (
    <HeadingLevel className={`${baseClasses} ${classname}`} {...props}>
      {children}
    </HeadingLevel>
  );
}

export default Heading;
