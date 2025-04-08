// MCP System Interactive Demo
document.addEventListener('DOMContentLoaded', function() {
  // Demo data for plastic bag product gallery
  const demoData = {
    prompts: [
      "I need a product gallery for different types of plastic bags.",
      "Can you add filtering by material type to the gallery?",
      "How can we display the bag specifications clearly?",
      "Add a comparison feature for different bag calibers."
    ],
    builderResponses: {
      "I need a product gallery for different types of plastic bags.": {
        role: "Builder",
        agent: "Claude",
        content: "I'll create a responsive product gallery for your plastic bags. Here's the initial HTML and CSS structure:\n\n```html\n<div class=\"product-gallery\">\n  <div class=\"filters\">\n    <div class=\"filter-group\">\n      <h4>Material</h4>\n      <label><input type=\"checkbox\" value=\"ldpe\"> LDPE</label>\n      <label><input type=\"checkbox\" value=\"hdpe\"> HDPE</label>\n      <label><input type=\"checkbox\" value=\"pp\"> Polypropylene</label>\n      <label><input type=\"checkbox\" value=\"biodegradable\"> Biodegradable</label>\n    </div>\n    <div class=\"filter-group\">\n      <h4>Size</h4>\n      <label><input type=\"checkbox\" value=\"small\"> Small</label>\n      <label><input type=\"checkbox\" value=\"medium\"> Medium</label>\n      <label><input type=\"checkbox\" value=\"large\"> Large</label>\n      <label><input type=\"checkbox\" value=\"custom\"> Custom</label>\n    </div>\n    <div class=\"filter-group\">\n      <h4>Use</h4>\n      <label><input type=\"checkbox\" value=\"food\"> Food Storage</label>\n      <label><input type=\"checkbox\" value=\"industrial\"> Industrial</label>\n      <label><input type=\"checkbox\" value=\"retail\"> Retail</label>\n      <label><input type=\"checkbox\" value=\"medical\"> Medical</label>\n    </div>\n  </div>\n  <div class=\"products\">\n    <!-- Product items will be generated dynamically -->\n  </div>\n</div>\n```\n\nAnd here's the JavaScript to populate the gallery with product data:\n\n```javascript\nconst products = [\n  {\n    id: 1,\n    name: \"LDPE Food Storage Bag\",\n    material: \"ldpe\",\n    size: \"medium\",\n    use: \"food\",\n    caliber: \"40 microns\",\n    description: \"Food-safe LDPE bags ideal for storage and preservation.\",\n    image: \"ldpe-food-bag.jpg\"\n  },\n  {\n    id: 2,\n    name: \"HDPE Industrial Strength Bag\",\n    material: \"hdpe\",\n    size: \"large\",\n    use: \"industrial\",\n    caliber: \"60 microns\",\n    description: \"Heavy-duty HDPE bags for industrial applications.\",\n    image: \"hdpe-industrial-bag.jpg\"\n  },\n  // More products would be added here\n];\n\nfunction renderProducts(productList) {\n  const productsContainer = document.querySelector('.products');\n  productsContainer.innerHTML = '';\n  \n  productList.forEach(product => {\n    const productElement = document.createElement('div');\n    productElement.className = 'product-item';\n    productElement.dataset.id = product.id;\n    productElement.dataset.material = product.material;\n    productElement.dataset.size = product.size;\n    productElement.dataset.use = product.use;\n    \n    productElement.innerHTML = `\n      <img src=\"images/${product.image}\" alt=\"${product.name}\">\n      <h3>${product.name}</h3>\n      <div class=\"specs\">\n        <span class=\"material\">Material: ${product.material.toUpperCase()}</span>\n        <span class=\"size\">Size: ${product.size}</span>\n        <span class=\"caliber\">Caliber: ${product.caliber}</span>\n        <span class=\"use\">Use: ${product.use}</span>\n      </div>\n      <p>${product.description}</p>\n      <button class=\"details-btn\">View Details</button>\n    `;\n    \n    productsContainer.appendChild(productElement);\n  });\n}\n\n// Initial render\nrenderProducts(products);\n```",
        code: true
      },
      "Can you add filtering by material type to the gallery?": {
        role: "Builder",
        agent: "ChatGPT",
        content: "I'll implement filtering functionality for the product gallery. Here's the JavaScript code to handle filtering by material type and other properties:\n\n```javascript\n// Set up filtering functionality\nfunction setupFilters() {\n  const checkboxes = document.querySelectorAll('.filters input[type=\"checkbox\"]');\n  const products = document.querySelectorAll('.product-item');\n  \n  // Store active filters\n  const activeFilters = {\n    material: [],\n    size: [],\n    use: []\n  };\n  \n  checkboxes.forEach(checkbox => {\n    checkbox.addEventListener('change', function() {\n      const filterType = this.closest('.filter-group').querySelector('h4').textContent.toLowerCase();\n      const filterValue = this.value;\n      \n      if (this.checked) {\n        // Add to active filters\n        activeFilters[filterType].push(filterValue);\n      } else {\n        // Remove from active filters\n        const index = activeFilters[filterType].indexOf(filterValue);\n        if (index > -1) {\n          activeFilters[filterType].splice(index, 1);\n        }\n      }\n      \n      // Apply filters\n      applyFilters(activeFilters, products);\n    });\n  });\n}\n\nfunction applyFilters(activeFilters, products) {\n  products.forEach(product => {\n    let shouldShow = true;\n    \n    // Check each filter type\n    for (const [filterType, filterValues] of Object.entries(activeFilters)) {\n      // If no filters of this type are selected, skip this check\n      if (filterValues.length === 0) continue;\n      \n      // Get the product's value for this filter type\n      const productValue = product.dataset[filterType];\n      \n      // If the product's value isn't in the selected filters, hide it\n      if (!filterValues.includes(productValue)) {\n        shouldShow = false;\n        break;\n      }\n    }\n    \n    // Show or hide the product based on filter results\n    if (shouldShow) {\n      product.style.display = 'block';\n    } else {\n      product.style.display = 'none';\n    }\n  });\n  \n  // Update count of visible products\n  updateProductCount();\n}\n\nfunction updateProductCount() {\n  const visibleProducts = document.querySelectorAll('.product-item[style=\"display: block\"]');\n  const countElement = document.querySelector('.product-count');\n  if (countElement) {\n    countElement.textContent = `Showing ${visibleProducts.length} products`;\n  }\n}\n\n// Initialize filters\nsetupFilters();\n```\n\nI've also added a CSS animation to highlight when filters are applied:\n\n```css\n.product-item {\n  transition: opacity 0.3s ease-in-out;\n}\n\n.filters input[type=\"checkbox\"]:checked + label {\n  font-weight: bold;\n  color: #4f46e5;\n}\n\n.filter-active .filter-group h4 {\n  color: #4f46e5;\n}\n```\n\nThis implementation allows users to filter products by multiple criteria simultaneously. When a user selects a material type checkbox, only products with that material will be displayed. The same applies to size and use filters.",
        code: true
      },
      "How can we display the bag specifications clearly?": {
        role: "Builder",
        agent: "Claude",
        content: "To display the plastic bag specifications clearly, I'll create a detailed specifications table that appears when a user clicks on a product. This provides a structured way to show all the technical details. Here's the implementation:\n\n```html\n<div class=\"product-details-modal\" id=\"product-details-modal\">\n  <div class=\"modal-content\">\n    <span class=\"close-modal\">&times;</span>\n    <div class=\"product-details-container\">\n      <div class=\"product-image-large\">\n        <img id=\"modal-product-image\" src=\"\" alt=\"Product Image\">\n      </div>\n      <div class=\"product-info\">\n        <h2 id=\"modal-product-name\"></h2>\n        <p id=\"modal-product-description\"></p>\n        \n        <h3>Specifications</h3>\n        <table class=\"specs-table\">\n          <tr>\n            <th>Material</th>\n            <td id=\"modal-product-material\"></td>\n          </tr>\n          <tr>\n            <th>Size</th>\n            <td id=\"modal-product-size\"></td>\n          </tr>\n          <tr>\n            <th>Caliber</th>\n            <td id=\"modal-product-caliber\"></td>\n          </tr>\n          <tr>\n            <th>Use Case</th>\n            <td id=\"modal-product-use\"></td>\n          </tr>\n          <tr>\n            <th>Tensile Strength</th>\n            <td id=\"modal-product-strength\"></td>\n          </tr>\n          <tr>\n            <th>Temperature Range</th>\n            <td id=\"modal-product-temperature\"></td>\n          </tr>\n          <tr>\n            <th>Transparency</th>\n            <td id=\"modal-product-transparency\"></td>\n          </tr>\n          <tr>\n            <th>Food Safe</th>\n            <td id=\"modal-product-foodsafe\"></td>\n          </tr>\n        </table>\n        \n        <div class=\"product-actions\">\n          <button class=\"request-sample\">Request Sample</button>\n          <button class=\"add-to-quote\">Add to Quote</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n```\n\nAnd here's the JavaScript to populate and show the modal:\n\n```javascript\n// Enhanced product data with more specifications\nconst enhancedProducts = products.map(product => {\n  // Add additional specifications based on material type\n  let additionalSpecs = {};\n  \n  if (product.material === 'ldpe') {\n    additionalSpecs = {\n      strength: 'Medium (15-30 MPa)',\n      temperature: '-50°C to 80°C',\n      transparency: 'Translucent',\n      foodSafe: 'Yes'\n    };\n  } else if (product.material === 'hdpe') {\n    additionalSpecs = {\n      strength: 'High (30-40 MPa)',\n      temperature: '-50°C to 120°C',\n      transparency: 'Opaque',\n      foodSafe: 'Yes'\n    };\n  } else if (product.material === 'pp') {\n    additionalSpecs = {\n      strength: 'High (30-40 MPa)',\n      temperature: '0°C to 135°C',\n      transparency: 'Translucent to Clear',\n      foodSafe: 'Yes'\n    };\n  } else if (product.material === 'biodegradable') {\n    additionalSpecs = {\n      strength: 'Low to Medium (10-20 MPa)',\n      temperature: '-20°C to 70°C',\n      transparency: 'Varies',\n      foodSafe: 'Yes'\n    };\n  }\n  \n  return { ...product, ...additionalSpecs };\n});\n\n// Set up modal functionality\nfunction setupModal() {\n  const modal = document.getElementById('product-details-modal');\n  const closeBtn = document.querySelector('.close-modal');\n  const detailButtons = document.querySelectorAll('.details-btn');\n  \n  detailButtons.forEach(button => {\n    button.addEventListener('click', function() {\n      const productId = parseInt(this.closest('.product-item').dataset.id);\n      const product = enhancedProducts.find(p => p.id === productId);\n      \n      if (product) {\n        // Populate modal with product details\n        document.getElementById('modal-product-image').src = `images/${product.image}`;\n        document.getElementById('modal-product-name').textContent = product.name;\n        document.getElementById('modal-product-description').textContent = product.description;\n        document.getElementById('modal-product-material').textContent = product.material.toUpperCase();\n        document.getElementById('modal-product-size').textContent = product.size;\n        document.getElementById('modal-product-caliber').textContent = product.caliber;\n        document.getElementById('modal-product-use').textContent = product.use;\n        document.getElementById('modal-product-strength').textContent = product.strength;\n        document.getElementById('modal-product-temperature').textContent = product.temperature;\n        document.getElementById('modal-product-transparency').textContent = product.transparency;\n        document.getElementById('modal-product-foodsafe').textContent = product.foodSafe;\n        \n        // Show modal\n        modal.style.display = 'block';\n      }\n    });\n  });\n  \n  // Close modal when clicking the close button\n  closeBtn.addEventListener('click', function() {\n    modal.style.display = 'none';\n  });\n  \n  // Close modal when clicking outside the content\n  window.addEventListener('click', function(event) {\n    if (event.target === modal) {\n      modal.style.display = 'none';\n    }\n  });\n}\n\n// Initialize modal\nsetupModal();\n```\n\nAnd the CSS for the modal and specifications table:\n\n```css\n/* Modal styles */\n.product-details-modal {\n  display: none;\n  position: fixed;\n  z-index: 1000;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n}\n\n.modal-content {\n  background-color: white;\n  margin: 5% auto;\n  padding: 20px;\n  border-radius: 8px;\n  width: 80%;\n  max-width: 1000px;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n}\n\n.close-modal {\n  color: #aaa;\n  float: right;\n  font-size: 28px;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n.close-modal:hover {\n  color: #333;\n}\n\n.product-details-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 30px;\n}\n\n.product-image-large {\n  flex: 1;\n  min-width: 300px;\n}\n\n.product-image-large img {\n  width: 100%;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.product-info {\n  flex: 2;\n  min-width: 300px;\n}\n\n/* Specifications table */\n.specs-table {\n  width: 100%;\n  border-collapse: collapse;\n  margin: 20px 0;\n}\n\n.specs-table th, .specs-table td {\n  padding: 12px 15px;\n  text-align: left;\n  border-bottom: 1px solid #e5e7eb;\n}\n\n.specs-table th {\n  background-color: #f9fafb;\n  font-weight: 600;\n  width: 40%;\n}\n\n.specs-table tr:last-child th,\n.specs-table tr:last-child td {\n  border-bottom: none;\n}\n\n.product-actions {\n  margin-top: 20px;\n  display: flex;\n  gap: 10px;\n}\n\n.product-actions button {\n  padding: 10px 20px;\n  border-radius: 6px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.request-sample {\n  background-color: white;\n  color: #4f46e5;\n  border: 1px solid #4f46e5;\n}\n\n.request-sample:hover {\n  background-color: #f5f3ff;\n}\n\n.add-to-quote {\n  background-color: #4f46e5;\n  color: white;\n  border: 1px solid #4f46e5;\n}\n\n.add-to-quote:hover {\n  background-color: #4338ca;\n}\n```\n\nThis implementation provides a clean, organized way to display all the technical specifications for each plastic bag. When a user clicks the \"View Details\" button, they'll see a modal with a comprehensive specifications table that includes material properties, temperature ranges, strength ratings, and food safety information.",
        code: true
      },
      "Add a comparison feature for different bag calibers.": {
        role: "Builder",
        agent: "ChatGPT",
        content: "I'll implement a comparison feature that allows users to compare different plastic bags side by side, with a focus on caliber differences. Here's the implementation:\n\n```javascript\n// Comparison feature implementation\nlet comparisonList = [];\nconst maxCompareItems = 4;\n\nfunction setupComparisonFeature() {\n  // Add comparison button to each product\n  document.querySelectorAll('.product-item').forEach(product => {\n    const actionsDiv = document.createElement('div');\n    actionsDiv.className = 'product-actions';\n    \n    const compareBtn = document.createElement('button');\n    compareBtn.className = 'compare-btn';\n    compareBtn.textContent = 'Add to Compare';\n    compareBtn.dataset.productId = product.dataset.id;\n    \n    actionsDiv.appendChild(compareBtn);\n    product.appendChild(actionsDiv);\n    \n    // Add click event for compare button\n    compareBtn.addEventListener('click', function() {\n      const productId = parseInt(this.dataset.productId);\n      toggleProductComparison(productId, this);\n    });\n  });\n  \n  // Add comparison bar to the page\n  const comparisonBar = document.createElement('div');\n  comparisonBar.className = 'comparison-bar';\n  comparisonBar.innerHTML = `\n    <div class=\"comparison-bar-content\">\n      <div class=\"comparison-items\"></div>\n      <div class=\"comparison-actions\">\n        <span class=\"comparison-count\">0 items</span>\n        <button class=\"compare-now-btn\" disabled>Compare Now</button>\n        <button class=\"clear-comparison-btn\" disabled>Clear All</button>\n      </div>\n    </div>\n  `;\n  document.querySelector('.product-gallery').appendChild(comparisonBar);\n  \n  // Add event listeners for comparison actions\n  document.querySelector('.compare-now-btn').addEventListener('click', showComparisonModal);\n  document.querySelector('.clear-comparison-btn').addEventListener('click', clearComparison);\n  \n  // Create comparison modal\n  const comparisonModal = document.createElement('div');\n  comparisonModal.className = 'comparison-modal';\n  comparisonModal.id = 'comparison-modal';\n  comparisonModal.innerHTML = `\n    <div class=\"modal-content comparison-modal-content\">\n      <span class=\"close-modal\">&times;</span>\n      <h2>Plastic Bag Comparison</h2>\n      <div class=\"comparison-table-container\">\n        <table class=\"comparison-table\">\n          <thead>\n            <tr>\n              <th>Feature</th>\n              <!-- Product columns will be added dynamically -->\n            </tr>\n          </thead>\n          <tbody>\n            <tr class=\"image-row\">\n              <th>Image</th>\n              <!-- Product images will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Name</th>\n              <!-- Product names will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Material</th>\n              <!-- Product materials will be added dynamically -->\n            </tr>\n            <tr class=\"highlight-row\">\n              <th>Caliber</th>\n              <!-- Product calibers will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Size</th>\n              <!-- Product sizes will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Use Case</th>\n              <!-- Product uses will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Tensile Strength</th>\n              <!-- Product strengths will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Temperature Range</th>\n              <!-- Product temperature ranges will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Transparency</th>\n              <!-- Product transparency will be added dynamically -->\n            </tr>\n            <tr>\n              <th>Food Safe</th>\n              <!-- Product food safety will be added dynamically -->\n            </tr>\n          </tbody>\n        </table>\n      </div>\n      <div class=\"caliber-comparison-chart\">\n        <h3>Caliber Comparison Chart</h3>\n        <canvas id=\"caliber-chart\"></canvas>\n      </div>\n    </div>\n  `;\n  document.body.appendChild(comparisonModal);\n  \n  // Add close functionality to comparison modal\n  document.querySelector('#comparison-modal .close-modal').addEventListener('click', function() {\n    document.getElementById('comparison-modal').style.display = 'none';\n  });\n}\n\nfunction toggleProductComparison(productId, button) {\n  const productIndex = comparisonList.indexOf(productId);\n  \n  if (productIndex === -1) {\n    // Add to comparison if not already in list and if list isn't full\n    if (comparisonList.length < maxCompareItems) {\n      comparisonList.push(productId);\n      button.textContent = 'Remove from Compare';\n      button.classList.add('active');\n      updateComparisonBar();\n    } else {\n      alert(`You can only compare up to ${maxCompareItems} items at once.`);\n    }\n  } else {\n    // Remove from comparison\n    comparisonList.splice(productIndex, 1);\n    button.textContent = 'Add to Compare';\n    button.classList.remove('active');\n    updateComparisonBar();\n  }\n}\n\nfunction updateComparisonBar() {\n  const comparisonItems = document.querySelector('.comparison-items');\n  const comparisonCount = document.querySelector('.comparison-count');\n  const compareNowBtn = document.querySelector('.compare-now-btn');\n  const clearComparisonBtn = document.querySelector('.clear-comparison-btn');\n  \n  // Update items in comparison bar\n  comparisonItems.innerHTML = '';\n  comparisonList.forEach(productId => {\n    const product = enhancedProducts.find(p => p.id === productId);\n    if (product) {\n      const itemElement = document.createElement('div');\n      itemElement.className = 'comparison-item';\n      itemElement.innerHTML = `\n        <img src=\"images/${product.image}\" alt=\"${product.name}\">\n        <span>${product.name}</span>\n        <button class=\"remove-comparison-item\" data-product-id=\"${product.id}\">×</button>\n      `;\n      comparisonItems.appendChild(itemElement);\n    }\n  });\n  \n  // Add event listeners to remove buttons\n  document.querySelectorAll('.remove-comparison-item').forEach(button => {\n    button.addEventListener('click', function() {\n      const productId = parseInt(this.dataset.productId);\n      const productButton = document.querySelector(`.compare-btn[data-product-id=\"${productId}\"]`);\n      toggleProductComparison(productId, productButton);\n    });\n  });\n  \n  // Update count and button states\n  comparisonCount.textContent = `${comparisonList.length} items`;\n  \n  if (comparisonList.length >= 2) {\n    compareNowBtn.disabled = false;\n    clearComparisonBtn.disabled = false;\n    document.querySelector('.comparison-bar').classList.add('active');\n  } else {\n    compareNowBtn.disabled = true;\n    clearComparisonBtn.disabled = comparisonList.length === 0;\n    if (comparisonList.length === 0) {\n      document.querySelector('.comparison-bar').classList.remove('active');\n    }\n  }\n}\n\nfunction showComparisonModal() {\n  if (comparisonList.length < 2) {\n    alert('Please select at least 2 items to compare.');\n    return;\n  }\n  \n  // Get selected products\n  const selectedProducts = enhancedProducts.filter(product => \n    comparisonList.includes(product.id)\n  );\n  \n  // Update comparison table header\n  const tableHeader = document.querySelector('.comparison-table thead tr');\n  tableHeader.innerHTML = '<th>Feature</th>';\n  selectedProducts.forEach(product => {\n    tableHeader.innerHTML += `<th>${product.name}</th>`;\n  });\n  \n  // Update comparison table rows\n  const rows = {\n    'image-row': product => `<td><img src=\"images/${product.image}\" alt=\"${product.name}\" class=\"comparison-image\"></td>`,\n    'Name': product => `<td>${product.name}</td>`,\n    'Material': product => `<td>${product.material.toUpperCase()}</td>`,\n    'Caliber': product => `<td class=\"highlight-cell\">${product.caliber}</td>`,\n    'Size': product => `<td>${product.size}</td>`,\n    'Use Case': product => `<td>${product.use}</td>`,\n    'Tensile Strength': product => `<td>${product.strength}</td>`,\n    'Temperature Range': product => `<td>${product.temperature}</td>`,\n    'Transparency': product => `<td>${product.transparency}</td>`,\n    'Food Safe': product => `<td>${product.foodSafe}</td>`\n  };\n  \n  Object.entries(rows).forEach(([rowName, cellFunction]) => {\n    let row;\n    if (rowName === 'image-row') {\n      row = document.querySelector('.comparison-table .image-row');\n      row.innerHTML = '<th>Image</th>';\n    } else {\n      row = document.querySelector(`.comparison-table tbody tr:has(th:contains(\"${rowName}\"))`);\n      if (!row) return;\n    }\n    \n    selectedProducts.forEach(product => {\n      row.innerHTML += cellFunction(product);\n    });\n  });\n  \n  // Create caliber comparison chart\n  createCaliberChart(selectedProducts);\n  \n  // Show modal\n  document.getElementById('comparison-modal').style.display = 'block';\n}\n\nfunction createCaliberChart(products) {\n  const ctx = document.getElementById('caliber-chart').getContext('2d');\n  \n  // Extract caliber values (convert from string like \"40 microns\" to number 40)\n  const calibers = products.map(product => {\n    const match = product.caliber.match(/(\\d+)\\s*microns?/);\n    return match ? parseInt(match[1]) : 0;\n  });\n  \n  // Create chart\n  if (window.caliberChart) {\n    window.caliberChart.destroy();\n  }\n  \n  window.caliberChart = new Chart(ctx, {\n    type: 'bar',\n    data: {\n      labels: products.map(p => p.name),\n      datasets: [{\n        label: 'Caliber (microns)',\n        data: calibers,\n        backgroundColor: [\n          'rgba(79, 70, 229, 0.7)',\n          'rgba(139, 92, 246, 0.7)',\n          'rgba(16, 185, 129, 0.7)',\n          'rgba(239, 68, 68, 0.7)'\n        ],\n        borderColor: [\n          'rgba(79, 70, 229, 1)',\n          'rgba(139, 92, 246, 1)',\n          'rgba(16, 185, 129, 1)',\n          'rgba(239, 68, 68, 1)'\n        ],\n        borderWidth: 1\n      }]\n    },\n    options: {\n      responsive: true,\n      scales: {\n        y: {\n          beginAtZero: true,\n          title: {\n            display: true,\n            text: 'Microns'\n          }\n        }\n      },\n      plugins: {\n        title: {\n          display: true,\n          text: 'Plastic Bag Caliber Comparison',\n          font: {\n            size: 16\n          }\n        },\n        tooltip: {\n          callbacks: {\n            label: function(context) {\n              return `${context.raw} microns`;\n            }\n          }\n        }\n      }\n    }\n  });\n}\n\nfunction clearComparison() {\n  // Reset all comparison buttons\n  document.querySelectorAll('.compare-btn.active').forEach(button => {\n    button.textContent = 'Add to Compare';\n    button.classList.remove('active');\n  });\n  \n  // Clear comparison list\n  comparisonList = [];\n  updateComparisonBar();\n}\n\n// Initialize comparison feature\nsetupComparisonFeature();\n```\n\nAnd here's the CSS for the comparison feature:\n\n```css\n/* Comparison feature styles */\n.product-actions {\n  display: flex;\n  gap: 10px;\n  margin-top: 10px;\n}\n\n.compare-btn {\n  background-color: white;\n  border: 1px solid #6b7280;\n  color: #6b7280;\n  padding: 6px 12px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.2s;\n}\n\n.compare-btn:hover {\n  border-color: #4f46e5;\n  color: #4f46e5;\n}\n\n.compare-btn.active {\n  background-color: #4f46e5;\n  border-color: #4f46e5;\n  color: white;\n}\n\n/* Comparison bar */\n.comparison-bar {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: white;\n  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);\n  transform: translateY(100%);\n  transition: transform 0.3s ease-in-out;\n  z-index: 900;\n}\n\n.comparison-bar.active {\n  transform: translateY(0);\n}\n\n.comparison-bar-content {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 15px 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.comparison-items {\n  display: flex;\n  gap: 15px;\n  flex-grow: 1;\n  overflow-x: auto;\n  padding-bottom: 5px;\n}\n\n.comparison-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background-color: #f9fafb;\n  padding: 8px 12px;\n  border-radius: 6px;\n  min-width: 200px;\n}\n\n.comparison-item img {\n  width: 40px;\n  height: 40px;\n  object-fit: cover;\n  border-radius: 4px;\n}\n\n.comparison-item span {\n  flex-grow: 1;\n  font-size: 14px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.remove-comparison-item {\n  background: none;\n  border: none;\n  color: #6b7280;\n  font-size: 18px;\n  cursor: pointer;\n  padding: 0 5px;\n}\n\n.remove-comparison-item:hover {\n  color: #ef4444;\n}\n\n.comparison-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  white-space: nowrap;\n}\n\n.comparison-count {\n  color: #6b7280;\n  font-size: 14px;\n}\n\n.compare-now-btn {\n  background-color: #4f46e5;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n\n.compare-now-btn:disabled {\n  background-color: #c7d2fe;\n  cursor: not-allowed;\n}\n\n.clear-comparison-btn {\n  background-color: white;\n  color: #6b7280;\n  border: 1px solid #6b7280;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}\n\n.clear-comparison-btn:disabled {\n  border-color: #e5e7eb;\n  color: #9ca3af;\n  cursor: not-allowed;\n}\n\n/* Comparison modal */\n.comparison-modal-content {\n  width: 90%;\n  max-width: 1200px;\n}\n\n.comparison-table-container {\n  overflow-x: auto;\n  margin: 20px 0;\n}\n\n.comparison-table {\n  width: 100%;\n  border-collapse: collapse;\n  border: 1px solid #e5e7eb;\n}\n\n.comparison-table th,\n.comparison-table td {\n  padding: 12px 15px;\n  text-align: left;\n  border: 1px solid #e5e7eb;\n}\n\n.comparison-table thead th {\n  background-color: #f9fafb;\n  font-weight: 600;\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n\n.comparison-table tbody th {\n  background-color: #f9fafb;\n  font-weight: 600;\n  width: 180px;\n  position: sticky;\n  left: 0;\n  z-index: 5;\n}\n\n.comparison-image {\n  width: 100px;\n  height: 100px;\n  object-fit: cover;\n  border-radius: 6px;\n  display: block;\n  margin: 0 auto;\n}\n\n.highlight-row th,\n.highlight-row td {\n  background-color: #eff6ff;\n}\n\n.highlight-cell {\n  font-weight: 600;\n  color: #4f46e5;\n}\n\n.caliber-comparison-chart {\n  margin-top: 30px;\n  padding-top: 20px;\n  border-top: 1px solid #e5e7eb;\n}\n\n#caliber-chart {\n  max-height: 300px;\n}\n```\n\nThis implementation adds a comprehensive comparison feature that allows users to:\n\n1. Add up to 4 different plastic bags to a comparison list\n2. View a comparison bar at the bottom of the screen showing selected items\n3. Open a detailed comparison modal that displays all specifications side by side\n4. See a visual chart comparing the calibers of the selected bags\n\nThe feature highlights the caliber differences both in the table (with highlighted cells) and in a bar chart for easy visual comparison. This makes it simple for users to compare different bag options and choose the right caliber for their needs.",
        code: true
      }
    },
    judgeResponses: {
      "I need a product gallery for different types of plastic bags.": {
        role: "Judge",
        agent: "ChatGPT",
        content: "The Builder has provided a solid foundation for a plastic bag product gallery, but I have a few suggestions for improvement:\n\n1. **Accessibility Improvements**:\n   - The checkboxes in the filter section should have proper labels with `for` attributes matching input IDs\n   - Add ARIA attributes to make the filtering more accessible\n   - Include alt text descriptions that are more specific to each bag type\n\n2. **Performance Considerations**:\n   - The current implementation loads all products at once. For a large catalog, consider implementing pagination or infinite scroll\n   - Add data-loading states to improve perceived performance\n\n3. **UX Enhancements**:\n   - Add a \"Clear All Filters\" button to improve user experience\n   - Consider adding a \"No results found\" message when filters return empty results\n   - The product cards would benefit from a consistent height to prevent layout shifts\n\n4. **Code Structure**:\n   - The product data should be separated from the rendering logic for better maintainability\n   - Consider using a more modular approach with separate functions for filtering, rendering, and event handling\n\nOverall, this is a good starting point, but these improvements would make the gallery more robust, accessible, and user-friendly.",
        code: false
      },
      "Can you add filtering by material type to the gallery?": {
        role: "Judge",
        agent: "Claude",
        content: "The Builder has implemented a solid filtering system for the product gallery. Here's my evaluation:\n\n**Strengths:**\n- The code properly handles multiple filter types (material, size, use)\n- The implementation correctly manages active filters in an object\n- Visual feedback is provided when filters are applied\n- The code includes performance optimization by only filtering when necessary\n\n**Areas for Improvement:**\n1. **Error Handling**: There's no error handling if the DOM elements aren't found. Consider adding checks before accessing properties.\n\n2. **Accessibility**: The filter checkboxes should have unique IDs with matching `for` attributes in labels. Also, ARIA attributes would improve screen reader support.\n\n3. **Filter Combination Logic**: The current implementation uses AND logic between different filter types (material AND size AND use). Consider adding an option for OR logic or making this configurable.\n\n4. **Mobile Responsiveness**: The filter UI might need adjustments for smaller screens. Consider a collapsible filter section for mobile views.\n\n5. **Code Organization**: The filter setup and application could be better organized into a class or module pattern for maintainability.\n\nHere's a suggestion for the filter combination logic improvement:\n\n```javascript\n// Add filter mode option (AND/OR between different filter types)\nconst filterMode = 'AND'; // or 'OR'\n\nfunction applyFilters(activeFilters, products) {\n  products.forEach(product => {\n    if (filterMode === 'AND') {\n      // Current implementation (AND logic)\n      let shouldShow = true;\n      \n      for (const [filterType, filterValues] of Object.entries(activeFilters)) {\n        if (filterValues.length === 0) continue;\n        \n        const productValue = product.dataset[filterType];\n        \n        if (!filterValues.includes(productValue)) {\n          shouldShow = false;\n          break;\n        }\n      }\n      \n      product.style.display = shouldShow ? 'block' : 'none';\n    } else {\n      // OR logic between different filter types\n      let shouldShow = false;\n      let hasActiveFilters = false;\n      \n      for (const [filterType, filterValues] of Object.entries(activeFilters)) {\n        if (filterValues.length === 0) continue;\n        \n        hasActiveFilters = true;\n        const productValue = product.dataset[filterType];\n        \n        if (filterValues.includes(productValue)) {\n          shouldShow = true;\n          break;\n        }\n      }\n      \n      // If no filters are active, show all products\n      product.style.display = (!hasActiveFilters || shouldShow) ? 'block' : 'none';\n    }\n  });\n  \n  updateProductCount();\n}\n```\n\nOverall, the implementation is well-done and provides a good user experience for filtering products.",
        code: true
      },
      "How can we display the bag specifications clearly?": {
        role: "Judge",
        agent: "ChatGPT",
        content: "The Builder has created a comprehensive specifications display system using a modal with a detailed table. Here's my evaluation:\n\n**Strengths:**\n- The specifications table is well-organized and clearly presents technical details\n- The modal implementation is clean and follows best practices\n- The enhanced product data structure with additional specifications is well thought out\n- The UI includes appropriate actions (request sample, add to quote)\n\n**Areas for Improvement:**\n\n1. **Accessibility Issues:**\n   - The modal should trap focus when open for keyboard navigation\n   - Add `aria-labelledby` to the modal and proper roles\n   - Ensure the close button has an accessible name\n\n2. **Mobile Responsiveness:**\n   - The current layout may be too wide for mobile screens\n   - Consider a stacked layout for smaller screens\n\n3. **Performance Considerations:**\n   - Loading all enhanced product data at once could be inefficient for large catalogs\n   - Consider lazy-loading the additional specifications when needed\n\n4. **User Experience:**\n   - Add keyboard shortcuts (Escape to close modal)\n   - Consider adding a loading state while fetching detailed specifications\n   - Add print functionality for specifications\n\nHere's a code snippet to address some of these issues:\n\n```javascript\n// Accessibility improvements for modal\nfunction setupAccessibleModal() {\n  const modal = document.getElementById('product-details-modal');\n  const modalContent = modal.querySelector('.modal-content');\n  const closeBtn = modal.querySelector('.close-modal');\n  const modalTitle = document.getElementById('modal-product-name');\n  \n  // Add proper ARIA attributes\n  modal.setAttribute('role', 'dialog');\n  modal.setAttribute('aria-modal', 'true');\n  modal.setAttribute('aria-labelledby', modalTitle.id);\n  \n  // Make close button more accessible\n  closeBtn.setAttribute('aria-label', 'Close product details');\n  \n  // Add keyboard support\n  modal.addEventListener('keydown', function(e) {\n    if (e.key === 'Escape') {\n      modal.style.display = 'none';\n    }\n  });\n  \n  // Focus trap for keyboard navigation\n  modal.addEventListener('keydown', function(e) {\n    if (e.key === 'Tab') {\n      const focusableElements = modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');\n      const firstElement = focusableElements[0];\n      const lastElement = focusableElements[focusableElements.length - 1];\n      \n      if (e.shiftKey && document.activeElement === firstElement) {\n        e.preventDefault();\n        lastElement.focus();\n      } else if (!e.shiftKey && document.activeElement === lastElement) {\n        e.preventDefault();\n        firstElement.focus();\n      }\n    }\n  });\n  \n  // Focus management\n  const originalFocus = document.activeElement;\n  \n  function showModal() {\n    modal.style.display = 'block';\n    // Set focus to the first focusable element\n    const focusableElements = modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');\n    if (focusableElements.length) {\n      focusableElements[0].focus();\n    }\n  }\n  \n  function hideModal() {\n    modal.style.display = 'none';\n    // Return focus to the element that opened the modal\n    if (originalFocus) {\n      originalFocus.focus();\n    }\n  }\n  \n  // Replace existing show/hide functions with these accessible versions\n}\n\n// Add responsive styles for mobile\nconst responsiveStyles = `\n@media (max-width: 768px) {\n  .product-details-container {\n    flex-direction: column;\n  }\n  \n  .product-image-large,\n  .product-info {\n    width: 100%;\n  }\n  \n  .specs-table th,\n  .specs-table td {\n    padding: 8px 10px;\n  }\n}\n`;\n\n// Add print functionality\nfunction addPrintButton() {\n  const productActions = document.querySelector('.product-actions');\n  const printBtn = document.createElement('button');\n  printBtn.className = 'print-specs';\n  printBtn.innerHTML = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z\"/><path d=\"M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z\"/></svg> Print Specifications';\n  \n  printBtn.addEventListener('click', function() {\n    const productName = document.getElementById('modal-product-name').textContent;\n    const printWindow = window.open('', '_blank');\n    \n    printWindow.document.write(`\n      <html>\n        <head>\n          <title>${productName} - Specifications</title>\n          <style>\n            body { font-family: Arial, sans-serif; }\n            h1 { color: #4f46e5; }\n            table { width: 100%; border-collapse: collapse; margin: 20px 0; }\n            th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e5e7eb; }\n            th { background-color: #f9fafb; font-weight: 600; width: 40%; }\n          </style>\n        </head>\n        <body>\n          <h1>${productName}</h1>\n          <p>${document.getElementById('modal-product-description').textContent}</p>\n          <h2>Specifications</h2>\n          ${document.querySelector('.specs-table').outerHTML}\n          <p><small>Printed from Plastic Bag Product Gallery on ${new Date().toLocaleDateString()}</small></p>\n        </body>\n      </html>\n    `);\n    \n    printWindow.document.close();\n    printWindow.focus();\n    printWindow.print();\n  });\n  \n  productActions.appendChild(printBtn);\n}\n```\n\nOverall, the Builder has created an excellent specifications display system. With these improvements, it would be even more accessible, responsive, and user-friendly.",
        code: true
      },
      "Add a comparison feature for different bag calibers.": {
        role: "Builder",
        agent: "Claude",
        content: "The Builder has implemented a comprehensive comparison feature that allows users to compare different plastic bags side by side, with special emphasis on caliber differences. Here's my evaluation:\n\n**Strengths:**\n\n1. **Comprehensive Implementation**: The code provides a complete comparison system with selection, comparison bar, and detailed modal.\n\n2. **Visual Comparison**: The caliber chart is an excellent addition that visually highlights differences between products.\n\n3. **User Experience**: The UI flow is intuitive with clear add/remove functionality and a persistent comparison bar.\n\n4. **Flexibility**: The system allows comparing up to 4 items, which is a good balance between usability and screen space.\n\n**Areas for Improvement:**\n\n1. **Browser Compatibility**: The CSS selector `:has()` is not supported in all browsers. This line could cause issues:\n```javascript\nrow = document.querySelector(`.comparison-table tbody tr:has(th:contains(\"${rowName}\"))`);\n```\nA more compatible approach would be to iterate through rows and check their content.\n\n2. **Chart.js Dependency**: The code assumes Chart.js is available but doesn't check for it or handle its absence gracefully.\n\n3. **Mobile Experience**: The comparison table could become unwieldy on mobile devices. Consider a more responsive approach for small screens.\n\n4. **Accessibility**: The comparison feature needs ARIA attributes and keyboard navigation support.\n\nHere are some suggested improvements:\n\n```javascript\n// Browser-compatible way to find table rows by header text\nfunction findRowByHeaderText(table, headerText) {\n  const rows = table.querySelectorAll('tbody tr');\n  for (const row of rows) {\n    const header = row.querySelector('th');\n    if (header && header.textContent.trim() === headerText) {\n      return row;\n    }\n  }\n  return null;\n}\n\n// Then replace the problematic line with:\nrow = findRowByHeaderText(document.querySelector('.comparison-table'), rowName);\n\n// Check for Chart.js before using it\nfunction createCaliberChart(products) {\n  if (typeof Chart === 'undefined') {\n    console.error('Chart.js is not available. Please include Chart.js library.');\n    document.querySelector('.caliber-comparison-chart').innerHTML = '<p>Chart visualization is not available.</p>';\n    return;\n  }\n  \n  // Rest of the chart creation code...\n}\n\n// Add responsive styles for mobile comparison\nconst responsiveComparisonStyles = `\n@media (max-width: 768px) {\n  .comparison-table-container {\n    overflow-x: auto;\n    max-width: 100%;\n  }\n  \n  .comparison-table th,\n  .comparison-table td {\n    min-width: 120px;\n    font-size: 14px;\n    padding: 8px;\n  }\n  \n  .comparison-image {\n    width: 80px;\n    height: 80px;\n  }\n  \n  .comparison-bar-content {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  \n  .comparison-actions {\n    margin-top: 10px;\n    justify-content: space-between;\n  }\n}\n`;\n\n// Add accessibility improvements\nfunction enhanceComparisonAccessibility() {\n  // Add ARIA attributes to comparison bar\n  const comparisonBar = document.querySelector('.comparison-bar');\n  comparisonBar.setAttribute('role', 'region');\n  comparisonBar.setAttribute('aria-label', 'Product comparison selection');\n  \n  // Make comparison modal accessible\n  const comparisonModal = document.getElementById('comparison-modal');\n  comparisonModal.setAttribute('role', 'dialog');\n  comparisonModal.setAttribute('aria-modal', 'true');\n  comparisonModal.setAttribute('aria-labelledby', 'comparison-modal-title');\n  \n  // Add ID to modal title for aria-labelledby reference\n  const modalTitle = comparisonModal.querySelector('h2');\n  modalTitle.id = 'comparison-modal-title';\n  \n  // Add keyboard support for comparison buttons\n  document.querySelectorAll('.compare-btn').forEach(button => {\n    button.addEventListener('keydown', function(e) {\n      if (e.key === 'Enter' || e.key === ' ') {\n        e.preventDefault();\n        this.click();\n      }\n    });\n  });\n}\n```\n\nOverall, the Builder has created an excellent comparison feature that effectively highlights caliber differences between plastic bags. With these improvements, it would be more robust, accessible, and work across more devices and browsers.",
        code: true
      }
    }
  };

  // DOM elements
  const demoContainer = document.createElement('div');
  demoContainer.className = 'mcp-demo-container';
  
  // Create demo UI
  demoContainer.innerHTML = `
    <div class="mcp-demo-header">
      <h2>MCP System Interactive Demo</h2>
      <p>Experience how Claude and ChatGPT collaborate to build a plastic bag product gallery</p>
    </div>
    
    <div class="mcp-demo-content">
      <div class="mcp-demo-sidebar">
        <div class="mcp-agents">
          <div class="mcp-agent builder" id="builder-agent">
            <div class="agent-avatar">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="ChatGPT" id="builder-avatar">
            </div>
            <div class="agent-info">
              <span class="agent-name" id="builder-name">ChatGPT</span>
              <span class="agent-role">Builder</span>
            </div>
          </div>
          
          <div class="mcp-role-switch">
            <button id="switch-roles-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              Switch Roles
            </button>
          </div>
          
          <div class="mcp-agent judge" id="judge-agent">
            <div class="agent-avatar">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Anthropic_logo.svg/1200px-Anthropic_logo.svg.png" alt="Claude" id="judge-avatar">
            </div>
            <div class="agent-info">
              <span class="agent-name" id="judge-name">Claude</span>
              <span class="agent-role">Judge</span>
            </div>
          </div>
        </div>
        
        <div class="mcp-prompt-selector">
          <h3>Select a prompt:</h3>
          <div class="prompt-options">
            ${demoData.prompts.map((prompt, index) => `
              <button class="prompt-option" data-prompt="${index}">${prompt}</button>
            `).join('')}
          </div>
        </div>
        
        <div class="mcp-memory-status">
          <h3>Memory Status</h3>
          <div class="memory-info">
            <div class="memory-item">
              <span class="memory-label">Tokens Used:</span>
              <span class="memory-value" id="tokens-used">0 / 16,000</span>
            </div>
            <div class="memory-item">
              <span class="memory-label">Context Length:</span>
              <span class="memory-value" id="context-length">0 messages</span>
            </div>
            <div class="memory-item">
              <span class="memory-label">Memory Anchors:</span>
              <span class="memory-value" id="memory-anchors">0 active</span>
            </div>
          </div>
          <div class="memory-actions">
            <button id="summarize-btn" disabled>Summarize Context</button>
            <button id="clear-memory-btn" disabled>Clear Memory</button>
          </div>
        </div>
      </div>
      
      <div class="mcp-demo-chat">
        <div class="chat-messages" id="chat-messages">
          <div class="system-message">
            <p>Welcome to the MCP System Demo. Select a prompt from the sidebar to see how Claude and ChatGPT collaborate to build a plastic bag product gallery.</p>
          </div>
        </div>
        
        <div class="chat-input">
          <textarea id="user-input" placeholder="Type your message here..." disabled></textarea>
          <button id="send-btn" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add styles
  const demoStyles = document.createElement('style');
  demoStyles.textContent = `
    .mcp-demo-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 1200px;
      margin: 40px auto;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .mcp-demo-header {
      background: linear-gradient(to right, #4f46e5, #8b5cf6);
      color: white;
      padding: 20px 30px;
    }
    
    .mcp-demo-header h2 {
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    
    .mcp-demo-header p {
      margin: 0;
      opacity: 0.9;
    }
    
    .mcp-demo-content {
      display: flex;
      height: 600px;
    }
    
    .mcp-demo-sidebar {
      width: 300px;
      background-color: #f9fafb;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    
    .mcp-agents {
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .mcp-agent {
      display: flex;
      align-items: center;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    
    .mcp-agent.builder {
      background-color: #eff6ff;
    }
    
    .mcp-agent.judge {
      background-color: #f5f3ff;
    }
    
    .agent-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .agent-avatar img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }
    
    .agent-info {
      display: flex;
      flex-direction: column;
    }
    
    .agent-name {
      font-weight: 600;
      font-size: 14px;
    }
    
    .agent-role {
      font-size: 12px;
      color: #6b7280;
    }
    
    .mcp-role-switch {
      display: flex;
      justify-content: center;
      margin: 15px 0;
    }
    
    #switch-roles-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: white;
      border: 1px solid #e5e7eb;
      color: #4f46e5;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    #switch-roles-btn:hover {
      background-color: #f5f3ff;
      border-color: #4f46e5;
    }
    
    #switch-roles-btn svg {
      width: 16px;
      height: 16px;
    }
    
    .mcp-prompt-selector {
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .mcp-prompt-selector h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #374151;
    }
    
    .prompt-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .prompt-option {
      text-align: left;
      background-color: white;
      border: 1px solid #e5e7eb;
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }
    
    .prompt-option:hover {
      border-color: #4f46e5;
      background-color: #f5f3ff;
    }
    
    .prompt-option.selected {
      border-color: #4f46e5;
      background-color: #eff6ff;
      font-weight: 500;
    }
    
    .mcp-memory-status {
      padding: 20px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .mcp-memory-status h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #374151;
    }
    
    .memory-info {
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    
    .memory-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .memory-item:last-child {
      margin-bottom: 0;
    }
    
    .memory-label {
      color: #6b7280;
    }
    
    .memory-value {
      font-weight: 500;
      color: #374151;
    }
    
    .memory-actions {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }
    
    .memory-actions button {
      flex: 1;
      background-color: white;
      border: 1px solid #e5e7eb;
      color: #6b7280;
      padding: 8px 0;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .memory-actions button:hover:not(:disabled) {
      border-color: #4f46e5;
      color: #4f46e5;
    }
    
    .memory-actions button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .mcp-demo-chat {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background-color: white;
    }
    
    .chat-messages {
      flex-grow: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 8px;
      position: relative;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .message.user-message {
      align-self: flex-end;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
    }
    
    .message.builder-message {
      align-self: flex-start;
      background-color: #f5f3ff;
      border: 1px solid #ddd6fe;
    }
    
    .message.judge-message {
      align-self: flex-start;
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
    }
    
    .message.system-message {
      align-self: center;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      max-width: 90%;
      text-align: center;
      color: #6b7280;
    }
    
    .message-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .message-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 8px;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .message-avatar img {
      width: 18px;
      height: 18px;
      object-fit: contain;
    }
    
    .message-sender {
      font-weight: 600;
      font-size: 13px;
    }
    
    .message-role {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 6px;
    }
    
    .message-role.builder {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    .message-role.judge {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .message-content {
      white-space: pre-wrap;
    }
    
    .message-content code {
      font-family: 'Fira Code', 'Courier New', monospace;
      background-color: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 13px;
    }
    
    .message-content pre {
      background-color: #1e293b;
      color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 10px 0;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 13px;
    }
    
    .chat-input {
      display: flex;
      padding: 15px;
      border-top: 1px solid #e5e7eb;
    }
    
    #user-input {
      flex-grow: 1;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px 15px;
      font-family: inherit;
      font-size: 14px;
      resize: none;
      height: 45px;
      transition: border-color 0.2s;
    }
    
    #user-input:focus {
      outline: none;
      border-color: #4f46e5;
    }
    
    #user-input:disabled {
      background-color: #f9fafb;
      cursor: not-allowed;
    }
    
    #send-btn {
      background-color: #4f46e5;
      color: white;
      border: none;
      width: 45px;
      height: 45px;
      border-radius: 6px;
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }
    
    #send-btn:hover:not(:disabled) {
      background-color: #4338ca;
    }
    
    #send-btn:disabled {
      background-color: #c7d2fe;
      cursor: not-allowed;
    }
    
    #send-btn svg {
      width: 20px;
      height: 20px;
    }
    
    /* Code highlighting */
    .hljs-keyword {
      color: #ff79c6;
    }
    
    .hljs-string {
      color: #f1fa8c;
    }
    
    .hljs-comment {
      color: #6272a4;
    }
    
    .hljs-function {
      color: #50fa7b;
    }
    
    .hljs-number {
      color: #bd93f9;
    }
    
    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      margin-top: 5px;
    }
    
    .typing-indicator span {
      height: 8px;
      width: 8px;
      background-color: #6b7280;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
      opacity: 0.4;
      animation: typing 1s infinite;
    }
    
    .typing-indicator span:nth-child(1) {
      animation-delay: 0s;
    }
    
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
      margin-right: 0;
    }
    
    @keyframes typing {
      0% {
        opacity: 0.4;
        transform: translateY(0);
      }
      50% {
        opacity: 1;
        transform: translateY(-5px);
      }
      100% {
        opacity: 0.4;
        transform: translateY(0);
      }
    }
    
    /* Role switching animation */
    .role-switch-animation {
      animation: roleSwitchPulse 1s;
    }
    
    @keyframes roleSwitchPulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
        background-color: #eff6ff;
      }
      100% {
        transform: scale(1);
      }
    }
    
    /* Responsive styles */
    @media (max-width: 900px) {
      .mcp-demo-content {
        flex-direction: column;
        height: auto;
      }
      
      .mcp-demo-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .mcp-demo-chat {
        height: 500px;
      }
    }
  `;
  
  // Append to document
  document.head.appendChild(demoStyles);
  document.getElementById('demo-container').appendChild(demoContainer);
  
  // Demo functionality
  let currentBuilderAgent = 'ChatGPT';
  let currentJudgeAgent = 'Claude';
  let messageCount = 0;
  let tokensUsed = 0;
  let memoryAnchors = 0;
  let isProcessing = false;
  
  // Initialize UI
  updateMemoryStatus();
  
  // Event listeners
  document.querySelectorAll('.prompt-option').forEach(button => {
    button.addEventListener('click', function() {
      if (isProcessing) return;
      
      const promptIndex = parseInt(this.dataset.prompt);
      const promptText = demoData.prompts[promptIndex];
      
      // Update UI
      document.querySelectorAll('.prompt-option').forEach(btn => {
        btn.classList.remove('selected');
      });
      this.classList.add('selected');
      
      // Add user message
      addMessage('user', 'User', promptText);
      
      // Process the prompt
      processPrompt(promptText);
    });
  });
  
  document.getElementById('switch-roles-btn').addEventListener('click', function() {
    if (isProcessing) return;
    
    // Swap agents
    const temp = currentBuilderAgent;
    currentBuilderAgent = currentJudgeAgent;
    currentJudgeAgent = temp;
    
    // Update UI
    document.getElementById('builder-name').textContent = currentBuilderAgent;
    document.getElementById('judge-name').textContent = currentJudgeAgent;
    
    // Update avatars
    document.getElementById('builder-avatar').src = getAgentAvatar(currentBuilderAgent);
    document.getElementById('judge-avatar').src = getAgentAvatar(currentJudgeAgent);
    
    // Add animation
    document.getElementById('builder-agent').classList.add('role-switch-animation');
    document.getElementById('judge-agent').classList.add('role-switch-animation');
    
    // Remove animation after it completes
    setTimeout(() => {
      document.getElementById('builder-agent').classList.remove('role-switch-animation');
      document.getElementById('judge-agent').classList.remove('role-switch-animation');
    }, 1000);
    
    // Add system message
    addMessage('system', 'System', `Roles switched: ${currentBuilderAgent} is now the Builder, ${currentJudgeAgent} is now the Judge.`);
    
    // Update memory status
    tokensUsed += 50;
    updateMemoryStatus();
    
    // Enable memory buttons if they were disabled
    document.getElementById('summarize-btn').disabled = false;
    document.getElementById('clear-memory-btn').disabled = false;
  });
  
  document.getElementById('summarize-btn').addEventListener('click', function() {
    if (isProcessing) return;
    
    // Add system message
    addMessage('system', 'System', 'Summarizing conversation to optimize token usage...');
    
    // Simulate summarization
    isProcessing = true;
    setTimeout(() => {
      // Reduce tokens
      tokensUsed = Math.floor(tokensUsed * 0.6);
      
      // Add memory anchor
      memoryAnchors++;
      
      // Update memory status
      updateMemoryStatus();
      
      // Add system message
      addMessage('system', 'System', 'Conversation summarized successfully. Token usage reduced by 40%.');
      
      isProcessing = false;
    }, 1500);
  });
  
  document.getElementById('clear-memory-btn').addEventListener('click', function() {
    if (isProcessing) return;
    
    // Add system message
    addMessage('system', 'System', 'Clearing conversation memory...');
    
    // Reset memory
    tokensUsed = 0;
    memoryAnchors = 0;
    
    // Update memory status
    updateMemoryStatus();
    
    // Disable memory buttons
    document.getElementById('summarize-btn').disabled = true;
    document.getElementById('clear-memory-btn').disabled = true;
    
    // Add system message after a short delay
    setTimeout(() => {
      addMessage('system', 'System', 'Conversation memory cleared. Starting fresh context.');
    }, 500);
  });
  
  // Helper functions
  function processPrompt(promptText) {
    isProcessing = true;
    
    // Show typing indicator for builder
    showTypingIndicator('builder');
    
    // Get builder response
    const builderResponse = demoData.builderResponses[promptText];
    
    // Simulate builder thinking
    setTimeout(() => {
      // Hide typing indicator
      hideTypingIndicator();
      
      // Add builder message
      addMessage('builder', builderResponse.agent, builderResponse.content, builderResponse.code);
      
      // Update tokens
      tokensUsed += builderResponse.content.length / 4;
      updateMemoryStatus();
      
      // Show typing indicator for judge
      showTypingIndicator('judge');
      
      // Get judge response
      const judgeResponse = demoData.judgeResponses[promptText];
      
      // Simulate judge thinking
      setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add judge message
        addMessage('judge', judgeResponse.agent, judgeResponse.content, judgeResponse.code);
        
        // Update tokens
        tokensUsed += judgeResponse.content.length / 4;
        updateMemoryStatus();
        
        // Enable memory buttons
        document.getElementById('summarize-btn').disabled = false;
        document.getElementById('clear-memory-btn').disabled = false;
        
        isProcessing = false;
      }, 2000 + Math.random() * 1000);
    }, 1500 + Math.random() * 1000);
  }
  
  function addMessage(type, sender, content, hasCode = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    
    messageElement.className = `message ${type}-message`;
    
    if (type !== 'system') {
      let headerHTML = '';
      
      if (type === 'builder' || type === 'judge') {
        const avatarSrc = getAgentAvatar(sender);
        const role = type.charAt(0).toUpperCase() + type.slice(1);
        
        headerHTML = `
          <div class="message-header">
            <div class="message-avatar">
              <img src="${avatarSrc}" alt="${sender}">
            </div>
            <span class="message-sender">${sender}</span>
            <span class="message-role ${type}">${role}</span>
          </div>
        `;
      }
      
      let contentHTML = '';
      
      if (hasCode) {
        // Process content to highlight code blocks
        const parts = content.split('```');
        contentHTML = '<div class="message-content">';
        
        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            // Regular text
            contentHTML += parts[i];
          } else {
            // Code block
            const codeLines = parts[i].split('\n');
            const language = codeLines[0];
            const code = codeLines.slice(1).join('\n');
            
            contentHTML += `<pre><code class="language-${language}">${code}</code></pre>`;
          }
        }
        
        contentHTML += '</div>';
      } else {
        contentHTML = `<div class="message-content">${content}</div>`;
      }
      
      messageElement.innerHTML = headerHTML + contentHTML;
    } else {
      messageElement.innerHTML = `<p>${content}</p>`;
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    messageCount++;
  }
  
  function showTypingIndicator(type) {
    const messagesContainer = document.getElementById('chat-messages');
    const indicatorElement = document.createElement('div');
    
    indicatorElement.className = `message ${type}-message typing-message`;
    indicatorElement.innerHTML = `
      <div class="message-header">
        <div class="message-avatar">
          <img src="${getAgentAvatar(type === 'builder' ? currentBuilderAgent : currentJudgeAgent)}" alt="Agent">
        </div>
        <span class="message-sender">${type === 'builder' ? currentBuilderAgent : currentJudgeAgent}</span>
        <span class="message-role ${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </div>
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    messagesContainer.appendChild(indicatorElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function hideTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
  }
  
  function getAgentAvatar(agent) {
    if (agent === 'ChatGPT') {
      return 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg';
    } else if (agent === 'Claude') {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Anthropic_logo.svg/1200px-Anthropic_logo.svg.png';
    }
    return '';
  }
  
  function updateMemoryStatus() {
    document.getElementById('tokens-used').textContent = `${Math.floor(tokensUsed)} / 16,000`;
    document.getElementById('context-length').textContent = `${messageCount} messages`;
    document.getElementById('memory-anchors').textContent = `${memoryAnchors} active`;
  }
});
