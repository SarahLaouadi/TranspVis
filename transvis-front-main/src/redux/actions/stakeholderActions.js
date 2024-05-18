import axios from "axios";

import {
    GET_STAKEHOLDERS,
    TOGGLE_LOADING_STAKEHOLDERS,
    CREATE_STAKEHOLDER,
    GENERATE_STAKEHOLDER,
    UPDATE_STAKEHOLDER,
    DELETE_STAKEHOLDER,
    SET_FOCUSED,
    REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION_FROM_REDUX,
    REMOVE_FOCUSED
} from "../types";
import { environment } from "../../utils/environment";
import { environmentML } from "../../utils/environmentML";


// Get stakeholders
export const getStakeholders = (params = {}) => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        const url = environment.apiEndpoint;
        const res = await axios.get(url + "stakeholders/", {
            params: { ...params }
        });

        dispatch({
            type: GET_STAKEHOLDERS,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        console.error("Error get stakeholders: ", error);
    }
};

export const getStakeholdersById = async (appId) => {
    try {
        const url = environment.apiEndpoint;
        const res = await axios.get(url + "stakeholders/", {
            params: { appId: appId }
        });

        const filteredStakeholders = res.data.filter(stakeholder => stakeholder.application === appId);

        return filteredStakeholders;
    } catch (error) {
        console.error("Error get stakeholders: ", error);
        throw error;
    }
};




export const generateStakeholderChooseModel = async (transparencyNote, model) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        const url = environmentML.apiEndpoint;
        const transparency_note = transparencyNote;
        console.log("transparency_note : ", transparency_note);
        console.log('Response data:', url);
        const response = await axios.post(
            url + model + "/", 
            JSON.stringify({ transparencyNote }),
            config
        );
        //const data = ["Customer","Customer","Customer","Customer","Company","Company","Company","Third parties"]

        console.log("res.data = ",response.data);
        let stakeholders = [];
        const entityNames = response.data.map(item => item.entity);
        
        
        

        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            // Check if the name already exists in stakeholders
            if (stakeholders.some(stakeholder => stakeholder.name === element.entity)) {
                continue; // Skip adding if it already exists
            }
            console.log(calculateTFIDF(entityNames,element.entity))
            let tfidf = calculateTFIDF(entityNames,element.entity)
            if ((entityNames.includes(element.entity)) && (tfidf === 0)) {
                tfidf = 1
             }
            const newST = {
                name: element.entity,
                description: "Description of Stakeholder",
                weight:  tfidf.toFixed(4),
                modell: model === "ner_extraction" ? "SpaCy" :
                model === "t_ner_extraction" ? "Transformer" :
                model === "x_ner_extraction" ? "XLNET" :
                model === "b_ner_extraction" ? "BERT" :
                "Manual" 
            };
            
            stakeholders.push(newST);
        }
        
        console.log("newst = ", stakeholders);

        //dispatch({ type: CREATE_STAKEHOLDER, payload: stakeholders });
        
        return stakeholders;

    } catch (error) {
        console.error("Error generating stakeholders: ", error);
        console.error("Error response data:", error.response.data);
        return []; // Return an empty array in case of error
    }
};

export const generateStakeholder = transparencyNote => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        const url = environmentML.apiEndpoint;
        const transparency_note = transparencyNote;
        console.log("transparency_note : ", transparency_note);
        console.log('Response data:', url);
        const response = await axios.post(
            url + "b_ner_extraction/", 
            JSON.stringify({ transparencyNote }),
            config
        );
        //const data = ["Customer","Customer","Customer","Customer","Company","Company","Company","Third parties"]

        console.log("res.data = ",response.data);
        let stakeholders = [];
        const entityNames = response.data.map(item => item.entity);
        
        
        

        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            // Check if the name already exists in stakeholders
            if (stakeholders.some(stakeholder => stakeholder.name === element.entity)) {
                continue; // Skip adding if it already exists
            }
            console.log(calculateTFIDF(entityNames,element.entity))
            let tfidf = calculateTFIDF(entityNames,element.entity)
            if ((entityNames.includes(element.entity)) && (tfidf === 0)) {
                tfidf = 1
             }
            const newST = {
                name: element.entity,
                description: "Description of Stakeholder",
                weight:  tfidf.toFixed(4),
                modell: "BERT"
            };
            
            stakeholders.push(newST);
        }
        
        console.log("newst = ", stakeholders);

        dispatch({ type: CREATE_STAKEHOLDER, payload: stakeholders });
        
        return stakeholders;

    } catch (error) {
        console.error("Error generating stakeholders: ", error);
        console.error("Error response data:", error.response.data);
        return []; // Return an empty array in case of error
    }
};

function calculateTFIDF(data, term) {
    // Term frequency (TF)
    const termFrequency = data.filter(word => word.toLowerCase() === term.toLowerCase()).length / data.length;
  
    // Document frequency (DF) in a hypothetical corpus (assuming all documents are present)
    const documentFrequency = 1; // Adjust this value if you have a larger corpus
  
    // Inverse document frequency (IDF) with smoothing (to avoid division by zero)
    const inverseDocumentFrequency = Math.log((data.length + 1) / (documentFrequency + 1)) / Math.log(2); // Add 1 to DF to prevent division by zero
  
    // Normalize TF-IDF for values between 0 and 1
    const maxIDF = Math.log(data.length + 1) / Math.log(2); // Maximum possible IDF for this corpus
    const normalizedIDF = inverseDocumentFrequency / maxIDF;
  
    // TF-IDF weight
    const tfidfWeight = termFrequency * normalizedIDF;
  
    return tfidfWeight;
  }
  /*
function countElements(arr, elementToCount) {
    // Create an empty object to store the counts of each element
    let counts = {};

    // Loop through the array
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        // If the element is already in the counts object, increment its count
        if (counts[element]) {
            counts[element]++;
        } else {
            // If the element is not in the counts object, initialize its count to 1
            counts[element] = 1;
        }
    }

    // Return the count of the specified element
    return counts[elementToCount] || 0;
}
*/


// Create a stakeholder
export const createStakeholder = formData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        const url = environment.apiEndpoint;
        const res = await axios.post(url + "stakeholders/", formData, config);
        dispatch({ type: CREATE_STAKEHOLDER, payload: res.data });
        document
            .getElementById("card-" + res.data.id)
            .classList.add("card-highlight");
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        console.error("Error create stakeholder: ", error);
    }
};

// Update a stakeholder
export const updateStakeholder = (id, formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        const url = environment.apiEndpoint;
        const res = await axios.patch(
            url + `stakeholders/${id}/`,
            formData,
            config
        );
        dispatch({
            type: SET_FOCUSED,
            payload: res.data
        });
        dispatch({ type: UPDATE_STAKEHOLDER, payload: res.data });
        document
            .getElementById("card-" + res.data.id)
            .classList.add("card-highlight");
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        console.error("Error updating stakeholder: ", error);
    }
};


export const updateStakeholder2 = (id, updatedFields) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        const url = environment.apiEndpoint;
        
        // Make PATCH request with updatedFields
        const res = await axios.patch(
            `${url}stakeholders/${id}/`,
            updatedFields, // Pass updatedFields directly to the PATCH request
            config
        );

        // Dispatch actions to update Redux state
        dispatch({
            type: SET_FOCUSED,
            payload: res.data
        });
        dispatch({
            type: UPDATE_STAKEHOLDER,
            payload: res.data
        });

        // Add CSS class to highlight the updated stakeholder card
        document.getElementById("card-" + res.data.id).classList.add("card-highlight");
        
    } catch (error) {
        // Handle errors
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        console.error("Error updating stakeholder: ", error);
    }
};

// Delete a stakeholder
export const deleteStakeholder = id => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        dispatch({ type: REMOVE_FOCUSED });
        const url = environment.apiEndpoint;
        const res = await axios.delete(url + `stakeholders/${id}/`);
        dispatch({ type: DELETE_STAKEHOLDER, payload: { id } });
        dispatch({
            type: REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION_FROM_REDUX,
            payload: { type: "s", id }
        });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_STAKEHOLDERS });
        console.error("Error create stakeholder: ", error);
    }
};
