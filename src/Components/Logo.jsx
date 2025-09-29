import LogoIcon from "./LogoIcon";

function Logo() {
  return (
    <div className="md:max-w-[48rem] md:mx-auto 2xl:max-w-none bg-logo-background 2xl:bg-background-primary text-logo-icon py-[0.865rem] md:py-[1.4375rem] md:px-8 px-[1.021rem] 2xl:w-60 2xl:h-[3.2rem] 2xl:flex 2xl:items-center 2xl:justify-start 2xl:pt-3 2xl:pb-4 2xl:pl-0 2xl:mb-4">
      <LogoIcon />
    </div>
  );
}

export default Logo;
