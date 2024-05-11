import React, { useState } from "react";
import { connect } from "react-redux";

import StakeholderForm3 from "./form2";
import StakeholderForm from "../../forms/StakeholderForm";
import { toggleModal } from "../../../redux/actions/modalActions";
const StakeholderForm2 = ({ toggleModal }) => {
    const [activeForm, setActiveForm] = useState('form2');

    
    
    const handleClick1 = e => {
        e.preventDefault();
        setActiveForm('form1');
    };

    const handleClick2 = e => {
        e.preventDefault();
        setActiveForm('form3');
    };
    return (
        <div> {/* Use a container element */}
        {activeForm === 'form1' && <StakeholderForm toggleModal={toggleModal} />} {/* Display Form1 */}
        {activeForm === 'form2' && (
            <form className="form-modal">
                <h3>New stakeholder</h3>
                <button type="submit" onClick={handleClick1} className="form-submit">
                    Manual
                </button>
                <button type="submit" onClick={handleClick2} className="form-submit">
                    Use NER model
                </button>
            </form>
        )}
        {activeForm === 'form3' && <StakeholderForm3 toggleModal={toggleModal} />}
    </div>
    );
};

const mapSateToProps = state => ({
    application: state.application.application
});

export default connect(mapSateToProps, { toggleModal })(
    StakeholderForm2
);
