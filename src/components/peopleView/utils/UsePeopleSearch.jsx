// usePeopleSearch.js
export const usePeopleSearch = (initialQuery = '') => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Search logic
    setIsSearching(false);
  };

  return { searchQuery, setSearchQuery, isSearching, handleSearch };
};
