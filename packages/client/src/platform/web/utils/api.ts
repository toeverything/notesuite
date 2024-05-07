const endpoint = 'http://localhost:3000';

namespace API {
  export interface Workspace {
    id: string;
    name: string;
    rootId: string;
  }
}

async function fetchWorkspaces() {
  const response = await fetch(`${endpoint}/api/workspaces`);
  const workspaces = (await response.json()) as API.Workspace[];
  return workspaces;
}

async function createWorkspace(name: string) {
  const response = await fetch(`${endpoint}/api/workspaces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  const workspace = (await response.json()) as API.Workspace;
  return workspace;
}

async function setActiveWorkspace(id: string) {
  await fetch(`${endpoint}/api/workspaces/active/${id}`, {
    method: 'PUT',
  });
}

export const api = {
  fetchWorkspaces,
  createWorkspace,
  setActiveWorkspace,
};
