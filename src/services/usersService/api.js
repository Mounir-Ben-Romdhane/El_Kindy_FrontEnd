import {  axiosPublic } from "api/axios";



export const getUsers = async (role, axiosPrivate) => {
    const reponse = await axiosPrivate.get(`/auth/getAllUserByRole/${role}`);
    return reponse;
}

export const getUserById = async (id, axiosPrivate) => {
  const reponse = await axiosPrivate.get(`/auth/userById/${id}`);
  return reponse;
}

// Remove a user
export const removeUser = async (userId, axiosPrivate) => {
    try {
        const response = await axiosPrivate.delete(`/auth/removeUser/${userId}`);
        return response;
    } catch (error) {
        console.error('Error removing user:', error);
        throw error;
    }
};

// Add a new user
export const addAdmin = async (userData, axiosPrivate) => {
    try {
        const response = await axiosPrivate.post(`/auth/addAdmin`, userData);
        return response;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

// Update an existing user
export const updateAdmin = async (userId, userData, axiosPrivate) => {
    try {
        const response = await axiosPrivate.put(`/auth/updateAdmin/${userId}`, userData);
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Block a user
export const blockUser = async (userId, axiosPrivate) => {
    try {
      const response = await axiosPrivate.put(`/auth/blockUser/${userId}`);
      return response;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  };
  
  // Unblock a user
  export const unblockUser = async (userId,axiosPrivate) => {
    try {
      const response = await axiosPrivate.put(`/auth/unblockUser/${userId}`);
      return response;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  };


  
// Add a new teacher
export const addTeacher = async (teacherData, axiosPrivate) => {
  try {
      const response = await axiosPrivate.post(`/auth/addTeacher`, teacherData);
      return response;
  } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
  }
};

// Update an existing teacher
export const updateTeacher = async (teacherId, teacherData, axiosPrivate) => {
  try {
      const response = await axiosPrivate.put(`/auth/updateTeacher/${teacherId}`, teacherData);
      return response;
  } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
  }
};

// Add a new student
export const addStudent = async (studentData, axiosPrivate) => {
  try {
    const response = await axiosPrivate.post(`/auth/addStudentAndParent`, studentData);
    return response;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

// Update an existing student
export const updateStudent = async (studentId, studentData, axiosPrivate) => {
  try {
    const response = await axiosPrivate.put(`/auth/updateStudent/${studentId}`, studentData);
    return response;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};


  