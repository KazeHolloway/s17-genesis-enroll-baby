import type { MouseEventHandler } from "react";

export interface CustomButtonProps {
  title: string;
  styles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
}

export interface Parent {
  name: string;
  phone: string;
  email: string;
  nbreEnfants: number;
}
