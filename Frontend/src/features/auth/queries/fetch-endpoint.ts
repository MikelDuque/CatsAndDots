type FetchProps = {
  url: string;
  type: string;
  token: string | null;
  params: object;
  needAuth?: boolean;
}

export default async function fetchEndpoint({url, type, token, params, needAuth} : FetchProps) {
  console.log(`PETICION: URL: ${url}, tipo: ${type}, token: ${token}, params stringtify: ${JSON.stringify(params)}, needAuth: ${needAuth}`);
  
  const response = (token && needAuth) ?
    await defineFetch({url, type, token, params}).then((response) => {if(response.status !== 401){return response} throw "Unauthorized"}) :
    await defineFetch({url, type, token, params});

  const jsonResponse = await response.json();

  if (response.ok) return jsonResponse;
  
  throw jsonResponse.message;
};

/* ------------------------- */

async function defineFetch({url, type, token, params} : FetchProps) {
  
  if(type !== 'GET' && params) return (
    await fetch(url, {
      method: type,
      headers: printHeaders(token),
      body: params instanceof FormData ? params : JSON.stringify(params)
  }));

  return await fetch(url, {headers: printHeaders(token)});
}

function printHeaders(token : string | null) : {[key : string] : string} {
  if(!token) return {'Content-Type': 'application/json'};

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }; 
}