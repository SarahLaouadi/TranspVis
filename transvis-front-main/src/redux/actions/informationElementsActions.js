import axios from "axios";

import {
    GET_INFORMATION_ELEMENTS,
    TOGGLE_LOADING_INFORMATION_ELEMENTS,
    CREATE_INFORMATION_ELEMENT,
    GENERATE_INFORMATION_ELEMENT,
    UPDATE_INFORMATION_ELEMENT,
    DELETE_INFORMATION_ELEMENT,
    TOGGLE_LOADING_APPLICATION,
    ADD_INFORMATION_ELEMENT_ASSOCIATION,
    SET_FOCUSED,
    GET_APPLICATIONS,
    REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION_FROM_REDUX,
    REMOVE_FOCUSED,
    REMOVE_INFORMATION_ELEMENT_ASSOCIATION
} from "../types";

import { environment } from "../../utils/environment";
import { environmentML } from "../../utils/environmentML";

// Get information elements
export const getInformationElements = (params = {}) => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        const url = environment.apiEndpoint;
        const res = await axios.get(url + "information-elements/", {
            params: { ...params }
        });

        dispatch({
            type: GET_INFORMATION_ELEMENTS,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        console.error("Error get information elements: ", error);
    }
};


export const getInfoById = async (appId) => {
    try {
        const url = environment.apiEndpoint;
        const res = await axios.get(url + "information-elements/", {
            params: { appId: appId }
        });

        const filteredInfoelemenets = res.data.filter(IE => IE.application === appId);

        return filteredInfoelemenets;
    } catch (error) {
        console.error("Error get ie: ", error);
        throw error;
    }
};

export const generateInformationElement = transparencyNote => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const url2 = environmentML.apiEndpoint;

        const transparency_note = transparencyNote;
        console.log("transparency_note : ", transparency_note);
        console.log('Response data:', url2);
        const res = await axios.post(
            url2 + "predictModelFull/",
            JSON.stringify(transparency_note),
            config
        );

        console.log("res.data = ", res.data);

        let informationElements = [];
        const entityNames = res.data.map(item => item.summary);
        console.log("entityNames = ", entityNames);
        
        for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            let tfidf = calculateTFIDF(entityNames, element.summary);
            if ((entityNames.includes(element.summary)) && (tfidf === 0)) {
                tfidf = 1
             }
            const newIE = {
                name: element.summary,
                description: "Description of DataElement",
                type: element.label,
                weight: tfidf.toFixed(4),
                modell: "LSTM",
            };
            informationElements.push(newIE);
        }
        console.log("newIE = ", informationElements);

        dispatch({ type: CREATE_INFORMATION_ELEMENT, payload: informationElements });
        return informationElements;

    } catch (error) {
        console.error("Error generating information elements: ", error);
        return []; // Return an empty array in case of error
    }
};


export const generateInformationElementchoose = async (transparencyNote, model) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const url2 = environmentML.apiEndpoint;

        const transparency_note = transparencyNote;
        console.log("transparency_note : ", transparency_note);
        console.log('Response data:', url2);
        const res = await axios.post(
            url2 + model + "/",
            JSON.stringify(transparency_note),
            config
        );

        console.log("res.data = ", res.data);

        let informationElements = [];
        const entityNames = res.data.map(item => item.summary);
        for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            let tfidf = calculateTFIDF(entityNames, element.summary);
            if ((entityNames.includes(element.summary)) && (tfidf === 0)) {
                tfidf = 1
             }
            const newIE = {
                name: element.summary,
                description: "Description of DataElement",
                type: element.label,
                weight: tfidf.toFixed(4),
                modell: model === "predictModelFull" ? "LSTM" :
                model === "predictHuggingFaceModel" ? "BART" :
                "Manual" 
            };
            informationElements.push(newIE);
        }
        console.log("newIE = ", informationElements);

        return informationElements;

    } catch (error) {
        console.error("Error generating information elements: ", error);
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

export const generateInformationElementHuggingFace = appId => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    
    let newIE = {
        application: appId.application,
        name: "personal information",
        type: "data",
    };
    try {
        console.log(appId.application)
        // dispatch({ type: TOGGLE_LOADING_APPLICATION });
        const url = environment.apiEndpoint;
        const res3 = await axios.get(
            url + `applications/${appId.application}/`, 
            config);
        dispatch({type: GET_APPLICATIONS, payload: res3.data.transparency_note});
        console.log("transparency_note : ", res3.data.transparency_note)
        const transparency_note = res3.data.transparency_note
        // console.log("transparency_note : ", transparency_note)
        const url2 = environmentML.apiEndpoint;
        const res = await axios.post(
            url2 + "predictHuggingFaceModel",
            JSON.stringify(transparency_note),
            config
        );
        console.log("res.data = ", res.data)

        // dispatch({ type: GENERATE_INFORMATION_ELEMENT, payload: res.data });
        for (var i=0; i<res.data.length; i++){
            newIE.name = res.data[i].summary
            newIE.type = res.data[i].label
            console.log(newIE)
            // dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
            const url = environment.apiEndpoint;
            const res2 = await axios.post(
                url + "information-elements/",
                newIE,
            // config
        );
        dispatch({ type: CREATE_INFORMATION_ELEMENT, payload: res2.data });
        }

    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        console.error("Error generate information element: ", error);
    }
};


// Create an information element
export const createInformationElement = formData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        console.log(formData)
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        const url = environment.apiEndpoint;
        const res = await axios.post(
            url + "information-elements/",
            formData,
            config
        );
        dispatch({ type: CREATE_INFORMATION_ELEMENT, payload: res.data });
        document
            .getElementById("card-" + res.data.id)
            .classList.add("card-highlight");
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        console.error("Error create information element: ", error);
    }
};

// Update a stakeholder
export const updateInformationElement = (id, formData) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        const url = environment.apiEndpoint;
        const res = await axios.patch(
            url + `information-elements/${id}/`,
            formData,
            config
        );
        dispatch({
            type: SET_FOCUSED,
            payload: res.data
        });
        dispatch({ type: UPDATE_INFORMATION_ELEMENT, payload: res.data });
        document
            .getElementById("card-" + res.data.id)
            .classList.add("card-highlight");
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        console.error("Error updating information element: ", error);
    }
};

// Delete a stakeholder
export const deleteInformationElement = id => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        dispatch({ type: REMOVE_FOCUSED });
        dispatch({
            type: REMOVE_STAKEHOLDER_INFORMATION_ELEMENT_RELATION_FROM_REDUX,
            payload: { type: "i", id }
        });
        const url = environment.apiEndpoint;
        const res = await axios.delete(url + `information-elements/${id}/`);
        dispatch({ type: DELETE_INFORMATION_ELEMENT, payload: { id } });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        console.error("Error deleting information element: ", error);
    }
};

// Add information element association
export const addInformationElementAssociation = (
    source,
    target
) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        const url = environment.apiEndpoint;
        const res = await axios.post(
            url + `information-element-associations/`,
            { source, target },
            config
        );
        dispatch({
            type: ADD_INFORMATION_ELEMENT_ASSOCIATION,
            payload: res.data
        });
        document
            .getElementById("card-association-" + res.data.target)
            .classList.add("card-highlight");
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        console.error("Error adding information element association: ", error);
    }
};

// Remove information element association
export const removeInformationElementAssociation = (
    source,
    target
) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        console.log(source, target);
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        const url = environment.apiEndpoint;
        const formData = { data: { source: +source, target: +target } };
        const res = await axios.delete(
            url + `information-element-associations/`,
            formData,
            config
        );
        dispatch({
            type: REMOVE_INFORMATION_ELEMENT_ASSOCIATION,
            payload: { source, target }
        });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_INFORMATION_ELEMENTS });
        console.error("Error removing information element ass: ", error);
    }
};
