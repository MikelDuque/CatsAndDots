export const BASE_HTTP_URL = process.env.API_HTTPS_URL;
export const BASE_WS_URL = process.env.API_WSS_URL;
export const BASE_WS_URL2 = process.env.NEXT_PUBLIC_API_WSS_URL;
/* --- AUTHORIZATION CONTROLLER --- */
const API_AUTH_URL = `${BASE_HTTP_URL}/api/Auth`;

  export const LOGIN_URL = `${API_AUTH_URL}/Login`;
  export const REGISTER_URL = `${API_AUTH_URL}/Register`;

export const WEBSOCKET_URL = `${BASE_WS_URL2}/api/Websocket`;

console.log('BASE_WS_URL2:', BASE_WS_URL2); // Agregar este log
console.log('BASE_WS_URL2:', BASE_WS_URL);