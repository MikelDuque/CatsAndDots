export const BASE_HTTPS_URL = process.env.NEXT_PUBLIC_API_HTTPS_URL;
export const BASE_WSS_URL = process.env.NEXT_PUBLIC_API_WSS_URL;


/* --- AUTHORIZATION CONTROLLER --- */
const API_AUTH_URL = `${BASE_HTTPS_URL}/api/Auth`;

  export const LOGIN_URL = `${API_AUTH_URL}/Login`;
  export const REGISTER_URL = `${API_AUTH_URL}/Register`;


/* --- USER CONTROLLER --- */
const API_USER_URL = `${BASE_HTTPS_URL}/api/User`;

  export function GET_FRIEND_LIST(id: number) {return `${API_USER_URL}/FriendList/${id}`};
  export function GET_PENDING_FRIENDS(id: number) {return `${API_USER_URL}/PendingFriendList/${id}`};
  export const POST_FILTERED_USERS = `${API_USER_URL}/Filtered_Users`;


/* --- ADMIN CONTROLLER --- */
const API_ADMIN_URL = `${BASE_HTTPS_URL}/api/Admin`;

  export const GET_ALL_USERS = `${API_ADMIN_URL}/Get_Users`;
  export const HANDLE_USER = `${API_ADMIN_URL}/Handle_User`;
  export function DELETE_USER(id: number) {return `${API_ADMIN_URL}/Delete_User/${id}`};
  
  
/* --- WEBSOCKET CONTROLLER --- */
export const WEBSOCKET_URL = `${BASE_WSS_URL}/Websocket`;
export const HTTPS_WEBSOCKET = `${BASE_HTTPS_URL}/Websocket`;
