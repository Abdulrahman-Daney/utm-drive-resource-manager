<template>
    <div class="view-resources">
      <h2> Shared with me</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Link</th>
              <th>Shared By</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in sentResources" :key="resource._id">
              <td>{{ resource.refName }}</td>
              <td>{{ resource.category }}</td>
              <td>{{ resource.description }}</td>
              <td>
                <a :href="resource.link" target="_blank">View Resource</a>
              </td>
              <td>{{ resource.sharedBy }}</td>
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
        sentResources: [],
      };
    },
    methods: {
      async fetchSentResources() {
        try {
          const email = localStorage.getItem("email").trim();
          console.log(email)
          const response = await axios.get("http://localhost:5000/api/sent-resources", {
            params: { email },
          });
          this.sentResources = response.data;
        } catch (err) {
          console.error("Error fetching sent resources:", err);
        }
      },
    },
    async mounted() {
      await this.fetchSentResources();
    },
  };
  </script>
  
  <style scoped>
  .view-resources {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #333;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  thead {
    background-color: #007bff;
    color: white;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    text-align: left;
    padding: 12px;
  }
  
  tbody tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  