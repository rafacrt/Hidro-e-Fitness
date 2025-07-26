import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function WaveSpinner({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={cn("animate-pulse", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12,4c-4.41,0-8,3.59-8,8s3.59,8,8,8s8-3.59,8-8S16.41,4,12,4z M12,20c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6 S15.31,20,12,20z"
        opacity=".4"
      />
      <path
        fill="currentColor"
        d="M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
      <style>{`
        path:nth-child(2) {
            animation-duration: 1.5s;
        }
      `}</style>
    </svg>
  );
}
