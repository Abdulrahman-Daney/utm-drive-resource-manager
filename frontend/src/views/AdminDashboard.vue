<template>
  <div>
    <h1>Admin Dashboard</h1>
    <p>Welcome, {{ fullName }}!</p>

    <h2>Dashboard Overview</h2>
    <div class="statistics">
      <p><strong>Total Resources Shared:</strong> {{ totalResources }}</p>
      <p><strong>My Contributions:</strong> {{ myContributions }}</p>
    </div>

    <h2>Resources by Category</h2>
    <div class="chart-container">
      <canvas id="categoryChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      fullName: localStorage.getItem("full_name"), // Logged-in admin's name
      totalResources: 0, // Total number of resources shared in the system
      myContributions: 0, // Resources shared by the logged-in admin
      categoryData: [], // Data for resources by category
    };
  },
  methods: {
    async fetchDashboardData() {
      try {
        // Fetch total resources count
        const allResources = await axios.get(
          "http://localhost:5000/api/resources"
        );
        this.totalResources = allResources.data.length;

        // Fetch contributions made by the admin
        const response = await axios.get(
          "http://localhost:5000/api/resources",
          {
            params: { sharedBy: localStorage.getItem('full_name') },          }
        );
        this.myContributions = response.data.length;

        // Fetch category-wise resource data
        const categoryResponse = await axios.get(
      "http://localhost:5000/api/resources/by-category"
    );
    console.log("Category Data:", categoryResponse.data); // Add this
    this.categoryData = categoryResponse.data;
    this.renderCategoryChart();
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
  }
    },
    renderCategoryChart() {
      const ctx = document.getElementById("categoryChart").getContext("2d");
      const categories = this.categoryData.map((item) => item.category);
      const counts = this.categoryData.map((item) => item.count);

      // Gradient Colors
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "#42a5f5");
      gradient.addColorStop(1, "#478ed1");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "Resources by Category",
              data: counts,
              backgroundColor: gradient, // Gradient background
              borderColor: "#1e88e5",
              borderWidth: 2,
              borderRadius: 10, // Rounded bar edges
              hoverBackgroundColor: "#2196f3",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 14,
                },
                color: "#4f4f4f",
              },
            },
            title: {
              display: true,
              text: "Resources Shared by Category",
              font: {
                size: 18,
              },
              color: "#333",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Resources: ${tooltipItem.raw}`;
                },
              },
              backgroundColor: "#ffffff",
              titleColor: "#4f4f4f",
              bodyColor: "#333",
              borderColor: "#ddd",
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Categories",
                font: {
                  size: 16,
                },
                color: "#4f4f4f",
              },
              ticks: {
                font: {
                  size: 14,
                },
                color: "#4f4f4f",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Resources",
                font: {
                  size: 16,
                },
                color: "#4f4f4f",
              },
              ticks: {
                font: {
                  size: 14,
                },
                color: "#4f4f4f",
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  async mounted() {
    await this.fetchDashboardData(); // Fetch data when the component is mounted
  },
};
</script>

<style scoped>
.statistics {
  margin-bottom: 20px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.chart-container {
  margin: 20px auto;
  
  padding: 15px;
  max-width: 800px; /* Ensure the chart doesn't stretch too wide */
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

</style>
