function DesktopFinalActionButton({
  children,
  backgroundColor,
  color,
  onClick,
}) {
  return (
    <button
      className={`${backgroundColor} ${color} rounded-lg py-3 px-4`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export default DesktopFinalActionButton;
