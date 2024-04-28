import { apiClient } from "./ApiClient";

export const retrieveAllAttacksApi = () => apiClient.get(`/attacks`);

export const deleteAttackApi = (id) => apiClient.delete(`/attacks/${id}`)


export const updateTodoApi = (username, id, todo) => apiClient.put(`/users/${username}/todos/${id}`, todo)



//applications api
export const createNewAppApi = (application) => apiClient.post(`/applications`, application)

export const retrieveAllAppsApi = () => apiClient.get(`/applications`);

export const retrieveAppApi = (id) => apiClient.get(`/applications/${id}`);

export const retrieveAppByNameApi = (name) => apiClient.get(`/applications/${name}`);

export const deleteAppApi = (id) => apiClient.delete(`/applications/${id}`);


//roles of application
export const createNewRoleApi = (id, role) => apiClient.post(`/applications/${id}/roles`, role)

export const retrieveRolesApi = (id) => apiClient.get(`/applications/${id}/roles`)

export const createRolePrivilegeApi = (id, rid, role) => apiClient.put(`/applications/${id}/roles/${rid}`, role)

export const retrieveAppRoleApi = (id, rid) => apiClient.get(`/applications/${id}/roles/${rid}`)