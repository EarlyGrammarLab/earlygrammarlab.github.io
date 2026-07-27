document.addEventListener('DOMContentLoaded', function() {
  console.log('=== Publications Filter Script Started ===');
  
  const tableBody = document.querySelector('#publications-table tbody');
  const rows = Array.from(tableBody?.querySelectorAll('tr') || []);
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-input');
  const yearSortSelect = document.getElementById('year-sort');
  
  console.log('Table body found:', !!tableBody);
  console.log('Row count:', rows.length);
  console.log('Filter buttons found:', filterButtons.length);
  console.log('Search input found:', !!searchInput);
  console.log('Year sort select found:', !!yearSortSelect);
  
  if (!tableBody) {
    console.error('CRITICAL: Table body not found. Check your HTML ID.');
    return;
  }
  
  if (rows.length === 0) {
    console.error('CRITICAL: No rows found in table body.');
    return;
  }
  
  if (filterButtons.length === 0) {
    console.error('WARNING: No filter buttons found. Check your HTML class names.');
  }
  
  // State tracking
  let activeCategory = '';
  
  // Helper: Apply both category and search filters
  const applyFilters = () => {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    
    rows.forEach((row, index) => {
      const type = row.dataset.type;
      const text = row.textContent.toLowerCase();
      const matchesCategory = activeCategory === '' || type === activeCategory;
      const matchesSearch = text.includes(searchTerm);
      
      if (matchesCategory && matchesSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
    
    console.log('Filters applied - category:', activeCategory || 'all', '- search:', searchTerm);
  };
  
  // Category filter buttons
  if (filterButtons.length > 0) {
    filterButtons.forEach((btn, index) => {
      console.log('Attaching click handler to button', index, ':', btn.dataset.category);
      
      btn.addEventListener('click', () => {
        console.log('Button clicked:', btn.dataset.category);
        
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        activeCategory = btn.dataset.category;
        applyFilters();
      });
    });
    
    console.log('All filter button listeners attached:', filterButtons.length);
  }
  
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      console.log('Search input changed:', searchInput.value);
      applyFilters();
    });
    
    console.log('Search input listener attached');
  }
  
  // Year sort
  if (yearSortSelect) {
    yearSortSelect.addEventListener('change', (e) => {
      console.log('Sort changed to:', e.target.value);
      
      const direction = e.target.value;
      const sortedRows = [...rows];
      
      sortedRows.sort((a, b) => {
        const valA = parseInt(a.dataset.year) || 0;
        const valB = parseInt(b.dataset.year) || 0;
        
        if (direction === 'newest') return valB - valA;
        if (direction === 'oldest') return valA - valB;
        if (direction === 'alpha') {
          const textA = a.querySelector('.listing-Title')?.textContent.toLowerCase() || '';
          const textB = b.querySelector('.listing-Title')?.textContent.toLowerCase() || '';
          return textA.localeCompare(textB);
        }
        return 0;
      });
      
      sortedRows.forEach(row => tableBody.appendChild(row));
      console.log('Sorting completed, new order:', sortedRows.map(r => r.dataset.year));
    });
    
    console.log('Sort select listener attached');
  }
  
  console.log('=== Publications Filter Script Finished ===');
});