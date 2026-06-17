import NextLink from "next/dist/client/link";
import type { ComponentProps } from "react";

export type AppLinkProps = ComponentProps<typeof NextLink>;

/** Internal links default to scroll={false}; scroll is handled by ScrollToTopOnNavigate. */
export default function Link({ scroll = false, ...props }: AppLinkProps) {
  return <NextLink scroll={scroll} {...props} />;
}
