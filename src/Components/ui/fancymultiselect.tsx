// https://craft.mxkaske.dev/post/fancy-multi-select

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem, CommandList,
} from "@/Components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

// Define a generic type for the items
type Item = {
  value: string;
  label: string;
};

// Make the component accept a list of items
type FancyMultiSelectProps<T extends Item> = {
  items: T[];
  placeholder?: string;
  width?: string;
};

export function FancyMultiSelect<T extends Item>({ items, placeholder, width }: FancyMultiSelectProps<T>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<T[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((item: T) => {
    setSelected(prev => prev.filter(s => s.value !== item.value));
  }, [setSelected]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected(prev => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, [inputRef.current, setSelected]);

  const selectables = items.filter(item => !selected.includes(item));

  return (
    <Command onKeyDown={handleKeyDown} className="tw-overflow-visible tw-bg-transparent">
      <div
        className="tw-group tw-border tw-border-input tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background tw-rounded-md tw-focus-within:tw-ring-2 tw-focus-within:tw-ring-ring tw-focus-within:tw-ring-offset-2"
      >
        <div className="tw-flex tw-gap-1 tw-flex-wrap">
          {selected.map((item) => {
            return (
              <Badge key={item.value} variant="secondary">
                {item.label}
                <button
                  className="tw-ml-1 tw-ring-offset-background tw-rounded-full tw-outline-none tw-focus:tw-ring-2 tw-focus:tw-ring-ring tw-focus:tw-ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="tw-h-3 tw-w-3 tw-text-muted-foreground tw-hover:tw-text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? "Select an item"}
            className={`tw-ml-2 tw-bg-transparent tw-outline-none tw-placeholder:tw-text-muted-foreground tw-flex-1 ${width ? `tw-w-${width}` : ''}`}
          />
        </div>
      </div>
      <div className="tw-relative tw-mt-2">
        {open && selectables.length > 0 ?
          <div className="tw-absolute tw-w-full tw-z-10 tw-top-0 tw-rounded-md tw-border tw-bg-popover tw-text-popover-foreground tw-shadow-md tw-outline-none tw-animate-in">
            <CommandList>
            <CommandGroup className="tw-h-full tw-overflow-auto">
              {selectables.map((item) => {
                return (
                  <CommandItem
                    key={item.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      setInputValue("");
                      setSelected(prev => [...prev, item]);
                    }}
                    className={"tw-cursor-pointer"}
                  >
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          </div>
          : null}
      </div>
    </Command>
  );
}