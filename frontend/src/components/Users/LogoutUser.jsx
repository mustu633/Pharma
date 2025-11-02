const LogoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
  return null; // returning something avoids lint warning for functional components
};

export default LogoutUser;
