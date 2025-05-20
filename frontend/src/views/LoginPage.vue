<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login">Login</label>
          <input
            id="login"
            type="text"
            v-model="login"
            placeholder="Enter your login ID"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            class="form-input"
          />
        </div>
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      login: "",
      password: "",
      error: "",
      isLoading: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.isLoading = true;
        this.error = "";

        // Mock Admin Login
        if (this.login === "admin" && this.password === "admin123") {
          const role = "Admin";
          localStorage.setItem("session_id", "mock-session-id-admin");
          localStorage.setItem("full_name", "Admin User"); // Correctly set full_name
          localStorage.setItem("login_name", "admin");
          localStorage.setItem("role", role);
          localStorage.setItem("email", "admin@mockup.local");

          // Save user to MongoDB
          await axios.post("http://localhost:5000/api/save-user", {
            session_id: "mock-session-id-admin",
            full_name: "Admin User",
            login_name: "admin",
            email: "admin@mockup.local",
            role,
          });

          this.$router.push("/admin-dashboard");
          return;
        }

        // Real user authentication
        const response = await axios.get(
          "http://web.fc.utm.my/ttms/web_man_webservice_json.cgi",
          {
            params: {
              entity: "authentication",
              login: this.login,
              password: this.password,
            },
          }
        );

        if (response.data.length > 0 && response.data[0].session_id) {
          const user = response.data[0]; // Get the user object

          // Save full_name and other details
          localStorage.setItem("session_id", user.session_id);
          localStorage.setItem("full_name", user.full_name); // Set the correct full_name
          localStorage.setItem("login_name", user.login_name);
          localStorage.setItem("email", user.email);
          // Determine role using the response data
          let role = user.role || ""; // Default to empty if not provided
          if (!role) {
            // Fallback logic for role determination
            if (user.login_name.startsWith("A")) {
              role = "Student";
            } else if (user.login_name.startsWith("12")) {
              role = "Lecturer";
            } else {
              role = "Admin"; // Fallback role
            }
          }
          localStorage.setItem("role", role); // Set the determined role

          // Save user to MongoDB
          await axios.post("http://localhost:5000/api/save-user", {
            session_id: user.session_id,
            full_name: user.full_name,
            login_name: user.login_name,
            email: user.email,
            role,
          });

          // Redirect based on role
          if (role === "Student") this.$router.push("/student-dashboard");
          else if (role === "Lecturer")
            this.$router.push("/lecturer-dashboard");
          else if (role === "Admin") this.$router.push("/admin-dashboard");
        } else {
          this.error = "Invalid login or password.";
        }
      } catch (err) {
        console.error(err);
        this.error = "Failed to connect to the authentication server.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("@/assets/UTM-image.jpg");

  background-size: cover;
  position: relative;
}

.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  z-index: 1;
}

.login-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 2;
}

h1 {
  margin-bottom: 1rem;
  color: #1d4ed8;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #1d4ed8;
}

.login-button {
  background: #1d4ed8;
  color: #fff;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:disabled {
  background: #999;
  cursor: not-allowed;
}

.login-button:hover:not(:disabled) {
  background: #3b82f6;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
