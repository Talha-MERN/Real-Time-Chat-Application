import { SERVER_URL } from "../configs";

const entity = "message";

export const messageEndpoints = {
  sendMessage: () => `${SERVER_URL}/${entity}/`,
  fetchMessages: (chatId) => `${SERVER_URL}/${entity}/${chatId}`,
};
