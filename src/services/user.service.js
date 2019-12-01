import API from "./../utils/API";

export const TOKEN = "token";

class UserService {
  register = async (name, email, password) => {
    try {
      const user = await API.post("/users", { name, email, password });
      localStorage.setItem(TOKEN, user.token);
      return user;
    } catch (e) {
      throw e;
    }
  };

  login = async (email, password) => {
    try {
      const user = await API.get(`/auth?email=${email}&password=${password}`);
      localStorage.setItem(TOKEN, user.token);
      return user;
    } catch (e) {
      throw e;
    }
  };

  logout = () => {
    localStorage.removeItem(TOKEN);
  };

  getAllUsers = async () => {
    return await API.get("/users");
  };

  getCurrentUser = async () => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      return await API.get(`/users/getCurrentUser?token=${token}`);
    }
  };
}

export default new UserService();
