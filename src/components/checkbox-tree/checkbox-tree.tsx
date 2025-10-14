import type { ReactNode } from "react"
import { useMemo } from "react"
import { CheckboxIcon } from "@/app/conf/_design-system/pixelarticons/checkbox-icon"

export interface CheckboxTreeItem {
  id: string
  label: string
  value?: string
  count?: number
  children?: CheckboxTreeItem[]
}

interface CheckboxTreeProps {
  items: CheckboxTreeItem[]
  selectedValues: string[]
  onSelectionChange: (next: string[]) => void
  searchQuery?: string
  emptyFallback?: ReactNode
}

type PreparedItem = CheckboxTreeItem & { depth: number }

type PreparedTree = PreparedItem & {
  children?: PreparedTree[]
  matchesSearch: boolean
  hasVisibleChildren: boolean
}

export function CheckboxTree({
  items,
  selectedValues,
  onSelectionChange,
  searchQuery,
  emptyFallback,
}: CheckboxTreeProps) {
  const normalizedSearch = searchQuery?.trim().toLowerCase() ?? ""

  const preparedItems = useMemo(() => {
    function enhance(
      itemsToEnhance: CheckboxTreeItem[],
      depth: number,
    ): PreparedTree[] {
      return itemsToEnhance.map(item => {
        const prepared: PreparedTree = {
          ...item,
          depth,
          matchesSearch: normalizedSearch
            ? item.label.toLowerCase().includes(normalizedSearch)
            : true,
          hasVisibleChildren: false,
        }

        if (item.children && item.children.length > 0) {
          prepared.children = enhance(item.children, depth + 1)
        }

        return prepared
      })
    }

    return enhance(items, 0)
  }, [items, normalizedSearch])

  const filteredTree = useMemo(() => {
    function markVisibility(node: PreparedTree): PreparedTree | null {
      const { children } = node
      const visibleChildren = children
        ?.map(child => markVisibility(child))
        .filter((child): child is PreparedTree => Boolean(child))

      const hasVisibleChildren = Boolean(visibleChildren?.length)

      const shouldKeepNode =
        node.matchesSearch || !normalizedSearch || hasVisibleChildren

      if (!shouldKeepNode) return null

      return {
        ...node,
        children: visibleChildren,
        hasVisibleChildren,
      }
    }

    return preparedItems
      .map(node => markVisibility(node))
      .filter((node): node is PreparedTree => Boolean(node))
  }, [preparedItems, normalizedSearch])

  const toggleValue = (value: string) => {
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
