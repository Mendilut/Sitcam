interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

function Button({ children, variant = 'primary', href, onClick, type = 'button', className = '' }: ButtonProps) {
  const baseStyles = "px-8 py-3 rounded-lg text-lg transition-all font-semibold";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900"
  };

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export default Button;