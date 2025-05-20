<template>
  <div>
    <h1>Student Dashboard</h1>
    <p>Welcome, {{ fullName }}!</p>

    <h2>Dashboard Overview</h2>
    <div class="statistics">
      <p><strong>Total Resources Shared:</strong> {{ totalResources }}</p>
      <p><strong>My Contributions:</strong> {{ myContributions }}</p>
    </div>

    <h2>Resources Breakdown</h2>
    <div class="chart-container">
      <canvas id="categoryChart"></canvas>
    </div>

    <h2>Contribution Analysis</h2>
    <div class="chart-container">
      <canvas id="contributionChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      fullName: localStorage.getItem("full_name"),
      totalResources: 0,
      myContributions: 0,
      categoryData: [], // For resources by category
    };
  },
  methods: {
    async fetchDashboardData() {
      try {
        // Fetch total resources count
        const allResources = await axios.get("http://localhost:5000/api/resources");
        this.totalResources = allResources.data.length;

        // Fetch contributions made by the student
        const myResources = await axios.get("http://localhost:5000/api/resources", {
          params: { sharedBy: localStorage.getItem("full_name") },
        });
        this.myContributions = myResources.data.length;

        // Fetch category-wise data
        const categoryResponse = await axios.get(
          "http://localhost:5000/api/resources/by-category"
        );
        this.categoryData = categoryResponse.data;

        // Render charts after fetching data
        this.renderCategoryChart();
        this.renderContributionChart();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    },
    renderCategoryChart() {
      const ctx = document.getElementById("categoryChart").getContext("2d");
      const categories = this.categoryData.map((item) => item.category);
      const counts = this.categoryData.map((item) => item.count);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "Resources by Category",
              data: counts,
              backgroundColor: "#007bff",
              borderColor: "#0056b3",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Resources Breakdown by Category",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Categories",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Resources",
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
    renderContributionChart() {
      const ctx = document.getElementById("contributionChart").getContext("2d");
      const contributions = [this.myContributions, this.totalResources - this.myContributions];
      const labels = ["My Contributions", "Other Contributions"];

      new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: contributions,
              backgroundColor: ["#007bff", "#f1f1f1"],
              hoverBackgroundColor: ["#0056b3", "#dcdcdc"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Contribution Analysis",
            },
          },
        },
      });
    },
  },
  async mounted() {
    await this.fetchDashboardData();
  },
};
</script>

<style scoped>
.statistics {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.statistics p {
  margin: 0;
  font-size: 1.2rem;
  color: #34495e;
  text-align: center;
  flex: 1 1 calc(50% - 20px);
}

.statistics p strong {
  color: #007bff;
  font-weight: bold;
}

.chart-container {
  margin: 30px auto;
  padding: 15px;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
