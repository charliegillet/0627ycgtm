"use client";

/**
 * ResizablePane — A horizontal split layout with a draggable divider.
 * Left pane width is controlled by dragging the handle.
 */

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";

interface ResizablePaneProps {
  left: ReactNode;
  right: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizablePane({
  left,
  right,
  defaultWidth = 480,
  minWidth = 280,
  maxWidth = 900,
}: ResizablePaneProps) {
  const [width, setWidth] = useState(defaultWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const next = Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta));
      setWidth(next);
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left pane */}
      <div
        style={{ width }}
        className="shrink-0 h-full overflow-hidden relative"
      >
        {left}
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="w-[6px] shrink-0 cursor-col-resize relative z-20 flex items-center justify-center group"
      >
        <div className="absolute w-[1px] h-full bg-[#141822] group-hover:bg-[#00f0ff] transition-colors" />
        <div className="flex flex-col gap-[3px] z-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[3px] h-[3px] rounded-full bg-[#2a2f3e] group-hover:bg-[#00f0ff] transition-colors"
            />
          ))}
        </div>
        <div className="absolute inset-y-0 -inset-x-1 cursor-col-resize" />
      </div>

      {/* Right pane */}
      <div className="flex-1 h-full overflow-hidden relative min-w-0">
        {right}
      </div>
    </div>
  );
}
