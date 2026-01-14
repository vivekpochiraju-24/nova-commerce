import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: 'cyan' | 'violet' | 'pink';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const NeonButton: React.FC<NeonButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  glowColor = 'cyan',
  children,
  onClick,
  disabled,
  type = 'button',
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
    onClick?.();
  };

  const baseStyles = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 transform";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-neon-cyan",
    secondary: "bg-gradient-to-r from-neon-violet to-neon-pink text-white hover:shadow-neon-violet",
    outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const glowStyles = {
    cyan: "hover:shadow-neon-cyan",
    violet: "hover:shadow-neon-violet",
    pink: "hover:shadow-[0_0_20px_hsl(var(--neon-pink)/0.5)]",
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], glowStyles[glowColor], className)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};

export default NeonButton;
