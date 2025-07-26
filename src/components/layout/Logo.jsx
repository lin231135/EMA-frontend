export function Logo({ className = "", variant = "color", size = "h-20" }) {
  const logoSources = {
    color: "/LogoColorEMA4.svg",
    white: "/LogoBlancoEMA.svg",
    black: "/LogoNegroEMA3.svg",
  };
  
  return (
    <img 
      src={logoSources[variant] || logoSources.color}
      alt="EMA Logo" 
      className={`${size} w-auto ${className}`} 
    />
  );
}
