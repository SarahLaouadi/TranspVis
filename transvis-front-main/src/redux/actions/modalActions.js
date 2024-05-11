import { TOGGLE_MODAL } from "../types";
import { TOGGLE_MODAL2 } from "../types";
import { TOGGLE_MODAL3 } from "../types"


export const toggleModal = (type = "", relation = "") => async dispatch => {
    dispatch({
        type: TOGGLE_MODAL,
        payload: { type, relation }
    });
};



export const toggleModal2 = (type = "", relations = "", id = "", ine = "") => async dispatch => {
    dispatch({
        type: TOGGLE_MODAL2,
        payload: { type, relations, id, ine} 
    });
};


export const toggleModal3 = (  applicationData ) => ({
    type: TOGGLE_MODAL3,
    payload: applicationData,
  });