
import React, { useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import "./_applicationform.scss";
import { toggleModal, toggleModal3 } from "../../../redux/actions/modalActions";
import { createApplication, createApplicationML } from "../../../redux/actions/applicationActions";
// import { generateInformationElement } from "../../../redux/actions/informationElementsActions";
import { createInformationElement } from "../../../redux/actions/informationElementsActions";
import { generateInformationElement } from "../../../redux/actions/informationElementsActions";
//import { GENERATE_STAKEHOLDER } from "../../../redux/types";
import { generateStakeholder } from "../../../redux/actions/stakeholderActions";

const ApplicationForm = ({ user, toggleModal, createApplication, createApplicationML,generateInformationElement,generateStakeholder, application }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [transparencyNote, settransparencyNote] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  //const [type, setType] = useState("data");
  //const [weight, setWeight] = useState(1);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  

  const handleSubmit = e => {
    e.preventDefault();
    
    createApplication({
      name,
      description,
      transparency_note: transparencyNote,
      user: user?.id
    });

    toggleModal();
  };

  const handleSubmitML = async (e) => {

    e.preventDefault();
    setIsLoading(true);
// Example data for stakeholders
      //const text = "send your information to those with whom you choose to communicate you share your information including messages as you use and communicate through our services";
      try {
      let stakeholders = []
      await generateStakeholder(transparencyNote)
        .then(stakeholderslist => {
          // Use the information elements here
          stakeholders = stakeholderslist;
          console.log("Information elements:", stakeholderslist);
        })
        .catch(error => {
          // Handle errors here
          console.error("Error:", error);
        });    
            
      let informationElementslist = [];
      // Call the generateInformationElement function
      await generateInformationElement(transparencyNote)
        .then(informationElements => {
          // Use the information elements here
          informationElementslist = informationElements;
          console.log("Information elements:", informationElements);
        })
        .catch(error => {
          // Handle errors here
          console.error("Error:", error);
        });
     
     
      const relations = [
        { stakeholder: 1, information_element: 1, type: "production" },
        { stakeholder: 2, information_element: 2, type: "obligatory" },
        // ... more relations
      ]

      // Example data for the application
      const applicationData = {
        application: {
          name,
          description,
          transparency_note: transparencyNote,
          user: user?.id,
      },  user: user?.id,
        stakeholders,
        informationElementslist,
        relations
      };

      dispatch(toggleModal3(applicationData));

      console.log("Apps data:", applicationData);
      try {
        // Dispatch the createApplicationML action with the applicationData
          createApplicationML(applicationData);
        } catch (error) {
          // Handle errors if needed
          console.error('Error creating application: ', error);
        }
        // Close the modal or perform any additional actions as needed
        toggleModal();
      } catch (error) {
        console.error('Error creating application: ', error);
      } finally {
        setIsLoading(false);
      }
};
  return (
    <div className="flip-card">
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
      {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        )}
        <form className="form-modal" onSubmit={isFlipped ? handleSubmitML : handleSubmit}>
          {/* Front side of the card */}
          <h3>New Application</h3>
          <div className="form-group">
                <span className="form-label-req">Name*</span>
                <input
                    type="text"
                    placeholder="ex. Amazon Web Services (AWS)"
                    className="form-control"
                    value={name}
                    onChange={e => {
                        setName(e.target.value);
                    }}
                    required
                />
            </div>
            <div className="form-group">
                <span className="form-label">Description</span>
                <textarea
                    cols="30"
                    rows="4"
                    placeholder="Add a brief description about the application here..."
                    value={description}
                    onChange={e => {
                        setDescription(e.target.value);
                    }}
                    className="form-control"
                />
            </div>
            {isFlipped && (
          <div className="form-group">
            <span className="form-label">Application's terms*</span>
            <textarea
              cols="30"
              rows="4"
              placeholder="Paste the application's terms and conditions here..."
              value={transparencyNote}
              
              onChange={e => {
                settransparencyNote(e.target.value);
            }}
              
              className="form-control"
              required
            />
          </div>
        )}
        {isLoading && <div className="loading-indicator">Loading...</div>}
            <input type="submit" className="form-submit" value={isFlipped ? "Create Automatically" : "Create manually"}/>
        </form>
         <a className="flip-card-toggle" onClick={handleFlip} aria-label="Flip card">
        {isFlipped ? "Create the application manually" : "Create the Application Using ML"}
      </a>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { toggleModal, createApplication, createApplicationML, generateInformationElement,generateStakeholder, createInformationElement })(
  ApplicationForm
);
