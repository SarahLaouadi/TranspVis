import axios from "axios";

import {
    GET_RELATIONS,
    TOGGLE_LOADING_RELATIONS,
    ADD_STAKEHOLDER_INFORMATION_ELEMENT_RELATION,
    REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION_FROM_REDUX,
    REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION
} from "../types";
import { environment } from "../../utils/environment";
import { environmentML } from "../../utils/environmentML";

// Get relationships
export const getRelationships = (params = {}) => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_RELATIONS });
        const url = environment.apiEndpoint;
        const res = await axios.get(
            url + "stakeholder-information-relationships/",
            { params: { ...params } }
        );

        dispatch({
            type: GET_RELATIONS,
            payload: res.data
        });
    } catch (error) {
        console.error(
            "Error get stakeholders information elements relationships: ",
            error
        );
    }
};




export const binary_relation = (information_elements, stakeholders) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const url = environmentML.apiEndpoint;

        
        const data = {
             stakeholder : stakeholders.name,
             ie : information_elements.name
        }
        console.log("st and ie ====: ", data);
        console.log('Response data relation:', url);
        const res = await axios.post(
            url + "binary_relation_extraction/",
            JSON.stringify(data),
            config
        );

        console.log("res.data = ", res.data);
        // Assuming res.data is the array you received
        const dataArray = res.data;

        const extractedData = dataArray.map(item => ({
            informationElement: item.information_element,
            predictedRelation: item.predicted_relation,
            stakeholder: item.stakeholder,
        }));
        
        // Access each item outside of the map function
        const firstItem = extractedData[0];

        
        const newrelation = {
            st: firstItem.stakeholder,
            ie: firstItem.informationElement,
            relation: firstItem.predictedRelation,
        };
        
        console.log("newrelation............................... = ", newrelation);

        dispatch({ type: ADD_STAKEHOLDER_INFORMATION_ELEMENT_RELATION, payload: newrelation });
        return newrelation.relation;

    } catch (error) {
        console.error("Error predicting relation existence: ", error);
        return 0; 
    }
};


/*
export const relation_type = (information_elements, stakeholders) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        dispatch({ type: TOGGLE_LOADING_RELATIONS });
        const url = environmentML.apiEndpoint;

        
        const data = {
             stakeholder : stakeholders,
             ie : information_elements
        }
        console.log("st and ie ====: ", data);
        console.log('Response data:', url);
        const res = await axios.post(
            url + "relation_extraction/",
            JSON.stringify(data),
            config
        );

        console.log("res.data = ", res.data);


        
        let relations = [];

        for (let i = 0; i < res.data.length; i++) {
            const newrelationtype = {
                stakholder: res.data[i].stakeholder,
                info_element: res.data[i].information_element,
                type: res.data[i].predicted_relation,
            };
            relations.push(newrelationtype);
        }
        console.log("newrelations = ", relations);

        //dispatch({ type: ADD_STAKEHOLDER_INFORMATION_ELEMENT_RELATION, payload: relations });
        return relations;

    } catch (error) {
        console.error("Error generating information elements: ", error);
        return []; // Return an empty array in case of error
    }
};
*/
export const relation_type = async (information_elements, stakeholders) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
  
    try {
      const url = environmentML.apiEndpoint;
  
      const data = {
        stakeholder: stakeholders,
        ie: information_elements
      };
  
      const res = await axios.post(
        url + "relation_extraction/",
        JSON.stringify(data),
        config
      );
  
      let relations = [];
  
      for (let i = 0; i < res.data.length; i++) {
        const newrelationtype = {
          stakholder: res.data[i].stakeholder,
          info_element: res.data[i].information_element,
          type: res.data[i].predicted_relation,
        };
        relations.push(newrelationtype);
      }
  
      // Return the processed relations data
      return relations;
  
    } catch (error) {
      console.error("Error generating information elements:", error);
      return []; // Return an empty array in case of error
    }
  };
  


// Add relation
export const addStakeholderInformationElementRelation = formData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_RELATIONS });
        const s = formData.s;
        delete formData.s;
        const url = environment.apiEndpoint;
        const res = await axios.post(
            url + `stakeholder-information-relationships/`,
            formData,
            config
        );
        dispatch({
            type: ADD_STAKEHOLDER_INFORMATION_ELEMENT_RELATION,
            payload: res.data
        });
        /*
        if (s) {
            document
                .getElementById(
                    "card-relation-" +
                        formData.type +
                        "-" +
                        res.data.information_element
                )
                .classList.add("card-highlight");
        } else {
            document
                .getElementById(
                    "card-relation-" +
                        formData.type +
                        "-" +
                        res.data.stakeholder
                )
                .classList.add("card-highlight");
        }*/
        const elementId = s ?
            "card-relation-" + formData.type + "-" + res.data.information_element :
            "card-relation-" + formData.type + "-" + res.data.stakeholder;
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add("card-highlight");
        } else {
            console.warn("Element with ID '" + elementId + "' not found in the DOM.");
        }
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_RELATIONS });
        console.error("Server responded with status code:", error.response.status);
        console.error("Error response data:", error.response.data);
        console.error("Error message:", error.response.data.type[0]);
        console.error(
            "Error adding stakeholder information element relation: ",
            error
        );
    }
};

// Remove relation from the backend
export const removeStakeholderInformationElementRelation = id => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_RELATIONS });
        const url = environment.apiEndpoint;
        const res = await axios.delete(
            url + `stakeholder-information-relationships/${id}/`,
            config
        );
        dispatch({
            type: REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION,
            payload: { id }
        });
        console.log("relation removed successfully")
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_RELATIONS });
        console.error(
            "Error removing stakeholder information element relation: ",
            error
        );
    }
};

// Remove relation from state
export const removeStakeholderInformationElementRelationFromRedux = (
    type,
    id
) => async dispatch => {
    dispatch({
        type: REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION_FROM_REDUX,
        payload: { type, id }
    });
};
