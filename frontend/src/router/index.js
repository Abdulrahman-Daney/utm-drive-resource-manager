import { createRouter, createWebHistory } from 'vue-router';
import AllResources from '@/views/AllResources.vue';
import LoginPage from '@/views/LoginPage.vue';
import StudentLayout from '@/layouts/StudentLayout.vue';
import StudentDashboard from '@/views/StudentDashboard.vue';
import ResourcesSharedByMe from '@/views/ResourcesSharedByMe.vue';
import AddResource from '@/components/AddResource.vue'; // Import only once
import LecturerLayout from '@/layouts/LecturerLayout.vue';
import LecturerDashboard from '@/views/LecturerDashboard.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import ManageCategories from '@/components/ManageCategories.vue';
import ManageResources from '@/components/ManageResources.vue';
import SendResource from '@/components/SendResource.vue';
import ViewSentResources from '@/components/ViewSentResources.vue';




const routes = [
  { path: '/', name: 'Login', component: LoginPage },

  // Student Dashboard and Children
  {
    path: '/student-dashboard',
    component: StudentLayout,
    children: [
      { path: '', name: 'StudentDashboard', component: StudentDashboard },
      { path: 'resources-shared-by-me', name: 'StudentResourcesSharedByMe', component: ResourcesSharedByMe },
      { path: 'all-resources', name: 'StudentAllResources', component: AllResources }, 
      { path: 'add-resource', name: 'AddResource', component: AddResource },
      { path: 'ViewSentResources', name: 'StudentViewSentResources', component: ViewSentResources },

      
    ],
  },
  
  

  // Lecturer Dashboard and Children
  {
    path: '/lecturer-dashboard',
    component: LecturerLayout,
    children: [
      { path: '', name: 'LecturerDashboard', component: LecturerDashboard },
      { path: 'manage-resources', name: 'LecturerManageResources', component: ManageResources },
      { path: 'all-resources', name: 'lecturerAllResources', component: AllResources },
      { path: 'add-resource', name: 'LecturerAddResource', component: AddResource },
      { path: 'SendResource', name: 'LecturerSendResource', component: SendResource },
      { path: 'resources-shared-by-me', name: 'LecturerResourcesSharedByMe', component: ResourcesSharedByMe },
      { path: 'ViewSentResources', name: 'LecturerViewSentResources', component: ViewSentResources },

    ],
  },

  // Admin Dashboard and Children
  {
    path: '/admin-dashboard',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'manage-categories', name: 'ManageCategories', component: ManageCategories },
      { path: 'manage-resources', name: 'AdminManageResources', component: ManageResources },
      { path: 'all-resources', name: 'adminAllResources', component: AllResources },
      { path: 'add-resource', name: 'AdminAddResource', component: AddResource },
      { path: 'resources-shared-by-me', name: 'AdminResourcesSharedByMe', component: ResourcesSharedByMe },
      { path: 'SendResource', name: 'AdminSendResource', component: SendResource },
      { path: 'ViewSentResources', name: 'AdminViewSentResources', component: ViewSentResources },


      
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const sessionId = localStorage.getItem('session_id');
  const role = localStorage.getItem('role');

  if (!sessionId && to.path !== '/') {
    next('/'); // Redirect to login if not authenticated
  } else if (to.path === '/student-dashboard' && role !== 'Student') {
    next('/'); // Redirect unauthorized access
  } else if (to.path.startsWith('/lecturer-dashboard') && role !== 'Lecturer') {
    next('/'); // Redirect unauthorized access
  } else if (to.path.startsWith('/admin-dashboard') && role !== 'Admin') {
    next('/'); // Redirect unauthorized access
  } else {
    next(); // Allow access
  }
});

export default router;
