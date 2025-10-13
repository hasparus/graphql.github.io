import type { ReactNode } from "react"
import { useMemo } from "react"

export interface CheckboxTreeItem {
  id: string
  label: string
  value?: string
  count?: number
  description?: string
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

  const { preparedItems } = useMemo(() => {
    const parentIds = new Set<string>()
    const defaultOpen = new Set<string>()

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
          parentIds.add(item.id)
          if (depth === 0) {
            defaultOpen.add(item.id)
          }
          prepared.children = enhance(item.children, depth + 1)
        }

        return prepared
      })
    }

    return {
      allParentIds: parentIds,
      preparedItems: enhance(items, 0),
    }
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
      const checkboxId = `checkbox-tree-${node.id}`

      return (
        <div key={node.id}>
          <div
            className="flex items-start gap-2 py-1"
            style={{ paddingInlineStart: node.depth * 16 }}
          >
            {isSelectable ? (
              <label
                htmlFor={checkboxId}
                className="flex grow cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={selectedValues.includes(node.value!)}
                  onChange={() => toggleValue(node.value!)}
                  className="size-4 border border-neu-400 bg-transparent [accent-color:hsl(var(--color-pri-base))]"
                />
                <span className="min-w-0 grow truncate text-left">
                  {node.label}
                </span>
                {typeof node.count === "number" && (
                  <span className="ml-auto shrink-0 text-xs text-neu-500">
                    {node.count}
                  </span>
                )}
              </label>
            ) : (
              <div className="flex grow flex-col text-sm">
                <span className="font-medium text-neu-600">{node.label}</span>
                {node.description ? (
                  <span className="text-xs text-neu-500">
                    {node.description}
                  </span>
                ) : null}
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
