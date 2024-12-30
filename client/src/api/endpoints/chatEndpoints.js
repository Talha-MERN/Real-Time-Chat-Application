import { SERVER_URL } from "../configs";

const entity = "chat";

export const chatEndpoints = {
  accessChats: () => `${SERVER_URL}/${entity}`,
  fetchingChats: () => `${SERVER_URL}/${entity}`,
  createGroupChat: () => `${SERVER_URL}/${entity}/create-group`,
  renameGroup: () => `${SERVER_URL}/${entity}/rename-group`,
  addToGroup: () => `${SERVER_URL}/${entity}/add-to-group`,
  removeFromGroup: () => `${SERVER_URL}/${entity}/remove-from-group`,
};
