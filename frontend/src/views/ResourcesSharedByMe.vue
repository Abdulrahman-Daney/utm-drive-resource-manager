<template>
  <div>
    <h2>Resources Shared by Me</h2>

    <!-- Resources Table -->
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Ref. Name</th>
          <th>Session-Semester</th>
          <th>Description</th>
          <th>Link</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in sharedByMe" :key="resource._id">
          <td>{{ resource.category }}</td>
          <td>{{ resource.refName }}</td>
          <td>{{ resource.sessionSemester }}</td>
          <td>{{ resource.description }}</td>
          <td>
            <a :href="resource.link" target="_blank">View</a>
          </td>
          <td>
            <button @click="openEditForm(resource)">Edit</button>
            <button @click="deleteResource(resource._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Resource Form -->
    <div v-if="isEditing" class="edit-form">
      <h3>Edit Resource</h3>
      <form @submit.prevent="submitEdit">
        <input v-model="currentResource.category" placeholder="Category" />
        <input v-model="currentResource.refName" placeholder="Ref. Name" />
        <input v-model="currentResource.sessionSemester" placeholder="Session-Semester" />
        <input v-model="currentResource.description" placeholder="Description" />
        <input v-model="currentResource.link" placeholder="Link" />
        <div class="form-actions">
          <button type="submit">Save</button>
          <button type="button" @click="cancelEdit">Cancel</button>
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
      sharedByMe: [], // Resources shared by the admin
      isEditing: false, // State for edit mode
      currentResource: null, // Resource being edited
    };
  },
  methods: {
    async fetchResources() {
      try {
        const response = await axios.get("http://localhost:5000/api/resources", {
          params: { sharedBy: localStorage.getItem("full_name") }, // Filter by admin's name
        });
        this.sharedByMe = response.data; // Populate resources list
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    },
    async deleteResource(id) {
      try {
        await axios.delete(`http://localhost:5000/api/resources/${id}`);
        this.fetchResources(); // Refresh the list after deletion
      } catch (err) {
        console.error("Error deleting resource:", err);
      }
    },
    openEditForm(resource) {
      this.isEditing = true;
      this.currentResource = { ...resource }; // Create a copy of the resource for editing
    },
    async submitEdit() {
      try {
        await axios.put(
          `http://localhost:5000/api/resources/${this.currentResource._id}`,
          this.currentResource
        );
        this.isEditing = false;
        this.fetchResources(); // Refresh the list after editing
      } catch (err) {
        console.error("Error updating resource:", err);
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.currentResource = null; // Clear edit form
    },
  },
  mounted() {
    this.fetchResources(); // Fetch resources when component is mounted
  },
};
</script>







<style scoped>
/* Table styles */
table {
  width: 95%;
  border-collapse: collapse;
  background-color: #ffffff; /* Clean white background */
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Apply rounded corners to entire table */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  margin-left: 40px;
}

thead {
  background-color: #34495e; /* Header background color */
  color: white; /* White text for the header */
}

th,
td {
  padding: 12px; /* Comfortable padding */
  text-align: left;
  border-bottom: 1px solid #ddd; /* Bottom border for separation */
  font-size: 1rem; /* Readable font size */
}

tr:hover {
  background-color: #f1faff; /* Subtle hover effect */
  transition: background-color 0.3s ease; /* Smooth transition */
}

th {
  text-transform: uppercase; /* Uppercase headers */
  letter-spacing: 0.05em; /* Slight letter spacing */
}

/* Buttons */
button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: scale(1.03); /* Slightly larger on hover */
}

button[type="submit"] {
  background-color: #28a745; /* Green for submit */
  color: white;
}

button[type="submit"]:hover {
  background-color: #218838; /* Darker green on hover */
}

button[type="button"] {
  background-color: #dc3545; /* Red for cancel/delete */
  color: white;
}

button[type="button"]:hover {
  background-color: #c82333; /* Darker red on hover */
}

/* Edit form */
.edit-form {
  margin: 30px auto;
  padding: 20px;
  max-width: 600px; /* Limit the width of the form */
  background-color: #ffffff; /* Clean white background */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Shadow for a floating effect */
  border: 1px solid #ddd; /* Light border */
}

.edit-form h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #007bff; /* Primary blue for headings */
}

.edit-form input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.edit-form input:focus {
  border-color: #007bff; /* Highlight border on focus */
  outline: none; /* Remove default outline */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); /* Subtle glow */
}

/* Actions column */
td:last-child {
  display: flex;
  gap: 10px; /* Space between buttons */
}

td a {
  color: #007bff; /* Blue links */
  text-decoration: none; /* Remove underline */
}

td a:hover {
  text-decoration: underline; /* Underline on hover */
}

/* Responsive design */
@media (max-width: 768px) {
  table {
    font-size: 0.9rem; /* Smaller font for smaller screens */
  }

  .edit-form {
    width: 90%; /* Adjust form width */
    padding: 15px;
  }
}
</style>

