import axiosClient from "../../../api/interceptor";

//----------------- Remove User from Organization -----------------
export const removeUserFromOrg = async (userId: string): Promise<void> => {
    await axiosClient.delete(`/user/${userId}`);
};



//----------------- Remove User from Project -----------------
export const removeUserFromProject = async (userId: string) => {
    const response = await axiosClient.delete(`/project/my-project/members/${userId}`);
    return response.data;
};

//----------------- Add User to Organization -----------------
export const addUserToOrg = async (userId: string[]): Promise<void> => {
    const response = await axiosClient.patch(`/user/members/${userId}`);
    return response.data;
};

//----------------- Add User to Project -----------------
export const addUserToProject = async (userIds: string[]): Promise<void> => {
    const response = await axiosClient.post(`/project/my-project/members`, userIds);
    return response.data;
};