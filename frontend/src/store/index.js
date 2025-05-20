export default new Vuex.Store({
  state: {
    sessionId: localStorage.getItem('session_id') || '',
    role: localStorage.getItem('role') || '',
    email: localStorage.getItem('email') || '', // Add email to the state
  },
  mutations: {
    setSessionId(state, sessionId) {
      state.sessionId = sessionId;
      localStorage.setItem('session_id', sessionId);
    },
    setRole(state, role) {
      state.role = role;
      localStorage.setItem('role', role);
    },
    setEmail(state, email) { // Add mutation for email
      state.email = email;
      localStorage.setItem('email', email);
    },
  },
  actions: {
    login({ commit }, { sessionId, role, email }) {
      commit('setSessionId', sessionId);
      commit('setRole', role);
      commit('setEmail', email); // Commit email mutation
    },
    logout({ commit }) {
      commit('setSessionId', '');
      commit('setRole', '');
      commit('setEmail', ''); // Clear email on logout
      localStorage.clear();
    },
  },
});
