import axios from 'axios';

//ACTION TYPES
const GET_USER_ARTICLES = 'GET_USER_ARTICLES';
const CREATE_USER_ARTICLE = 'CREATE_USER_ARTICLE';
const READ_USER_ARTICLE = 'READ_USER_ARTICLE';
const UPD_USER_ARTICLE = 'UPD_USER_ARTICLE';
const DELETE_USER_ARTICLE = 'DELETE_USER_ARTICLE';

//ACTION CREATORS
//Get all articles for a single user
const _getUserArticles = (articles) => {
  return {
    type: GET_USER_ARTICLES,
    articles,
  };
};

// CREATE AN ARTICLE
const _createUserArticle = (article) => {
  return {
    type: CREATE_USER_ARTICLE,
    article,
  };
};

// UPDATE THE ARTICLE(MARK AS READ)
const _readUserArticle = (article) => {
  return {
    type: READ_USER_ARTICLE,
    article,
  };
};

// UPDATE THE ARTICLE(FROM EDIT COMPONENT)
const _updUserArticle = (article) => {
  return {
    type: UPD_USER_ARTICLE,
    article,
  };
};

// DELETE USER ARTICLE
const _deleteUserArticle = (article) => {
  return {
    type: DELETE_USER_ARTICLE,
    article,
  };
};

//THUNKS
//get all articles for a singlue user
export const getUserArticles = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/userArticles/${id}`);
      dispatch(_getUserArticles(response.data));
    } catch (error) {
      console.log(error);
    }
  };
};

// CREATE A SINGLE ARTICLE
export const createNewArticle = (article, userId, history) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.post(`/api/articles`, {
        article,
        userId,
      });
      console.log('response',data)
      dispatch(_createUserArticle(data));
      history.push('/home');
    } catch (err) {
      console.log('CREATE A NEW ARTICLE ERR:', err);
    }
  };
};

// CREATE A SINGLE Extension ARTICLE
export const createNewExtensionArticle = (url, name, userId, tags) => {
  let article = { url: url, name: name, tags: [tags.split(',')] };
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`"http://localhost:8080/api/articles`, {
        article,
        userId,
      }); // verify and store error details in createFormError redux peroperty
      dispatch(_createUserArticle(data));
    } catch (err) {
      console.log('CREATE A NEW ARTICLE ERR:', err);
    }
  };
};

//get all user tags
export const getExtensionUserArticles = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/userArticles/${id}`
      );
      dispatch(_getUserArticles(data));
    } catch (error) {
      console.log(error);
    }
  };
};

// UPDATE A USER ARTICLE AS READ
export const markUserArticle = (userId, article) => {
  return async (dispatch) => {
    try {
      console.log('UPDATE USER_ID > ', userId);
      console.log('UPDATE ARTICLE > ', article);

      const { data } = await axios.put(`/api/userArticles/${userId}`, {
        article,
        userId,
      });
      console.log('THUNK UPDATE DATA > ', data);

      dispatch(_readUserArticle(data));
      // history.push("/home");
    } catch (err) {
      console.log('UPDATE ATICLE ERR:', err);
    }
  };
};

// update bookamrk (from the EditBookmark component)
export const updBookmark = (article) => {
  return async (dispatch) => {
    try {
      let result = await axios.put(`/api/articles`, {
        article,
      });
      dispatch(_updUserArticle(result.data));
      return result;
    } catch (err) {
      console.log('UPDATE BOOKMARK ERR:', err);
    }
  };
};

// DELETE USER ARTICLE
export const deleteProduct = (articleId, article) => {
  return async (dispatch) => {
    try {
      // console.log("DELETED DATA USER_ID > ", articleId);
      // console.log("DELETED DATA ARTICLE > ", article);

      const result = await axios.delete(`/api/userArticles/${articleId}`, {
        article,
      });
      console.log('DELETED DATA > ', result.data);
      dispatch(_deleteUserArticle(result.data));
      return result;
    } catch (err) {
      console.log('DELETE PRODUCTS ERR:', err);
    }
  };
};

//REDUCER
//Initial State
const initialState = [];

//Reducer
export default function userArticleReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_ARTICLES:
      let articles = action.articles.map((data) => {
        return { ...data, unread: data.readAt === null };
      });
      return articles;
    case CREATE_USER_ARTICLE:
      return [...state, action.article];
    case READ_USER_ARTICLE:
      return state.map((article) =>
        article.id === action.article.id ? action.article : article
      );
    case UPD_USER_ARTICLE:
      return state.map((article) =>
        article.id === action.article.id ? action.article : article
      );
    case DELETE_USER_ARTICLE:
      return state.filter((article) => article.id !== action.article.id);
    default:
      return state;
  }
}
