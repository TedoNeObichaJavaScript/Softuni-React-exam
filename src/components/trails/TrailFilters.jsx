import { ChevronDown, RotateCcw, Search, X } from 'lucide-react';
import { DIFFICULTIES, SORT_OPTIONS } from '../../utils/constants';
import './TrailFilters.css';

const DEFAULT_SORT = SORT_OPTIONS[0].value;

export default function TrailFilters({
  search,
  difficulty,
  sort,
  onSearchChange,
  onDifficultyChange,
  onSortChange,
  onReset,
}) {
  const hasActiveFilters = search !== '' || difficulty !== '' || sort !== DEFAULT_SORT;

  return (
    <form className="trail-filters" role="search" noValidate onSubmit={(event) => event.preventDefault()}>
      <div className="trail-filters-search">
        <label htmlFor="trail-filters-search" className="sr-only">Search trails</label>
        <Search className="trail-filters-search-icon" size={18} strokeWidth={2} aria-hidden="true" />
        <input
          id="trail-filters-search"
          className="input trail-filters-search-input"
          type="search"
          placeholder="Search by name or region"
          autoComplete="off"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {search && (
          <button
            type="button"
            className="trail-filters-clear"
            aria-label="Clear search"
            onClick={() => onSearchChange('')}
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="trail-filters-select">
        <label htmlFor="trail-filters-difficulty" className="sr-only">Difficulty</label>
        <select
          id="trail-filters-difficulty"
          className="input"
          value={difficulty}
          onChange={(event) => onDifficultyChange(event.target.value)}
        >
          <option value="">All difficulties</option>
          {DIFFICULTIES.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="trail-filters-chevron" size={16} strokeWidth={2} aria-hidden="true" />
      </div>

      <div className="trail-filters-select">
        <label htmlFor="trail-filters-sort" className="sr-only">Sort by</label>
        <select
          id="trail-filters-sort"
          className="input"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="trail-filters-chevron" size={16} strokeWidth={2} aria-hidden="true" />
      </div>

      {hasActiveFilters && (
        <button type="button" className="btn btn-ghost trail-filters-reset" onClick={onReset}>
          <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
          Reset
        </button>
      )}
    </form>
  );
}
