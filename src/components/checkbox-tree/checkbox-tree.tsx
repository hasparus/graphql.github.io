import type { ReactNode } from "react"
import { useCallback } from "react"
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
  emptyFallback?: ReactNode
}

export function CheckboxTree({
  items,
  selectedValues,
  onSelectionChange,
  emptyFallback,
}: CheckboxTreeProps) {
  const toggleValue = useCallback(
    (value: string) => {
      const next = selectedValues.includes(value)
        ? selectedValues.filter(tag => tag !== value)
        : [...selectedValues, value]
      onSelectionChange(next)
    },
    [selectedValues, onSelectionChange],
  )

  const renderTree = (nodes: CheckboxTreeItem[], depth: number): ReactNode => {
    return nodes.map(node => {
      const isSelectable = Boolean(node.value)
      const isDisabled = node.disabled
      const isChecked = isSelectable
        ? selectedValues.includes(node.value!)
        : false
      const checkboxId = `checkbox-tree-${node.id}`

      return (
        <div key={node.id}>
          <div
            className="flex items-start gap-2 py-1"
            style={{
              paddingInlineStart: depth > 0 ? (depth - 1) * 16 : 0,
            }}
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
                      if (!isDisabled) toggleValue(node.value!)
                    }}
                    disabled={isDisabled}
                    className="peer sr-only"
                  />
                  <CheckboxIcon
                    checked={isChecked}
                    className={clsx(
                      "pointer-events-none size-5 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-neu-900",
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
                  {node.label}
                </span>
                {node.count ? ( // we intentionally don't display 0
                  <span
                    className={clsx(
                      "ml-auto shrink-0 text-xs",
                      isDisabled ? "text-neu-400" : "text-neu-700",
                    )}
                  >
                    {node.count}
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
                {node.label}
              </div>
            )}
          </div>

          {node.children && node.children.length > 0 ? (
            <div>{renderTree(node.children, depth + 1)}</div>
          ) : null}
        </div>
      )
    })
  }

  if (items.length === 0) {
    return (
      <div className="py-4 text-sm text-neu-500">
        {emptyFallback ?? "No matches"}
      </div>
    )
  }

  return <div>{renderTree(items, 0)}</div>
}
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(tag => tag !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  const renderTree = (nodes: PreparedTree[]): ReactNode => {
    return nodes.map(node => {
      const isSelectable = Boolean(node.value)
      const isChecked = isSelectable
        ? selectedValues.includes(node.value!)
        : false
      const checkboxId = `checkbox-tree-${node.id}`

      return (
        <div key={node.id}>
          <div
            className="flex items-start gap-2 py-1"
            style={{ paddingInlineStart: (node.depth - 1) * 16 }}
          >
            {isSelectable ? (
              <label
                htmlFor={checkboxId}
                className="flex grow cursor-pointer items-center gap-2"
              >
                <span className="flex shrink-0 items-center">
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleValue(node.value!)}
                    className="peer sr-only"
                  />
                  <CheckboxIcon
                    checked={isChecked}
                    className="pointer-events-none size-5 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-neu-900"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 grow truncate text-left text-neu-800">
                  {node.label}
                </span>
                {node.count ? ( // we intentionally don't display 0
                  <span className="ml-auto shrink-0 text-xs text-neu-700">
                    {node.count}
                  </span>
                ) : null}
              </label>
            ) : (
              <div className="typography-menu mt-4 text-sm text-neu-900 xl:mt-10">
                {node.label}
              </div>
            )}
          </div>

          {node.children && node.children.length > 0 ? (
            <div>{renderTree(node.children)}</div>
          ) : null}
        </div>
      )
    })
  }

  if (filteredTree.length === 0) {
    return (
      <div className="py-4 text-sm text-neu-500">
        {emptyFallback ?? "No matches"}
      </div>
    )
  }

  return <div>{renderTree(filteredTree)}</div>
}
