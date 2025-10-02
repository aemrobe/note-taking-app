import LogoIcon from "./LogoIcon";

function Logo() {
  return (
    <div className="md:max-w-[48rem] md:mx-auto xl:max-w-none bg-logo-background xl:bg-background-primary text-logo-icon py-[0.865rem] md:py-[1.4375rem] md:px-8 px-[1.021rem] xl:w-60 xl:h-[3.2rem] xl:flex xl:items-center xl:justify-start xl:pt-3 xl:pb-4 xl:pl-0 xl:mb-4">
      <LogoIcon />
    </div>
  );
}

export default Logo;
