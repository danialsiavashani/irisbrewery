import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  visual: ReactNode;
  tagline: string;
  reverse?: boolean;
}

export function AuthLayout({ children, visual, tagline, reverse = false }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      {reverse && (
        <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      )}

      <div className={`hidden w-1/2 flex-col items-center justify-center gap-6 bg-muted/20 p-10 lg:flex ${reverse ? "border-l" : "border-r"}`}>
        <div className="w-full max-w-xs">{visual}</div>
        <p className="text-center text-sm text-muted-foreground">
          {tagline}
        </p>
      </div>

      {!reverse && (
        <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      )}
    </div>
  );
}