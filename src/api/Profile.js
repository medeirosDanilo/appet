import { getData, apiPath } from "../helpers";

const sendCredentials = async function(credentials) {
  const response = await fetch(`${apiPath()}/auth/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.status === 401) {
    throw new Error('Não foi possível realizar a autenticação');
  }
  return await response.json();
}

const register = async function(token) {
  const response = await fetch(`${apiPath()}/register`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': token,
    },
  });
  if (response.status === 401) {
    throw new Error('Você não está autenticado.');
  }
  return await response.json();
}

const refresh = async function(token) {
  const response = await fetch(`${apiPath()}/auth/refresh`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': token,
    },
  });
  if (response.status === 401) {
    throw new Error('Você não está autenticado.');
  }
  return await response.json();
}

const signUp = async function(user) {
  const response = await fetch(`${apiPath()}/signup`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (response.status === 422) {
    throw new Error('Não foi possível concluir seu cadastro.');
  }
  return await response.json();
};

const updateUser = async function(user) {
  const authToken = await getData('token');
  const response = await fetch(`${apiPath()}/register`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authToken,
    },
  });
  if (response.status === 422) {
    throw new Error('Não foi possível atualizar seu perfil.');
  }
  return await response.json();
};

export { register, sendCredentials, signUp, updateUser, refresh };