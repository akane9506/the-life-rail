import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export default function Button({ children, ...props }: ButtonProps) {
  const { ...defaultProps } = props;
  return (
    <button
      {...defaultProps}
      className="z-10 w-fit h-fit p-1 rounded-full not-disabled:hover:bg-white/50 disabled:opacity-35 not-disabled:hover:shadow not-disabled:hover:cursor-pointer transition-colors duration-200"
    >
      {children}
    </button>
  );
}
