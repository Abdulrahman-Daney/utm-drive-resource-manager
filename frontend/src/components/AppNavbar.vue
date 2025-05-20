<template>
  <div class="navbar">
    <!-- Logo Section -->
    <div class="navbar-logo">
      <img :src="require('@/assets/UTM-LOGO.png')" alt="Logo" />
    </div>

    <!-- Navigation Links -->
    <ul>
      <!-- Dashboard Navigation -->
      <li>
        <router-link to="/admin-dashboard" v-if="role === 'Admin'">Dashboard</router-link>
        <router-link to="/lecturer-dashboard" v-if="role === 'Lecturer'">Dashboard</router-link>
        <router-link to="/student-dashboard" v-if="role === 'Student'">Dashboard</router-link>
      </li>

      <!-- Admin Navigation -->
    
    
      <li v-if="role === 'Admin' || role === 'Lecturer'">
        <router-link
          :to="role === 'Admin' ? '/admin-dashboard/add-resource' : '/lecturer-dashboard/add-resource'"
        >  Upload Resources
        </router-link>
      </li>

      <li v-if="role === 'Admin' || role === 'Lecturer'">
        <router-link :to="role === 'Admin' ? '/admin-dashboard/SendResource' : '/lecturer-dashboard/SendResource'">
          Assign Resources</router-link>
      </li>

      <li v-if="role === 'Admin' || role === 'Lecturer'">
        <router-link
          :to="role === 'Admin' ? '/admin-dashboard/resources-shared-by-me' : '/lecturer-dashboard/resources-shared-by-me'"
        >Shared by Me</router-link>
      </li>
      <li v-if="role === 'Admin' || role === 'Lecturer'">
        <router-link :to="role === 'Admin' ? '/admin-dashboard/ViewSentResources' : '/lecturer-dashboard/ViewSentResources'"
        > Shared with Me</router-link>
      </li>
      <li v-if="role === 'Lecturer' || role === 'Admin'">
        <router-link :to="role === 'Admin' ? '/admin-dashboard/all-resources' : '/lecturer-dashboard/all-resources'">
          All Resources</router-link>
      </li>
      
      <li v-if="role === 'Admin' || role === 'Lecturer'">
        <router-link
          :to="role === 'Admin' ? '/admin-dashboard/manage-resources' : '/lecturer-dashboard/manage-resources'"
        >Manage Resources</router-link>
      </li>

      <li v-if="role === 'Admin'">
        <router-link to="/admin-dashboard/manage-categories">Manage Categories</router-link>
      </li>


      <!-- Student Navigation -->
      <li v-if="role === 'Student'">
        <router-link to="/student-dashboard/add-resource">Upload Resources</router-link>
      </li>

      <li v-if="role === 'Student'">
        <router-link to="/student-dashboard/resources-shared-by-me">Shared by Me</router-link>
      </li>

      <li v-if="role === 'Student'">
        <router-link to="/student-dashboard/ViewSentResources"> Shared with Me</router-link>
      </li>

      <li v-if="role === 'Student'">
        <router-link to="/student-dashboard/all-resources">All Resources</router-link>
      </li>
    </ul>

    <!-- Logout Button -->
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: localStorage.getItem('role'), // Retrieve the user's role
    };
  },
  methods: {
    logout() {
      localStorage.clear(); // Clear local storage
      this.$router.push('/'); // Redirect to login page
    },
  },
};
</script>

<style scoped>
/* Navbar container */
.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #34495e; /* Slightly lighter shade of dark blue */
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2); /* Subtle shadow for better separation */
  z-index: 1000; /* Ensure it stays above other elements */
}

/* Logo container */
.navbar-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px; /* Space below the logo */
}

.navbar-logo img {
  max-width: 70%; /* Ensure the image doesn't exceed container width */
  max-height: 70px; /* Limit the height */
  border-radius: 10px; /* Optional: Rounded corners */
  object-fit: contain; /* Ensure the image fits within its bounds */
  margin-top: 20px;
}

/* Navigation links container */
.navbar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar ul li {
  margin-bottom: 5px;
}

.navbar ul li a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 10px 15px; /* Add padding for clickable area */
  border-radius: 5px; /* Rounded corners for links */
  display: block; /* Ensure the clickable area spans the full width */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions */
}

.navbar ul li a:hover {
  background-color: #1abc9c; /* Add hover effect with a teal shade */
  color: white; /* Ensure text remains visible */
  transform: scale(1.05); /* Slight zoom effect */
}

/* Logout button */
.logout-btn {
  margin-top: auto;
  margin-bottom: 50px;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.logout-btn:hover {
  background-color: #c0392b; /* Darker shade on hover */
  transform: scale(1.05); /* Slight zoom effect */
}

/* Responsive design */
@media (max-width: 768px) {
  .navbar {
    width: 200px; /* Adjust width for smaller screens */
    padding: 15px;
  }

  .navbar-logo img {
    max-height: 80px; /* Adjust logo size for smaller screens */
  }

  .navbar ul li a {
    font-size: 14px; /* Reduce font size for smaller screens */
    padding: 8px 12px;
  }

  .logout-btn {
    font-size: 14px;
    padding: 10px 15px;
  }
}
</style>
