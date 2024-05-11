import { TOGGLE_MODAL, TOGGLE_MODAL2, TOGGLE_MODAL3 } from "../types";

const initialState = {
    opened: false,
    type: "",
    relation: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_MODAL:
            return {
                ...state,
                opened: !state.opened,
                type: action.payload.type,
                relation: action.payload.relation
            };
        case TOGGLE_MODAL2:
            return {
                ...state,
                opened: !state.opened,
                type: action.payload.type,
                relation: action.payload.relations,
                id: action.payload.id,
                ine: action.payload.ine
            };

        default:
            return state;
    }
};
