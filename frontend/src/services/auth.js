function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
}

function isLoggedIn() {
  return !!getToken();
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

const auth = { saveToken, getToken, logout, isLoggedIn, saveUser, getUser  };

export default auth;