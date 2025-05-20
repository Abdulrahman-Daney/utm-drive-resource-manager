<template>
    <div class="form-container">
      <h2>ٍSend Resources</h2>
  
      <!-- Button to toggle form visibility -->
      <button @click="toggleForm" class="toggle-form-btn">
        {{ showForm ? "Hide Send Resource Form" : "Send Resource" }}
      </button>
  
      <!-- Send Resource Form -->
      <form v-if="showForm" @submit.prevent="submitResource" class="resource-form">
        <h2>Send Resource</h2>
  
        <!-- Category Dropdown -->
        <div class="form-group">
          <label for="category">Category:</label>
          <select id="category" v-model="newResource.category" required class="form-control">
            <option value="">Select Category</option>
            <option v-for="category in categories" :key="category._id" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
  
        <!-- Resource Name -->
        <div class="form-group">
          <label for="refName">Resource Name:</label>
          <input id="refName" v-model="newResource.refName" placeholder="Enter Resource Name" required class="form-control" />
        </div>
  
        <!-- Session-Semester Dropdown -->
        <div class="form-group">
          <label for="sessionSemester">Session-Semester:</label>
          <select id="sessionSemester" v-model="newResource.sessionSemester" required class="form-control">
            <option value="">Select Session-Semester</option>
            <option v-for="session in sessionSemesters" :key="session" :value="session">
              {{ session }}
            </option>
          </select>
        </div>
  
        <!-- Description -->
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea
            id="description"
            v-model="newResource.description"
            placeholder="Enter Description"
            rows="4"
            required
            class="form-control"
          ></textarea>
        </div>
  
        <!-- Recipient Email -->
        <div class="form-group">
          <label for="email">Recipient Email:</label>
          <input id="email" v-model="newResource.email" placeholder="Enter Recipient's Email" required class="form-control" />
        </div>
  
        <!-- Link with Validation -->
        <div class="form-group">
          <label for="link">Resource Link:</label>
          <input id="link" v-model="newResource.link" placeholder="Enter Google Drive Link" required class="form-control" />
          <p v-if="linkError" class="error">{{ linkError }}</p>
        </div>
  
        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="submit-btn">Send</button>
          <button type="button" class="cancel-btn" @click="cancel">Cancel</button>
        </div>
      </form>
  
      <!-- Success Message -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  
      <!-- Sent Resources Table -->
      <div class="resources-container">
        <h3>Sent Resources</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Resource Name</th>
              <th>Session-Semester</th>
              <th>Description</th>
              <th>Email</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in sentResources" :key="resource._id">
              <td>{{ resource.category }}</td>
              <td>{{ resource.refName }}</td>
              <td>{{ resource.sessionSemester }}</td>
              <td>{{ resource.description }}</td>
              <td>{{ resource.email }}</td>
              <td><a :href="resource.link" target="_blank">View</a></td>
              <td>
                <button class="delete-btn" @click="deleteResource(resource._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        showForm: false, // Track form visibility
        categories: [],
        sessionSemesters: ["2023/2024-1", "2023/2024-2", "2024/2025-1"],
        newResource: {
          category: "",
          refName: "",
          sessionSemester: "",
          description: "",
          email: "",
          link: "",
          sharedBy: localStorage.getItem("full_name"),
        },
        sentResources: [],
        successMessage: "",
        linkError: "",
      };
    },
    methods: {
      toggleForm() {
        this.showForm = !this.showForm; // Toggle form visibility
      },
      async fetchCategories() {
        try {
          const response = await axios.get("http://localhost:5000/api/categories");
          this.categories = response.data;
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
      async fetchSentResources() {
        try {
          const sharedBy = localStorage.getItem("full_name");
          const response = await axios.get("http://localhost:5000/api/sent-resources", {
            params: { sharedBy },
          });
          this.sentResources = response.data;
        } catch (error) {
          console.error("Error fetching sent resources:", error);
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
          await axios.post("http://localhost:5000/api/send-resource", this.newResource);
          this.successMessage = "Resource sent successfully!";
          this.newResource = {
            category: "",
            refName: "",
            sessionSemester: "",
            description: "",
            email: "",
            link: "",
            sharedBy: localStorage.getItem("full_name"),
          };
          this.showForm = false; // Hide the form after submission
          this.fetchSentResources();
          setTimeout(() => (this.successMessage = ""), 5000);
        } catch (error) {
          console.error("Error sending resource:", error);
        }
      },
      async deleteResource(resourceId) {
        try {
          await axios.delete(`http://localhost:5000/api/sent-resources/${resourceId}`);
          this.fetchSentResources();
        } catch (error) {
          console.error("Error deleting resource:", error);
        }
      },
      cancel() {
        this.showForm = false; // Hide the form on cancel
      },
    },
    async mounted() {
      await this.fetchCategories();
      await this.fetchSentResources();
    },
  };
  </script>
  
  

<style scoped>
.toggle-form-btn {
  padding: 10px 15px;
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.toggle-form-btn:hover {
  background: #0056b3;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
}
/* General form styles */
.form-container, .resources-container {
  padding: 20px;
  margin: 20px auto;
  border-radius: 15px;
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: left;
  border-radius: 10px;
}

thead {
  background-color: #007bff;
  color: #ffffff;
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
}

.edit-btn {
  background: #ffc107;
  color: #000;
  padding: 5px 10px;
  border-radius: 5px;
}

.delete-btn {
  background: #dc3545;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
}

.submit-btn, .cancel-btn {
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  margin: 5px;
}

.submit-btn {
  background-color: #28a745;
}

.cancel-btn {
  background-color: #dc3545;
}

.success-message {
  color: #28a745;
  margin-top: 15px;
  text-align: center;
}



h2 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.2);
  outline: none;
}

textarea {
  resize: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

button {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(145deg, #28a745, #218838);
  color: #fff;
}

.submit-btn:hover {
  background: #218838;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

.cancel-btn {
  background: linear-gradient(145deg, #dc3545, #c82333);
  color: #fff;
}

.cancel-btn:hover {
  background: #c82333;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
}

.success-message {
  color: #28a745;
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
}
</style>
