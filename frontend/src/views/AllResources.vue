<template>
  <div>
    <h2>All Resources I Can View</h2>

    <!-- Filters Section -->
    <div class="filters">
      <label for="categoryFilter">Filter by Category:</label>
      <select id="categoryFilter" v-model="selectedCategory" @change="filterResources">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
      </select>

      <label for="sharedByFilter">Filter by Shared By:</label>
      <select id="sharedByFilter" v-model="selectedSharedBy" @change="filterResources">
        <option value="">All Resources</option>
        <option :value="userFullName">Resources Shared by Me</option>
      </select>
    </div>

    <!-- Resources Table -->
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Ref. Name</th>
          <th>Session-Semester</th>
          <th>Description</th>
          <th>Owner/Shared By</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in filteredResources" :key="resource._id">
          <td>{{ resource.category }}</td>
          <td>{{ resource.refName }}</td>
          <td>{{ resource.sessionSemester }}</td>
          <td>{{ resource.description }}</td>
          <td>{{ resource.sharedBy }}</td>
          <td>
            <a :href="resource.link" target="_blank">View</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      allResources: [], // All resources fetched from the API
      filteredResources: [], // Resources filtered based on the selected filters
      categories: [], // List of categories
      selectedCategory: '', // Currently selected category filter
      selectedSharedBy: '', // Currently selected sharedBy filter
      userFullName: localStorage.getItem('full_name'), // Logged-in student's full name
    };
  },
  methods: {
    async fetchResources() {
  try {
    const role = localStorage.getItem('role');
    const response = await axios.get('http://localhost:5000/api/resources', {
      params: { role },
    });
    this.allResources = response.data; // Update the resource list
    this.filterResources(); // Apply the initial filter
  } catch (err) {
    console.error('Error fetching resources:', err);
  }
},


    async fetchCategories() {
      // Fetch categories dynamically (replace mock data with API if needed)
      this.categories = [
        { id: 1, name: 'Course Files' },
        { id: 2, name: 'Research' },
      ];
    },
    filterResources() {
      this.filteredResources = this.allResources.filter((resource) => {
        const matchesCategory =
          !this.selectedCategory || resource.category === this.selectedCategory;
        const matchesSharedBy =
          !this.selectedSharedBy || resource.sharedBy === this.selectedSharedBy;

        return matchesCategory && matchesSharedBy;
      });
    },
  },
  async mounted() {
    await this.fetchResources();
    await this.fetchCategories();
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  margin-left: 30px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #1abc9c;
}

.filters label {
  font-size: 1rem;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 5px;
  display: block;
}

.filters select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background-color: #f9f9f9;
  width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filters select:hover {
  border-color: #1abc9c;
}

table {
  width: 95%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-left: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #1abc9c;
}

thead {
  background-color: #34495e;
  color: white;
  text-align: left;
  font-size: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  font-size: 0.95rem;
}

td {
  color: #34495e;
}

th {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #1abc9c;
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
}

a {
  color: #1abc9c;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

a:hover {
  color: #34495e;
  text-decoration: underline;
}

@media (max-width: 768px) {
  table {
    font-size: 0.9rem;
  }

  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .filters select {
    width: 100%;
  }
}
</style>
