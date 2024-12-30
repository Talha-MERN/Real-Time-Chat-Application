import { SERVER_URL } from "../configs";

const entity = "user";

export const userEndpoints = {
  registerUser: () => `${SERVER_URL}/${entity}/registration`,
  loginUser: () => `${SERVER_URL}/${entity}/login`,
  getSearchedUsers: (name) =>
    `${SERVER_URL}/${entity}/all-users?search=${name}`,
};
