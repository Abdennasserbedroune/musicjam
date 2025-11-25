import LoadingSpinner from './LoadingSpinner';

type NeonButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export default function NeonButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}: NeonButtonProps) {
  const variantStyles = {
    primary:
      'bg-neon-purple hover:bg-neon-purple/80 text-white border-neon-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]',
    secondary:
      'bg-neon-cyan hover:bg-neon-cyan/80 text-white border-neon-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]',
    tertiary:
      'bg-neon-pink hover:bg-neon-pink/80 text-white border-neon-pink hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]',
  };

  const baseStyles =
    'px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
