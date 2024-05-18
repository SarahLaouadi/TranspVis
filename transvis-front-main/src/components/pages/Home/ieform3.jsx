import React, { useState } from "react";
import { connect } from "react-redux";



import { toggleModal, toggleModal3 } from "../../../redux/actions/modalActions";
import { updateInformationElement, createInformationElement } from "../../../redux/actions/informationElementsActions";
const InfoForm4 = ({ application, applicationData, informationelement, namelist1,updateInformationElement,  informationelements, toggleModal, toggleModal3, createInformationElement }) => {
     // State to keep track of selected stakeholders
     const [selectedie, setSelectedie] = useState([]);
     

     // Function to toggle the selection of a stakeholder
     const toggleIESelection = (informatione) => {
         if (selectedie.includes(informatione)) {
             // Remove the stakeholder if already selected
             setSelectedie(selectedie.filter(item => item !== informatione));
         } else {
             // Add the stakeholder if not selected
             setSelectedie([...selectedie, informatione]);
         }
     };

     

    /*const isStakeholderDisabled =  (namelist1, stakeholder) => {
            console.log("Name List1:", namelist1);
            const names = namelist1.map(stakeholder => stakeholder.name);
            return names.includes(stakeholder);   
    };*/
    const isIEDisabled = (namelist1, informatione) => {
        const foundIE = namelist1.find(item => item.name === informatione.name);
        if (foundIE) {
            if (foundIE.weight === informatione.weight) {
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
        
        
        selectedie.forEach(IE1 => {
            let desiredIE
            desiredIE = informationelements.find(
                IE => IE.name === IE1
            );
            const doesNotExistByName = namelist1.every(IE => IE.name !== desiredIE.name);

            // Check if desiredStakeholder exists in namelist1 with a different weight
            const existsWithDifferentWeight = namelist1.some(IE => 
                IE.name === desiredIE.name && 
                IE.weight !== desiredIE.weight
            );

            
            let desiredieid = informationelement.find(
                IE => IE.name === desiredIE.name
            );
            
            
            console.log("desiredSie check:", existsWithDifferentWeight);

            if (existsWithDifferentWeight){
                // Access the IDs of the created stakeholders  
                console.log("desiredie id:", desiredieid.id);
                console.log("desiredie w:", desiredIE.weight);
                console.log("desiredie m:", desiredIE.modell);
                updateInformationElement(desiredieid.id, { weight: desiredIE.weight, modell: desiredIE.modell });

            } else if (doesNotExistByName) {
                createInformationElement({
                    name : desiredIE.name,
                    description: desiredIE.description,
                    type: desiredIE.type,
                    weight : desiredIE.weight,
                    application: application.id,
                    modell: desiredIE.modell
                });
            }

            
        })
        
        //console.log("IE after 2 ", stakeholders )
        toggleModal();
    };
    
    
    return (
        
        <form className="form-modal" onSubmit={handleSubmit}>
        <h3>Model's results</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <div className="form-group">
            <span className="form-label-req">Information elements:</span>
            {informationelements.map((IE, index) => {
                const { disabled, color } = isIEDisabled(namelist1, IE);
                return (
                    <div key={index}>
                        <input
                            type="checkbox"
                            value={IE.name}
                            checked={selectedie.includes(IE.name)}
                            onChange={() => toggleIESelection(IE.name)}
                            disabled={disabled}
                            style={{ filter: disabled ? 'grayscale(100%)' : '', opacity: disabled ? '0.5' : '', color: color }}
                        />
                        <label
                            htmlFor={IE.name}
                            style={{ filter: disabled ? 'grayscale(100%)' : '', opacity: disabled ? '0.5' : '', color: color }}
                        >
                            {`${IE.name} - ${IE.weight}`}
                        </label>
                    </div>
                );
            })}
            <p>Selected IE: {selectedie.join(', ')}</p>
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
    informationelement: state.informationElement.informationElements,
});

export default connect(mapSateToProps, { toggleModal, toggleModal3, createInformationElement, updateInformationElement })(
    InfoForm4
);
