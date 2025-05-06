import { useState, useEffect, useRef } from 'react';
import { Form, Spinner, Button, Badge } from 'react-bootstrap';
import './TechStackDropdown.css';

const TechStackDropdown = ({ techStacks, selectedTechStacks, onSelect, loading, isFormField = true, showSearchByDefault = false }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStacks, setFilteredStacks] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsContainerRef = useRef(null);

  // Filter tech stacks based on search term
  useEffect(() => {
    if (!techStacks) return;
    
    if (searchTerm.trim() === '') {
      setFilteredStacks(techStacks);
    } else {
      const filtered = techStacks.filter(stack => 
        stack.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStacks(filtered);
    }
  }, [searchTerm, techStacks]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      // This will automatically focus the search input when dropdown opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
    }
  }, [dropdownOpen]);

  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    // Prevent event from propagating and immediately closing
    e.stopPropagation();
    setDropdownOpen(prevState => !prevState);
    if (!dropdownOpen) {
      // Clear search term when opening
      setSearchTerm('');
      setFilteredStacks(techStacks || []);
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (techStackName, event) => {
    // Prevent dropdown from closing
    event.preventDefault();
    event.stopPropagation();

    const isSelected = selectedTechStacks.includes(techStackName);
    
    if (isSelected) {
      // If already selected, remove it
      onSelect(selectedTechStacks.filter(name => name !== techStackName));
    } else {
      // If not selected, add it
      onSelect([...selectedTechStacks, techStackName]);
    }

    // Keep focus on the search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Clear all selections
  const clearAllSelections = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect([]);

    // Keep dropdown open and focus on search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter tech stacks based on search term
    if (!techStacks) return;

    const filtered = techStacks.filter(stack => 
      stack.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStacks(filtered);
  };

  // Clear search term
  const clearSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm('');
    
    // Reset to full list of tech stacks
    setFilteredStacks(techStacks || []);

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!dropdownOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHoverIndex(prev => Math.min(prev + 1, filteredStacks.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHoverIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (hoverIndex >= 0 && hoverIndex < filteredStacks.length) {
          // Prevent default and stop propagation
          e.preventDefault();
          e.stopPropagation();
          
          // Simulate checkbox change
          handleCheckboxChange(
            filteredStacks[hoverIndex].name, 
            { preventDefault: () => {}, stopPropagation: () => {} }
          );
        }
        break;
      case 'Escape':
        setDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  // Render dropdown within the component (not using portal)
  const renderDropdown = () => {
    if (!dropdownOpen) return null;
    
    return (
      <div 
        className="multiselect-dropdown"
        id="tech-stack-options"
        role="listbox"
        ref={optionsContainerRef}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          zIndex: 1500,
          maxHeight: '300px',
          overflowY: 'auto'
        }}
        // Prevent dropdown from closing on internal clicks
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="dropdown-header" style={{ padding: '10px' }}>
          <div className="search-container" style={{ width: '100%' }}>
            <i className="fas fa-search search-icon"></i>
            <input
              ref={searchInputRef}
              type="text"
              className="dropdown-search-input"
              placeholder="Search tech stacks..."
              value={searchTerm}
              onChange={handleSearchChange}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="Search tech stacks"
              style={{ 
                width: '100%',
                boxSizing: 'border-box',
                padding: '8px 30px 8px 30px'
              }}
            />
            {searchTerm && (
              <button 
                className="search-clear-btn" 
                onClick={clearSearch}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                aria-label="Clear search"
                style={{ 
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {filteredStacks.length === 0 ? (
          <div className="no-options">
            {techStacks.length === 0 ? (
              <>
                <i className="fas fa-info-circle me-2"></i>
                No tech stacks available yet
              </>
            ) : (
              <>
                <i className="fas fa-search me-2"></i>
                No tech stacks found matching "{searchTerm}"
              </>
            )}
          </div>
        ) : (
          <div 
            className="options-container custom-scrollbar"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {filteredStacks.map((stack, index) => (
              <div 
                key={stack._id} 
                className={`option-item ${selectedTechStacks.includes(stack.name) ? 'selected' : ''} ${hoverIndex === index ? 'hovered' : ''}`}
                onMouseDown={(e) => handleCheckboxChange(stack.name, e)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(-1)}
                role="option"
                aria-selected={selectedTechStacks.includes(stack.name)}
                tabIndex="-1"
              >
                <div className="checkbox-wrapper">
                  <div className={`custom-checkbox ${selectedTechStacks.includes(stack.name) ? 'checked' : ''}`}>
                    {selectedTechStacks.includes(stack.name) && (
                      <i className="fas fa-check check-icon"></i>
                    )}
                  </div>
                </div>
                <span className="option-label">{stack.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="tech-stack-multiselect" 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={dropdownOpen}
      aria-haspopup="listbox"
      aria-owns="tech-stack-options"
      style={{ position: 'relative' }}
    >
      <div 
        className={`multiselect-control ${dropdownOpen ? 'active' : ''}`} 
        onMouseDown={toggleDropdown}
        tabIndex="0"
        aria-label="Select roadmaps"
      >
        <div className="selected-display">
          {selectedTechStacks.length === 0 ? (
            <span className="placeholder">Select Tech Stacks</span>
          ) : (
            <>
              <div className="selected-badges">
                {isFormField ? (
                  <span className="selection-count">{selectedTechStacks.length} selected</span>
                ) : (
                  selectedTechStacks.map((stack, index) => (
                    <Badge 
                      key={index} 
                      bg="primary" 
                      className="selected-badge"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(stack, e);
                      }}
                    >
                      {stack}
                      <span className="badge-remove">×</span>
                    </Badge>
                  ))
                )}
              </div>
              {selectedTechStacks.length > 0 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="clear-btn" 
                  onMouseDown={clearAllSelections}
                >
                  Clear
                </Button>
              )}
            </>
          )}
        </div>
        <div className="dropdown-indicators">
          {loading && (
            <Spinner 
              animation="border" 
              variant="primary" 
              size="sm"
              className="me-2"
            />
          )}
          <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
        </div>
      </div>

      {renderDropdown()}
    </div>
  );
};

export default TechStackDropdown;