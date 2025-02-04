export const BASE_HTTPS_URL = process.env.NEXT_PUBLIC_API_HTTPS_URL;
export const BASE_WSS_URL = process.env.NEXT_PUBLIC_API_WSS_URL;


/* --- AUTHORIZATION CONTROLLER --- */
const API_AUTH_URL = `${BASE_HTTPS_URL}/api/Auth`;

  export const LOGIN_URL = `${API_AUTH_URL}/Login`;
  export const REGISTER_URL = `${API_AUTH_URL}/Register`;


/* --- USER CONTROLLER --- */
const API_USER_URL = `${BASE_HTTPS_URL}/api/User`;

  export function GET_FRIENDLIST(id: number) {return `${API_USER_URL}/FriendList/${id}`};

  
/* --- WEBSOCKET CONTROLLER --- */
export const WEBSOCKET_URL = `${BASE_WSS_URL}/Websocket`;
export const HTTPS_WEBSOCKET = `${BASE_HTTPS_URL}/Websocket`;
