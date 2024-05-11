import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import "./_splash.scss";
import logo from "../../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../../layouts/Header";
import { toggleModal } from "../../../redux/actions/modalActions";
import {
    setApplication,
    getApplications
} from "../../../redux/actions/applicationActions";
import { deleteApplication } from "../../../redux/actions/applicationActions";
import { getStakeholders } from "../../../redux/actions/stakeholderActions";
import { getInformationElements } from "../../../redux/actions/informationElementsActions";
import { getRelationships } from "../../../redux/actions/relationsActions";
import ApplicationForm from "../../forms/ApplicationForm";
import Modal from "../../layouts/Modal";

const Splash = ({
    applications,
    toggleModal,
    setApplication,
    getApplications,
	deleteApplication,
    getStakeholders,
    getInformationElements,
    getRelationships
}) => {
    const history = useHistory();
	const [showDeleteButton, setShowDeleteButton] = useState(false);
	const [showDetailsButton, setShowDetailsButton] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
	const dispatch = useDispatch();

    useEffect(() => {
        getApplications();
    }, []);

    const handleMenuClick = e => {
        toggleModal();
    };

    const handleAppClick = (e, app) => {
        e.preventDefault();
        setApplication(app);
        getStakeholders({ application: app });
        getInformationElements({ application: app });
        getRelationships({ stakeholder__application: app }).then(() => {
            history.push("/");
        });
    };
	
	 const handleAppDelete = async (e, app) => {
        e.preventDefault();
		 // Confirm deletion with the user
		if (window.confirm(`Are you sure you want to delete the application definitely?`)) {
			deleteApplication(selectedAppId);
		}
    };
	

	
	 const handleDeleteButtonClick = (e, app) => {
		 e.preventDefault();
        handleAppDelete(e, app)
        console.log("Delete button clicked for app with id:", selectedAppId);
    };
	
	const handleShowDetailsButtonClick = (e, app) => {
		e.preventDefault();
        handleAppClick(e, app);
		console.log("Show Details button clicked for app with id:", selectedAppId);
	};

    return (
        <>
            <Modal>
                <ApplicationForm />
            </Modal>

            <Header></Header>
            <div className="splash">
                <div className="splash__container">
                    <h2>Please choose an application to start</h2>
                    <div className="splash__app_list">
                        <div
                            className="splash__app"
                            title="Add new application"
                            onClick={e => {
                                handleMenuClick(e);
                            }}
                        >
                            <p>
                                <FontAwesomeIcon icon={faPlus} size="lg" />
                            </p>
                        </div>
                        {applications?.map(app => (
                            <div
                                className="splash__app"
                                title={app.name}
                                
								onMouseEnter={() => {
									setShowDeleteButton(true);
									setShowDetailsButton(true);
									setSelectedAppId(app.id);
								}}
								onMouseLeave={() => {
									setShowDeleteButton(false);
									 setShowDetailsButton(false);
									setSelectedAppId(null);
								}}
                                key={app.id}
                            >
                                <h4>{app.name}</h4>
								{showDeleteButton && selectedAppId === app.id && (
								  <div className="button-container">
									<button
									  className="action-button delete-button"
									  onClick={e => handleDeleteButtonClick(e, app.id)}
									>
									  Delete
									</button>
									<button
									  className="action-button details-button"
									  style={{ marginLeft: 10 }} // Adjust gap as needed
									  onClick={e => handleShowDetailsButtonClick(e, app.id)}
									>
									  Details
									</button>
								  </div>
								)}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const mapSateToProps = state => ({
    applications: state.application.applications
});

export default connect(mapSateToProps, {
    toggleModal,
    setApplication,
    getApplications,
	deleteApplication,
    getStakeholders,
    getInformationElements,
    getRelationships
})(Splash);



