import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";

import "./_informationelementform.scss";

import { toggleModal } from "../../../redux/actions/modalActions";
import { createInformationElement } from "../../../redux/actions/informationElementsActions";
import { getApplication, getApplications } from "../../../redux/actions/applicationActions";
import { generateInformationElement } from "../../../redux/actions/informationElementsActions";
import { generateInformationElementHuggingFace } from "../../../redux/actions/informationElementsActions";

const InformationElementForm = ({
    application,
    toggleModal,
    createInformationElement,
    getApplication,
    generateInformationElement,
    generateInformationElementHuggingFace
}) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("data");
    const [description, setDescription] = useState("");
    const [weight, setWeight] = useState(1);

// to get the transparency note : getApplication(application.id).data.transparency_note
    const handleSubmit = e => {
        e.preventDefault();
        generateInformationElement({
            application: application.id,
        });
        toggleModal();
    };

    const handleSubmitHuggingFace = e => {
        e.preventDefault();
        generateInformationElementHuggingFace({
            application: application.id,
        });
        toggleModal();
    };


    const handleSubmitMan = e => {
        e.preventDefault();
        createInformationElement({
            name,
            type,
            description,
            weight,
            application: application.id
        });
        toggleModal();
    };
    return (
        <div>
            <h3>Information elements</h3>
              {/*<form className="form-modal" onSubmit={handleSubmitHuggingFace}>
                <button type="submit" className="form-submit">
                    Generate Information Elements (BART)
                </button>
            </form>
            <p>                                                      </p>
            <form className="form-modal" onSubmit={handleSubmit}>
                <button type="submit" className="form-submit">
                    Generate Information Elements (LSTM)
                </button>
            </form>
    <p>                                                      </p>*/}
            <form className="form-modal" onSubmit={handleSubmitMan}>
                <div className="form-group">
                    <span className="form-label-req">Name*</span>
                    <input
                        type="text"
                        placeholder="ex. Personal Information"
                        className="form-control"
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                        }}
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <span className="form-label-req">Type*</span>
                    <select
                        value={type}
                        onChange={e => {
                            setType(e.target.value);
                        }}
                        className="form-control"
                    >
                        <option value="data">Data</option>
                        <option value="process">Process</option>
                        <option value="policy">Policy</option>
                    </select>
                </div>
                <div className="form-group">
                    <span className="form-label">Description</span>
                    <textarea
                        cols="30"
                        rows="4"
                        placeholder="Add a brief description about the Information element here..."
                        className="form-control"
                        value={description}
                        onChange={e => {
                            setDescription(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <span className="form-label">Weight</span>
                    <input
                        type="number"
                        step="0.0001"
                        min="0"
                        max="1"
                        //value="1"
                        className="form-control"
                        // value={weight}
                        onChange={e => {
                            setWeight(e.target.value);
                        }}
                    />
                </div>
                <button type="submit" className="form-submit">
                    Add Information Element
                </button>
            </form>
        </div>
    );
};

const mapSateToProps = state => ({
    application: state.application.application
});

export default connect(mapSateToProps, {
    toggleModal,
    createInformationElement,
    getApplication,
    generateInformationElement, 
    generateInformationElementHuggingFace
})(InformationElementForm);
