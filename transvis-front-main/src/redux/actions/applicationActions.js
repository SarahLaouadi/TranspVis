import axios from "axios";

import {
    GET_APPLICATIONS,
    GET_APPLICATION,
    SET_APPLICATION,
    SET_FOCUSED,
    REMOVE_FOCUSED,
    TOGGLE_LOADING_APPLICATION,
    CREATE_APPLICATION,
    UPDATE_APPLICATION,
    DELETE_APPLICATION,
    ADD_STAKEHOLDER_INFORMATION_ELEMENT_RELATION
} from "../types";
import {addStakeholderInformationElementRelation, binary_relation} from "../../redux/actions/relationsActions"
import { environment } from "../../utils/environment";
//import { toggleModal } from "../actions/modalActions";
//import StakeholderInformationElementRelationshipForm from "../../components/forms/StakeholderInformationElementRelationshipForm/StakeholderInformationElementRelationshipForm";

// Get applications
export const getApplications = (params = {}) => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        const url = environment.apiEndpoint;
        const res = await axios.get(url + "applications/", {
            params: { ...params }
        });

        dispatch({
            type: GET_APPLICATIONS,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        console.error("Error get application: ", error);
    }
};

export const getApplication = appId => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        const url = environment.apiEndpoint;
        const res = await axios.get(
            url + `applications/${appId}/`, 
            config);
        dispatch({
            type: GET_APPLICATIONS,
            payload: res.data.transparency_note
        });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        console.error("Error get application: ", error);
    }
};


export const getApplicationdata = async (appId) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        const url = environment.apiEndpoint;
        const res = await axios.get(
            `${url}applications/${appId}/`, 
            config
        );
        return res.data; // Return the fetched data
    } catch (error) {
        console.error("Error getting application: ", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Create an application manually
export const createApplication = formData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        const url = environment.apiEndpoint;
        const res = await axios.post(url + "applications/", formData, config);
        console.log(res.data.id)
        dispatch({ type: CREATE_APPLICATION, payload: res.data });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        console.error("Error create application: ", error);
    }
};

// Create an application automatically
export const createApplicationML = applicationData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });

        // 1. Extract data for stakeholders, information elements, and relations
        const { application, stakeholders, informationElementslist, relations } = applicationData;
       
        
        // 2. Create the application entry in the database
        const applicationUrl = environment.apiEndpoint + "applications/";
        const createdApplicationResponse = await axios.post(applicationUrl, application, config);
        const createdApplication = createdApplicationResponse.data;

        // 3. Create stakeholders and information elements with the created application ID
        const createdStakeholders = await createEntitiesWithApplicationID(stakeholders, createdApplication.id, "stakeholders", config);
        const createdInformationElements = await createEntitiesWithApplicationID(informationElementslist, createdApplication.id, "information-elements", config);

        console.log("stttt ids:", createdStakeholders);

        // Access the IDs of the created stakeholders and information elements
        const stakeholderIDs = createdStakeholders.length > 0 ? createdStakeholders.map(stakeholder => stakeholder.id) : [];
        const informationElementIDs = createdInformationElements.length > 0 ? createdInformationElements.map(informationElement => informationElement.id) : [];


        // Log the entities to ensure they are correctly passed as an array
        console.log("st ids:", stakeholderIDs);
        console.log("ie ids:", informationElementIDs);

        
        for (let i = 0; i < stakeholderIDs.length; i++) {
            for (let j = 0; j < informationElementIDs.length; j++) {
            try {
                // Find the stakeholder by ID
                const desiredStakeholder = createdStakeholders.find(
                    stakeholder => stakeholder.id === stakeholderIDs[i]
                );
                
                // Find the stakeholder by ID
                const desiredie = createdInformationElements.find(
                    informationElement => informationElement.id === informationElementIDs[j]
                );
               
                const  results =  await dispatch(binary_relation(desiredie, desiredStakeholder))
                
                if (results == 1){
                    await dispatch(  addStakeholderInformationElementRelation({
                        type: "undecided",
                        information_element: informationElementIDs[j],
                        stakeholder: stakeholderIDs[i],
                        s: false
                    }));}
                else{
                    console.log('relation not found:');
                }
                // Dispatch successful action if needed
            } catch (error) {
                console.error('Error occurred:', error);
                // Dispatch error action if needed
            }
          
        }
    }

           
        // 5. Display the application in the frontend
        console.log(createdApplication.id);
        dispatch({ type: CREATE_APPLICATION, payload: createdApplication });

    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        console.error("Error create application: ", error);
        console.error("Error response data:", error.response.data);
    }
};
/*
const createEntitiesWithApplicationID = async (entities, applicationID, endpoint, config) => {
    const entitiesUrl = environment.apiEndpoint + endpoint + "/";
    const createdEntities = [];

    for (const entity of entities) {
            // If the entity does not exist, include the application ID in the entity and create it
            const entityWithApplicationID = { ...entity, application: applicationID };
            const createdEntity = await axios.post(entitiesUrl, entityWithApplicationID, config);
            createdEntities.push(createdEntity.data); 
    }
    console.log("createdEntities:", createdEntities);
    return createdEntities;
};*/
const createEntitiesWithApplicationID = async (entities, applicationID, endpoint, config) => {
    const entitiesUrl = `${environment.apiEndpoint}${endpoint}/`;
    const createdEntities = [];

    // Log the entities to ensure they are correctly passed as an array
    //console.log("Entities to process:", entities);

    if (!Array.isArray(entities)) {
        console.error("The entities parameter is not an array:", entities);
        return createdEntities; // Return the empty array to avoid further errors
    }

    if (entities.length === 0) {
        createdEntities.push([]);
        // Optionally, handle the empty array case, e.g., by returning or logging a message
    } else {
        for (const entity of entities) {
            // If the entity does not exist, include the application ID in the entity and create it
            const entityWithApplicationID = { ...entity, application: applicationID };
            try {
                const response = await axios.post(entitiesUrl, entityWithApplicationID, config);
                createdEntities.push(response.data);
            } catch (error) {
                console.error("Error creating entity:", error);
                console.error("Error response data:", error.response.data);
                
                // Optionally, handle the error, e.g., by continuing with the next entity
            }
        }
    }
    

    return createdEntities;
};






// Update an application
export const updateApplication = appId => formData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        const url = environment.apiEndpoint;
        const res = await axios.patch(
            url + `applications/${appId}`,
            formData,
            config
        );
        dispatch({ type: UPDATE_APPLICATION, payload: res.data });
    } catch (error) {
        dispatch({ type: TOGGLE_LOADING_APPLICATION });
        console.error("Error updating application: ", error);
    }
};

// Delete an application
export const deleteApplication = appId => async dispatch => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
  
    try {
      dispatch({ type: TOGGLE_LOADING_APPLICATION });
      const url = environment.apiEndpoint;
      const res = await axios.delete(url + `applications/${appId}`, config);
  
      // Dispatch DELETE_APPLICATION action to update Redux state
      dispatch({ type: DELETE_APPLICATION, payload: { id: appId } });
    } catch (error) {
      dispatch({ type: TOGGLE_LOADING_APPLICATION });
      console.error("Error deleting application: ", error);
    }
  };
  

// Set application
export const setApplication = appId => async dispatch => {
    dispatch({
        type: SET_APPLICATION,
        payload: appId
    });
};

// Set focused
export const setFocused = element => async dispatch => {
    dispatch({
        type: SET_FOCUSED,
        payload: element
    });
};

// Remove focused
export const removeFocused = () => async dispatch => {
    dispatch({
        type: REMOVE_FOCUSED
    });
};
