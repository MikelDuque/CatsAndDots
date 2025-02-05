import { FetchProps } from "@/lib/types";

export default async function fetchEndpoint({url, type, token, params, needAuth} : FetchProps) {
  console.log(`PETICION: URL: ${url}, tipo: ${type}, token: ${token}, params stringtify: ${params}, needAuth: ${needAuth}`);

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
  const response = (token && needAuth) ?
    await defineFetch({url, type, token, params}).then((response) => {if(response.status !== 401){return response} throw "Unauthorized"}) :
    await defineFetch({url, type, token, params});

  const jsonResponse = await response.json();
  console.log("jsonresponse fetch", jsonResponse);
  

  if (response.ok) return jsonResponse;
  
  throw jsonResponse.message;
};

/* ------------------------- */

async function defineFetch({url, type, token, params} : FetchProps) {

  if(type !== 'GET' && params instanceof FormData) return (
    await fetch(url, {
      method: type,
      body: params
  }));
  
  if(type !== 'GET' && params) return (
    await fetch(url, {
      method: type,
      headers: printHeaders(token),
      body: JSON.stringify(params)
  }));

  return await fetch(url, {headers: printHeaders(token)});
}

function printHeaders(token : string | unknown) : {[key : string] : string} {
  if(!token) return {'Content-Type': 'application/json'};

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }; 
}