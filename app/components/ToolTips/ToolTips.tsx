import "./ToolTips.css";

import * as Tooltip from "@radix-ui/react-tooltip";

import { QuestionIcon } from "~/components/icons";

type ToolTipsProps = {
  content: string;
  className?: string;
};

export function ToolTips({ content, className }: ToolTipsProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            aria-label="Tooltip trigger"
            className={`inline-flex cursor-pointer items-center ${className ?? ""}`}
            type="button"
          >
            <QuestionIcon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="text-body-m data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade z-50 rounded-md bg-gray-1 px-3 py-2 text-white shadow-lg will-change-[transform,opacity]"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-1" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
