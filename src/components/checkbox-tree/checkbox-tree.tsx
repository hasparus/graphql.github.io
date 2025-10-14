import type { ReactNode } from "react"
import { clsx } from "clsx"
import { CheckboxIcon } from "@/app/conf/_design-system/pixelarticons/checkbox-icon"

export interface CheckboxTreeItem {
  id: string
  label: string
  value?: string
  count?: number
  disabled?: boolean
  children?: CheckboxTreeItem[]
}

interface CheckboxTreeProps {
  items: CheckboxTreeItem[]
  selectedValues: string[]
  onSelectionChange: (next: string[]) => void
  depth?: number
}

export function CheckboxTree({
  items,
  selectedValues,
  onSelectionChange,
  depth = 0,
}: CheckboxTreeProps) {
  return (
    <div>
      {items.map(item => {
        const isSelectable = Boolean(item.value)
        const isDisabled = item.disabled
        const isChecked = isSelectable
          ? selectedValues.includes(item.value!)
          : false
        const checkboxId = `checkbox-tree-${item.id}`

        const toggleValue = (value: string) => {
          const next = selectedValues.includes(value)
            ? selectedValues.filter(tag => tag !== value)
            : [...selectedValues, value]
          onSelectionChange(next)
        }

        return (
          <div key={item.id}>
            <div
              className="flex items-start gap-2 py-1"
              style={{ paddingInlineStart: (depth - 1) * 16 }}
            >
              {isSelectable ? (
                <label
                  htmlFor={checkboxId}
                  className={clsx(
                    "flex grow items-center gap-2",
                    isDisabled
                      ? "cursor-not-allowed text-neu-500"
                      : "cursor-pointer",
                  )}
                  aria-disabled={isDisabled}
                >
                  <span className="flex shrink-0 items-center">
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (!isDisabled) toggleValue(item.value!)
                      }}
                      disabled={isDisabled}
                      className="peer sr-only"
                    />
                    <CheckboxIcon
                      checked={isChecked}
                      className={clsx(
                        "pointer-events-none size-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-neu-900",
                        isDisabled ? "text-neu-300" : undefined,
                      )}
                      aria-hidden
                    />
                  </span>
                  <span
                    className={clsx(
                      "min-w-0 grow truncate text-left",
                      isDisabled ? "text-neu-500" : "text-neu-800",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.count ? ( // we intentionally don't display 0
                    <span
                      className={clsx(
                        "ml-auto shrink-0 text-xs",
                        isDisabled ? "text-neu-400" : "text-neu-700",
                      )}
                    >
                      {item.count}
                    </span>
                  ) : null}
                </label>
              ) : (
                <div
                  className={clsx(
                    "typography-menu mt-4 text-sm xl:mt-10",
                    isDisabled ? "text-neu-500" : "text-neu-900",
                  )}
                  aria-disabled={isDisabled}
                >
                  {item.label}
                </div>
              )}
            </div>

            {item.children && item.children.length > 0 ? (
              <CheckboxTree
                items={item.children}
                selectedValues={selectedValues}
                onSelectionChange={onSelectionChange}
                depth={depth + 1}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
