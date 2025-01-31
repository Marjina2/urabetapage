import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400"></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across multiple sources..."
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-[rgba(28,28,30,0.95)] border border-[rgba(188,19,254,0.2)] text-white placeholder-purple-400 focus:ring-2 focus:ring-[#bc13fe] focus:border-[#bc13fe]"
        />
      </div>
    </form>
  )
} 