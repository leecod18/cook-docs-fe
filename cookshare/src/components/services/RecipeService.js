import { api } from "./api";

export const likeRecipe = async (recipeId, username) => {
  try {
    const response = await api.post(`/likes/recipe/${recipeId}/like/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unLikeRecipe = async (recipeId, username) => {
  try {
    const response = await api.put(`/likes/recipe/${recipeId}/like/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecipeById = async (recipeId) => {
  try {
    const response = await api.get(`/recipes/${recipeId}/recipe`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllRecipes = async () => {
  try {
    const response = await api.get(`/recipes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get(`/recipes/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCuisines = async () => {
  try {
    const response = await api.get(`/recipes/cuisines`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewOrUpdateReview = async ({ recipeId, reviewInfo }) => {  
  try {
    const response = await api.post(
      `/reviews/recipe/${recipeId}/review`,
      reviewInfo
    );
    return response;
  } catch (error) {
    throw error;
  }
};


export const deleteReview = async ({ ratingId, recipeId }) => {
  try {
    const response = await api.delete(`/reviews/delete`, {
      params: {
        reviewId: ratingId,
        recipeId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateRecipe = async (recipeId, recipe) => {
  try {
    const response = await api.put(`/recipes/${recipeId}/update`, recipe);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRecipe = async ({ recipeId }) => {
  try {
    const response = await api.delete(`/recipes/${recipeId}/delete`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const uploadImage = async ({ recipeId, file }) => {
  // Nếu là ảnh user, truyền userId và imageType=1
  // Nếu là ảnh recipe, truyền recipeId và imageType=2
  const userId = null; // hoặc lấy từ localStorage nếu là ảnh user
  const imageType = 2; // 1: user, 2: recipe

  // Đọc file thành base64
  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Loại bỏ tiền tố "data:image/png;base64," hoặc tương tự
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });

  const fileContent = await toBase64(file);

  const imageRequest = {
    fileName: file.name,
    fileContent,
    userId,
    recipeId,
    imageType,
  };

  try {
    const response = await api.post("/images/upload", imageRequest, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateImage = async ({ imageId, file }) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.put(`/images/image/${imageId}/update`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRecipe = async (recipeData) => {
  try {
    const response = await api.post("/recipes", recipeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getUser = async (userName) => {
  try {
    const response = await api.get("/users", {
      params: { userName },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkUserLike = async (recipeId, userId) => {
  try {
    const response = await api.get("/likes", {
      params: { recipeId, userId }
    });
    console.log('Test',response.data.length);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // console.log(error.response.data);
      return null;
    }
    throw error;
  }
};






