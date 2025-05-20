<template>
  <div class="form-container">
    <h2>Add New Resource</h2>
    <form @submit.prevent="submitResource">
      <!-- Category Dropdown -->
      <label for="category">Category:</label>
      <select id="category" v-model="newResource.category" required>
        <option value="">Select Category</option>
        <option v-for="category in categories" :key="category._id" :value="category.name">
          {{ category.name }}
        </option>
      </select>

      <!-- Resource Name -->
      <label for="refName">Resource Name:</label>
      <input id="refName" v-model="newResource.refName" placeholder="Enter Resource Name" required />

      <!-- Session-Semester Dropdown -->
      <label for="sessionSemester">Session-Semester:</label>
      <select id="sessionSemester" v-model="newResource.sessionSemester" required>
        <option value="">Select Session-Semester</option>
        <option v-for="session in sessionSemesters" :key="session" :value="session">
          {{ session }}
        </option>
      </select>

      <!-- Description -->
      <label for="description">Description:</label>
      <textarea
        id="description"
        v-model="newResource.description"
        placeholder="Enter Description"
        rows="4"
        required
      ></textarea>

      <!-- Shared By (Fixed) -->
      <label for="sharedBy">Shared By:</label>
      <input
        id="sharedBy"
        v-model="newResource.sharedBy"
        disabled
        class="disabled-input"
        placeholder="Owner/Shared By"
      />

      <!-- Visibility Fields (Admin and Lecturer only) -->
      <div v-if="isAdminOrLecturer" class="visibility-section">
        <h3>Visibility Settings</h3>
        <div class="toggle-switch">
          <label>
            <input type="checkbox" v-model="newResource.visibleToStudents" />
            <span class="slider"></span>
            <span class="label">Visible to Students</span>
          </label>
        </div>
        <div class="toggle-switch">
          <label>
            <input type="checkbox" v-model="newResource.visibleToLecturers" />
            <span class="slider"></span>
            <span class="label">Visible to Lecturers</span>
          </label>
        </div>
      </div>

      <!-- Link with Validation -->
      <label for="link">Resource Link:</label>
      <input
        id="link"
        v-model="newResource.link"
        placeholder="Enter Google Drive Link"
        required
      />
      <p v-if="linkError" class="error">{{ linkError }}</p>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="submit-btn">Submit</button>
        <button type="button" class="cancel-btn" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
      sessionSemesters: ["2023/2024-1", "2023/2024-2", "2024/2025-1"],
      newResource: {
        category: "",
        refName: "",
        sessionSemester: "",
        description: "",
        sharedBy: localStorage.getItem("full_name"),
        link: "",
        visibleToStudents: true,
        visibleToLecturers: true,
      },
      linkError: "",
      role: localStorage.getItem("role"),
    };
  },
  computed: {
    isAdminOrLecturer() {
      return this.role === "Admin" || this.role === "Lecturer";
    },
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:5000/api/categories", {
          params: { role: this.role },
        });
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    isGoogleDriveLink(link) {
      const regex = /^https:\/\/drive\.google\.com\/[a-zA-Z0-9/._-]+$/;
      return regex.test(link);
    },
    async submitResource() {
      if (!this.isGoogleDriveLink(this.newResource.link)) {
        this.linkError = "Please provide a valid Google Drive link.";
        return;
      }
      this.linkError = "";

      try {
        await axios.post("http://localhost:5000/api/resources", this.newResource);
        const role = this.role;
        if (role === "Student") {
          this.$router.push("/student-dashboard/resources-shared-by-me");
        } else if (role === "Lecturer") {
          this.$router.push("/lecturer-dashboard/manage-resources");
        } else if (role === "Admin") {
          this.$router.push("/admin-dashboard/manage-resources");
        }
      } catch (err) {
        console.error("Error adding resource:", err);
      }
    },
    cancel() {
      const role = this.role;
      if (role === "Student") {
        this.$router.push("/student-dashboard/resources-shared-by-me");
      } else if (role === "Lecturer") {
        this.$router.push("/lecturer-dashboard/manage-resources");
      } else if (role === "Admin") {
        this.$router.push("/admin-dashboard/manage-resources");
      }
    },
  },
  async mounted() {
    await this.fetchCategories();
  },
};
</script>

<style scoped>
/* General form styles */
.form-container {
  margin: 40px auto;
  padding: 30px;
  max-width: 600px;
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

h2 {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 20px;
}

form input,
form select,
form textarea {
  display: block;
  margin-bottom: 20px;
  padding: 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8f9fa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

form textarea {
  resize: none;
}

form input.disabled-input {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

form input:focus,
form select:focus,
form textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
}

form label {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
  font-size: 1rem;
}

.error {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -15px;
  margin-bottom: 15px;
}

.visibility-section {
  margin-top: 20px;
  background: #f1f1f1;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

/* Toggle switch styles */
.toggle-switch {
  margin-bottom: 15px;
}

.toggle-switch label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-switch .slider {
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.toggle-switch .slider:before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.3s ease;
}

.toggle-switch input[type="checkbox"]:checked + .slider {
  background: #28a745;
}

.toggle-switch input[type="checkbox"]:checked + .slider:before {
  transform: translateX(20px);
}

.toggle-switch .label {
  font-size: 1rem;
  color: #333;
}



button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  margin: 12px 20px;
}

.submit-btn {
  background: linear-gradient(145deg, #28a745, #218838);
  color: white;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.4);
}

.submit-btn:hover {
  background: #218838;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.6);
}

.cancel-btn {
  background: linear-gradient(145deg, #dc3545, #c82333);
  color: white;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.4);
}

.cancel-btn:hover {
  background: #c82333;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.6);
}
</style>
