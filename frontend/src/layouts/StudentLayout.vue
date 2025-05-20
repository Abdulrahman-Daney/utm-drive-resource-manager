<template>
    <div>
      <!-- Include Navbar -->
      <AppNavbar />
      <!-- Main Content Area -->
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import AppNavbar from '@/components/AppNavbar.vue';
  
  export default {
    components: {
      AppNavbar,
    },
  };
  </script>
   <style scoped>
  .main-content {
    margin-left: 250px; /* Adjust for navbar width */
    padding: 20px;
  }
  </style>