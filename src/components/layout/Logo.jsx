export function Logo({ className = "", variant = "color", size = "h-20" }) {
  const logoSources = {
    color: "/LogoColorEMA4.svg",
    white: "/LogoBlancoEMA.svg",
    black: "/LogoNegroEMA3.svg",
  };
  
  return (
    <div className={`${size} w-20 flex-shrink-0 ${className}`}>
      <img 
        src={logoSources[variant] || logoSources.color}
        alt="EMA Logo" 
        className="h-full w-full object-contain" 
        loading="eager"
      />
    </div>
  );
}
