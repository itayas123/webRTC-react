import API from "./../utils/API";
import { TOKEN } from "./user.service";

class SourceService {
  addSource = async (name, src, usersToSend) => {
    return await API.post("/sources", {
      source: { name: name, src: src },
      users: usersToSend
    });
  };

  getUserSources = async () => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      return await API.get(`/sources?token=${token}`);
    }
  };

  deleteSource = async name => {
    return await API.delete(`/sources?name=${name}`);
  };
}
export default new SourceService();
