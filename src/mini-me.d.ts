import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "mini-me": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        tagline?: string;
        look?: string;
        lines?: string;
        intro?: "once" | "always" | "off";
        size?: string | number;
        avoid?: string;
        static?: boolean;
      };
    }
  }
}
