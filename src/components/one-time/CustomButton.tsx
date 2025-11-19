import React from "react";

type ButtonProps = {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

export const CustomButton = ({ onClick, className = "", children }: ButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
