<template>
  <div>
    <h2 class="page-title">Manage Resources</h2>

    <!-- Filtering Resources -->
    <div class="filter-section">
      <label for="categoryFilter">Filter by Category:</label>
      <select id="categoryFilter" v-model="selectedCategory" @change="filterResources">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
      </select>

      <label for="sharedByFilter">Filter by:</label>
      <select id="sharedByFilter" v-model="sharedByFilter" @change="filterResources">
        <option value="">All Resources</option>
        <option :value="userFullName">Resources Shared by Me</option>
      </select>
    </div>

    <!-- Add Resource Button -->
    <button @click="goToAddResource" class="add-resource-btn">+ Add Resource</button>

    <!-- Resources Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Ref. Name</th>
            <th>Session-Semester</th>
            <th>Description</th>
            <th>Owner/Shared By</th>
            <th>Link</th>
            <th>Visibility</th>
            <th>Actions</th>
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
            <td>
              <button class="toggle-btn" @click="toggleVisibility(resource, 'students')">
                {{ resource.visibleToStudents ? 'Visible to Students' : 'Not Visible to Students' }}
              </button>
              <button class="toggle-btn" @click="toggleVisibility(resource, 'lecturers')">
                {{ resource.visibleToLecturers ? 'Visible to Lecturers' : 'Not Visible to Lecturers' }}
              </button>
            </td>
            <td>
              <button class="action-btn edit-btn" @click="openEditForm(resource)">Edit</button>
              <button class="action-btn delete-btn" @click="deleteResource(resource._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Resource Form -->
    <div v-if="isEditing" class="edit-form">
      <h3>Edit Resource</h3>
      <form @submit.prevent="submitEdit">
        <label for="editCategory">Category:</label>
        <select id="editCategory" v-model="currentResource.category" required>
          <option value="">Select Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>

        <label for="editRefName">Ref. Name:</label>
        <input id="editRefName" v-model="currentResource.refName" placeholder="Ref. Name" required />

        <label for="editSessionSemester">Session-Semester:</label>
        <select id="editSessionSemester" v-model="currentResource.sessionSemester" required>
          <option value="">Select Session-Semester</option>
          <option v-for="session in sessionSemesters" :key="session" :value="session">
            {{ session }}
          </option>
        </select>

        <label for="editDescription">Description:</label>
        <textarea id="editDescription" v-model="currentResource.description" placeholder="Description"></textarea>

        <label for="editLink">Link:</label>
        <input id="editLink" v-model="currentResource.link" placeholder="Link" required />

        <div class="form-actions">
          <button class="form-btn save-btn" type="submit">Save</button>
          <button class="form-btn cancel-btn" type="button" @click="cancelEdit">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
      sessionSemesters: ["2023/2024-1", "2023/2024-2", "2024/2025-1"],
      resources: [],
      filteredResources: [],
      selectedCategory: '',
      sharedByFilter: '',
      userFullName: localStorage.getItem('full_name'),
      isEditing: false,
      currentResource: null,
    };
  },
  methods: {
    async fetchResources() {
      try {
        const response = await axios.get("http://localhost:5000/api/resources");
        this.resources = response.data;
        this.filterResources();
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        this.categories = response.data;
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    },
    filterResources() {
      this.filteredResources = this.resources.filter((resource) => {
        const matchesCategory =
          !this.selectedCategory || resource.category === this.selectedCategory;
        const matchesSharedBy =
          !this.sharedByFilter || resource.sharedBy === this.sharedByFilter;
        return matchesCategory && matchesSharedBy;
      });
    },
    async deleteResource(id) {
      try {
        await axios.delete(`http://localhost:5000/api/resources/${id}`);
        this.fetchResources();
      } catch (err) {
        console.error("Error deleting resource:", err);
      }
    },
    async toggleVisibility(resource, target) {
      try {
        const updatedResource = { ...resource };
        if (target === "students") {
          updatedResource.visibleToStudents = !resource.visibleToStudents;
        } else if (target === "lecturers") {
          updatedResource.visibleToLecturers = !resource.visibleToLecturers;
        }
        await axios.put(`http://localhost:5000/api/resources/${resource._id}`, updatedResource);
        this.fetchResources();
      } catch (err) {
        console.error("Error toggling visibility:", err);
      }
    },
    openEditForm(resource) {
      this.isEditing = true;
      this.currentResource = { ...resource };
    },
    async submitEdit() {
      try {
        await axios.put(
          `http://localhost:5000/api/resources/${this.currentResource._id}`,
          this.currentResource
        );
        this.isEditing = false;
        this.currentResource = null;
        this.fetchResources();
      } catch (err) {
        console.error("Error updating resource:", err);
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.currentResource = null;
    },
    goToAddResource() {
      this.$router.push("/admin-dashboard/add-resource");
    },
  },
  async mounted() {
    await this.fetchCategories();
    await this.fetchResources();
  },
};
</script>

<style scoped>
.page-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.add-resource-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.add-resource-btn:hover {
  background-color: #218838;
}

.table-container {
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 70%;
  border-collapse: collapse;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
}

thead {
  background-color: #2c3e50; /* Dark header background */
  color: white; /* White text for header */
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  
}

tr:hover {
  background-color: #007bff; /* Blue background on hover */
  color: white; /* Ensure text is visible */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition */
}

a {
  color: #007bff; /* Default link color */
  text-decoration: none;
}

a:hover {
  text-decoration: underline; /* Underline on hover */
}


thead {
  background-color: #2c3e50;
  color: white;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #007bff; /* Blue background */
  color: white; /* Ensure text is visible */
  transition: background-color 0.3s ease, color 0.3s ease;
}


a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.toggle-btn {
  padding: 5px 10px;
  margin: 2px;
  border: none;
  border-radius: 5px;
  background-color: #17a2b8;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.toggle-btn:hover {
  background-color: #138496;
}

.action-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 2px;
}

.edit-btn {
  background-color: #ffc107;
  color: black;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.edit-form {
  margin: 30px auto;
  padding: 20px;
  max-width: 600px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
}

.edit-form label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.edit-form input,
.edit-form select,
.edit-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.edit-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.save-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background-color: #c82333;
}
</style>
