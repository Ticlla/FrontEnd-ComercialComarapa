import { Store } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const sizeConfig = {
  sm: {
    icon: 24,
    text: 'text-xl',
    gap: 'gap-2',
  },
  md: {
    icon: 32,
    text: 'text-2xl',
    gap: 'gap-3',
  },
  lg: {
    icon: 48,
    text: 'text-4xl',
    gap: 'gap-4',
  },
};

/**
 * Store logo/branding component.
 * Displays "COMERCIAL COMARAPA" with optional store icon.
 */
export function Logo({ size = 'lg', showIcon = true }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center justify-center ${config.gap}`}>
      {showIcon && (
        <Store 
          size={config.icon} 
          className="text-[var(--color-primary)]" 
          aria-hidden="true"
        />
      )}
      <h1 className={`${config.text} font-semibold tracking-tight text-[var(--color-text)]`}>
        <span className="text-[var(--color-primary)]">COMERCIAL</span>
        {' '}
        <span>COMARAPA</span>
      </h1>
    </div>
  );
}

export default Logo;


