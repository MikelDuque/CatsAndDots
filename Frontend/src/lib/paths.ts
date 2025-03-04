export const homePath = "/";

export const loginPath = `${homePath}login/`;
export const menuPath = `${homePath}menu/`;
export const matchMakingPath = `${homePath}match-making/`;
export const gamePath = `${homePath}game/`;
export const adminPath = `${homePath}admin/`;
export function profilePath(id: number) {return `${homePath}user/${id}`};