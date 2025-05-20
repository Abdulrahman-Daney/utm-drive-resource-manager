<template>
  <div>
    <div class="main-content">
      <h2 class="page-title">Manage Categories</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Visible to Students</th>
              <th>Visible to Lecturers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category._id">
              <td>{{ category.name }}</td>
              <td>
                <button class="toggle-btn" @click="toggleStudentVisibility(category)">
                  {{ category.visibleToStudents ? "Yes" : "No" }}
                </button>
              </td>
              <td>
                <button class="toggle-btn" @click="toggleLecturerVisibility(category)">
                  {{ category.visibleToLecturers ? "Yes" : "No" }}
                </button>
              </td>
              <td>
                <button class="action-btn edit-btn" @click="editCategory(category)">Edit</button>
                <button class="action-btn delete-btn" @click="deleteCategory(category._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <form @submit.prevent="addCategory" class="form-container">
        <h3>Add New Category</h3>
        <input v-model="newCategory.name" placeholder="Category Name" required />
        <label>
          <input type="checkbox" v-model="newCategory.visibleToStudents" />
          Visible to Students
        </label>
        <label>
          <input type="checkbox" v-model="newCategory.visibleToLecturers" />
          Visible to Lecturers
        </label>
        <div class="form-actions">
          <button type="submit" class="form-btn save-btn">Add</button>
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
      newCategory: { name: "", visibleToStudents: true, visibleToLecturers: true },
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async addCategory() {
      if (this.newCategory.name) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/categories",
            this.newCategory
          );
          this.categories.push(response.data);
          this.newCategory = { name: "", visibleToStudents: true, visibleToLecturers: true };
        } catch (error) {
          console.error("Error adding category:", error);
        }
      }
    },
    async toggleStudentVisibility(category) {
      try {
        const updatedVisibility = !category.visibleToStudents;
        const response = await axios.put(
          `http://localhost:5000/api/categories/${category._id}`,
          { visibleToStudents: updatedVisibility }
        );
        category.visibleToStudents = response.data.visibleToStudents;
      } catch (error) {
        console.error("Error toggling student visibility:", error);
      }
    },
    async toggleLecturerVisibility(category) {
      try {
        const updatedVisibility = !category.visibleToLecturers;
        const response = await axios.put(
          `http://localhost:5000/api/categories/${category._id}`,
          { visibleToLecturers: updatedVisibility }
        );
        category.visibleToLecturers = response.data.visibleToLecturers;
      } catch (error) {
        console.error("Error toggling lecturer visibility:", error);
      }
    },
    async editCategory(category) {
      const newName = prompt("Edit Category Name:", category.name);
      if (newName) {
        try {
          const response = await axios.put(
            `http://localhost:5000/api/categories/${category._id}`,
            { name: newName }
          );
          category.name = response.data.name;
        } catch (error) {
          console.error("Error editing category:", error);
        }
      }
    },
    async deleteCategory(categoryId) {
      if (confirm("Are you sure you want to delete this category?")) {
        try {
          await axios.delete(`http://localhost:5000/api/categories/${categoryId}`);
          this.categories = this.categories.filter((cat) => cat._id !== categoryId);
        } catch (error) {
          console.error("Error deleting category:", error);
        }
      }
    },
  },
  async mounted() {
    await this.fetchCategories();
  },
};
</script>

<style scoped>
.page-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 20px;
  margin-left: 200px;
}

.table-container {
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 90%;
  border-collapse: collapse;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
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
  border: 1px solid #ddd;
}

tr:hover {
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.toggle-btn {
  padding: 5px 10px;
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
  margin: 5px;
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

.form-container {
  margin-top: 30px;
  padding: 20px;
  max-width: 600px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-left: 150px;
}

.form-container h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #2c3e50;
 
}

form input,
form label {
  display: block;
  margin-bottom: 15px;
  font-size: 1rem;
}

form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

form label {
  font-weight: bold;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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
</style>
