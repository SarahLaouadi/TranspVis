import React, { useState } from "react";
import { connect } from "react-redux";
import { createStakeholder } from "../../../redux/actions/stakeholderActions";


import { toggleModal, toggleModal3 } from "../../../redux/actions/modalActions";
import { updateStakeholder } from "../../../redux/actions/stakeholderActions";
const StakeholderForm4 = ({ application, applicationData, stakeholderst, namelist1,updateStakeholder,  stakeholders, toggleModal, toggleModal3, createStakeholder }) => {
     // State to keep track of selected stakeholders
     const [selectedStakeholders, setSelectedStakeholders] = useState([]);
     

     // Function to toggle the selection of a stakeholder
     const toggleStakeholderSelection = (stakeholder) => {
         if (selectedStakeholders.includes(stakeholder)) {
             // Remove the stakeholder if already selected
             setSelectedStakeholders(selectedStakeholders.filter(item => item !== stakeholder));
         } else {
             // Add the stakeholder if not selected
             setSelectedStakeholders([...selectedStakeholders, stakeholder]);
         }
     };

     

    /*const isStakeholderDisabled =  (namelist1, stakeholder) => {
            console.log("Name List1:", namelist1);
            const names = namelist1.map(stakeholder => stakeholder.name);
            return names.includes(stakeholder);   
    };*/
    const isStakeholderDisabled = (namelist1, stakeholder) => {
        const foundStakeholder = namelist1.find(item => item.name === stakeholder.name);
        if (foundStakeholder) {
            if (foundStakeholder.weight === stakeholder.weight) {
                return { disabled: true, color: 'gray' }; // Case 1: Same stakeholder and weight
            } else {
                return { disabled: false, color: 'green' }; // Case 2: Same stakeholder but different weight
            }
        } else {
            return { disabled: false, color: 'red' }; // Case 3: Stakeholder not found
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        
        
        selectedStakeholders.forEach(stakeholder1 => {
            let desiredStakeholder
            desiredStakeholder = stakeholders.find(
                stakeholder => stakeholder.name === stakeholder1
            );
            const doesNotExistByName = namelist1.every(stakeholder => stakeholder.name !== desiredStakeholder.name);

            // Check if desiredStakeholder exists in namelist1 with a different weight
            const existsWithDifferentWeight = namelist1.some(stakeholder => 
                stakeholder.name === desiredStakeholder.name && 
                stakeholder.weight !== desiredStakeholder.weight
            );

            
            let desiredStakeholderid = stakeholderst.find(
                stakeholder => stakeholder.name === desiredStakeholder.name
            );
            
            
            console.log("desiredStakeholder check:", existsWithDifferentWeight);

            if (existsWithDifferentWeight){
                // Access the IDs of the created stakeholders  
                console.log("desiredStakeholder id:", desiredStakeholderid.id);
                console.log("desiredStakeholder w:", desiredStakeholder.weight);
                console.log("desiredStakeholder m:", desiredStakeholder.modell);
                updateStakeholder(desiredStakeholderid.id, { weight: desiredStakeholder.weight, modell: desiredStakeholder.modell });

            } else if (doesNotExistByName) {
                createStakeholder({
                    name : desiredStakeholder.name,
                    description: desiredStakeholder.description,
                    weight : desiredStakeholder.weight,
                    application: application.id,
                    modell: desiredStakeholder.modell
                });
            }

            
        })
        
        console.log("stakeholders after 2 ", stakeholders )
        toggleModal();
    };
    
    
    return (
        
        <form className="form-modal" onSubmit={handleSubmit}>
        <h3>Model's results</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <div className="form-group">
            <span className="form-label-req">Stakeholders:</span>
            {stakeholders.map((stakeholder, index) => {
                const { disabled, color } = isStakeholderDisabled(namelist1, stakeholder);
                return (
                    <div key={index}>
                        <input
                            type="checkbox"
                            value={stakeholder.name}
                            checked={selectedStakeholders.includes(stakeholder.name)}
                            onChange={() => toggleStakeholderSelection(stakeholder.name)}
                            disabled={disabled}
                            style={{ filter: disabled ? 'grayscale(100%)' : '', opacity: disabled ? '0.5' : '', color: color }}
                        />
                        <label
                            htmlFor={stakeholder.name}
                            style={{ filter: disabled ? 'grayscale(100%)' : '', opacity: disabled ? '0.5' : '', color: color }}
                        >
                            {`${stakeholder.name} - ${stakeholder.weight}`}
                        </label>
                    </div>
                );
            })}
            <p>Selected Stakeholders: {selectedStakeholders.join(', ')}</p>
        </div>
        </div>
        <button type="submit" className="form-submit">
            Add
        </button>
    </form>
    );
};

const mapSateToProps = state => ({
    application: state.application.application,
    applicationData: state.application.applicationData, 
    stakeholderst: state.stakeholder.stakeholders
});

export default connect(mapSateToProps, { toggleModal, toggleModal3, createStakeholder, updateStakeholder })(
    StakeholderForm4
);
