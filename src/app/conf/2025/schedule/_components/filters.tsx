import { Menu, Popover, Transition } from "@headlessui/react"
import { clsx } from "clsx"
import { ChevronDown, X } from "lucide-react"

type FiltersProps = {
  categories: { name: string; options: string[] }[]
  filterState: Record<string, string[]>
  onFilterChange: (category: string, option: string, checked: boolean) => void
  onReset: () => void
}

export function Filters({
  categories,
  filterState,
  onFilterChange,
  onReset,
}: FiltersProps) {
  return (
    <div className="flex justify-center gap-3 pb-10">
      <Menu as="div" className="relative inline-block text-left">
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md shadow-2xl ring-1 ring-blk/5 focus:outline-none">
            <div className="py-1">
              {categories.map(option => (
                <Menu.Item key={option.name}>
                  <span>{option.name}</span>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <Popover.Group className="flex items-baseline space-x-8">
        {categories.map((category, sectionIdx) => (
          <Popover
            as="div"
            key={category.name}
            id={`desktop-menu-${sectionIdx}`}
            className="relative inline-block text-left"
          >
            <Popover.Button className="group inline-flex cursor-pointer items-center justify-center bg-inherit p-1 px-2 text-neu-700 hover:text-neu-900">
              <span>{category.name}</span>
              {filterState[category.name].length ? (
                <span className="ml-1.5 bg-neu-200 px-1.5 py-0.5 tabular-nums text-neu-700">
                  {filterState[category.name].length}
                </span>
              ) : null}
              <ChevronDown
                className="-mr-1 ml-1 size-5 shrink-0 text-neu-400 group-hover:text-neu-500"
                aria-hidden="true"
              />
            </Popover.Button>

            <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-neu-0 p-4 shadow-lg focus:outline-none">
              <FilterOptions
                category={category}
                filterState={filterState}
                onFilterChange={onFilterChange}
              />
            </Popover.Panel>
          </Popover>
        ))}
      </Popover.Group>
      {Object.values(filterState).flat().length > 0 && (
        <ResetButton onReset={onReset} />
      )}
    </div>
  )
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="flex cursor-pointer items-center gap-x-2 bg-neu-100 px-2 py-1 text-neu-700 hover:bg-neu-200/80 hover:text-neu-900"
    >
      Reset filters <X className="inline-block size-4" />
    </button>
  )
}

interface FilterOptionsProps {
  category: { name: string; options: string[] }
  filterState: Record<string, string[]>
  onFilterChange: (category: string, option: string, checked: boolean) => void
}

function FilterOptions({
  category,
  filterState,
  onFilterChange,
}: FilterOptionsProps) {
  return (
    <form className="space-y-4">
      {category.options.map((option, optionIdx) => (
        <div key={option} className="flex items-center gap-3">
          <input
            id={`filter-${category.name}-${optionIdx}`}
            name={`${category.name}[]`}
            defaultValue={option}
            onChange={e => {
              const { checked, value } = e.target
              onFilterChange(category.name, value, checked)
            }}
            checked={filterState[category.name].includes(option)}
            type="checkbox"
            className="size-4 cursor-pointer rounded border-neu-300"
          />
          <label
            htmlFor={`filter-${category.name}-${optionIdx}`}
            className="cursor-pointer whitespace-nowrap pr-6 text-neu-900"
          >
            {option}
          </label>
        </div>
      ))}
    </form>
  )
}
