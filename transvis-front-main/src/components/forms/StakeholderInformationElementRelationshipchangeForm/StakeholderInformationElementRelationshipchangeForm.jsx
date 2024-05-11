import React, { useState , useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux'; // Import useDispatch hook

import "./_stakeholderinformationelementrelationshipchangeform.scss";
import HighlightedText from "./vis";
import { toggleModal,toggleModal2 } from "../../../redux/actions/modalActions";
import { addStakeholderInformationElementRelation, removeStakeholderInformationElementRelation, relation_type} from "../../../redux/actions/relationsActions";
const StakeholderInformationElementRelationshipchangeForm = ({
    focused,
    id,
    ine,
    relation,
    informationElements,
    stakeholders,
    toggleModal,
    application,
    toggleModal2,
    addStakeholderInformationElementRelation,
    removeStakeholderInformationElementRelation
}) => {
    const [ie, setIe] = useState(informationElements[0]?.id);
    const [stakeholder, setStakeholder] = useState(stakeholders[0]?.id);
    const [ietype,setietype] = useState("");
    const [relationtype,setrelationtype] = useState("");
    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        return () => {
            // Cleanup function to set isMounted to false when the component unmounts
            setIsMounted(false);
        };
    }, []);
    



    const renderTitle = type => {
        if (type === "s") {
            switch (relation) {
                case "production":
                    return "Add new providing stakeholder";
                case "obligatory":
                    return "add new recieving stakeholder";
                case "optional":
                    return "Add new requesting stakeholder";
                case "restricted":
                    return "Add new restricted stakeholder";
                default:
                    break;
            }
        } else {
            switch (relation) {
                case "production":
                    return "Add new produced Information element";
                case "obligatory":
                    return "Add new obligatory relationship";
                case "optional":
                    return "Add new optional relationship";
                case "restricted":
                    return "Add new restricted relationship";
                case "undecided":
                    return "Add new undecided relationship";
                default:
                    break;
            }
        }
    };

    const handleclick = async e => {
        e.preventDefault();
        setIe(ine)
        if (focused?.label.includes("S")) {
            try {
                setIsLoading(true);
                const results =  await relation_type(ie, focused.id)
                console.log("results before----------------", results);
                
                if (isMounted) {
                    setrelationtype(results[0].type); 
                }
                console.log("results after----------------", results[0].type);
            } catch (error) {
                console.error("Error fetching relation type:", error);
                setrelationtype("no prediction"); // Return an empty string or handle the error as needed
            }
            finally {
            setIsLoading(false);
          }
            
        } else {
            try {
                
            } catch (error) {
            }
        }

    };
    
  
    const handleSubmit = async e => {
        e.preventDefault();
        setIe(ine)
        await removeStakeholderInformationElementRelation(id)

         // Introduce a waiting period of 1 second
         //await new Promise(resolve => setTimeout(resolve, 1000));
         
         
        console.log("type == ", ietype)
        if (focused?.label.includes("S")) {
            await  addStakeholderInformationElementRelation({
                type: ietype,
                information_element: ie,
                stakeholder: focused.id,
                s: true
            });

            
        } else {
            await  removeStakeholderInformationElementRelation(id)
            await  addStakeholderInformationElementRelation({
                type: ietype,
                information_element: focused.id,
                stakeholder: stakeholder,
                s: false
            });
        }

        toggleModal2();
    };
    /*onClick={handleclick}*/
    return (
        <form className="form-modal" onSubmit={handleSubmit}>
            {focused?.label.includes("S") ? (
                <>
                    <h3>Change Information Element Type </h3>
                    <div className="card"  onClick={handleclick} style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#C5C6C7' }}>
                    {isLoading && (
                        <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">Loading...</div>
                        </div>
                        )}
                    <span className="form-tip" style={{ marginBottom: '20px', color: 'black', fontSize: '14px' }}>
                            The Stakeholder - Information element relationship model
                            predicted the relation type as follow:  <b style={{ color: 'red', fontSize: '18px' }}>{relationtype}</b>,{" "}
                        </span>
                        </div>
                        <div className="card"  style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#C5C6C7'}}>
                           {/* Display HighlightedText component */}
                           <HighlightedText />
                        </div>
                        
                    <div className="form-group">
                        <span className="form-label-req">
                            Information element type*
                        </span>
                        <select
                            value={ietype}
                            onChange={e => {
                                setietype(e.target.value);
                            }}
                            className="form-control"
                        >
                            <option value="undecided">Choose</option>
                            <option value="production">Production</option>
                            <option value="optional">Optional</option>
                            <option value="obligatory">Obligatory</option>
                            <option value="restricted">Restricted</option>
                            
                        </select>
                    </div>
                </>
            ) : (
<></>
            )}
            <button type="submit" className="form-submit">
                Update
            </button>
        </form>
    );
};

const mapStateToProps = state => ({

    focused: state.application.focused,
    relation: state.modal.relation,
    id: state.modal.id,
    ine: state.modal.ine,
    informationElements: state.informationElement.informationElements,
    stakeholders: state.stakeholder.stakeholders,
    application: state.application.application,
});

export default connect(mapStateToProps, {
    toggleModal,
    toggleModal2,
    addStakeholderInformationElementRelation,
    removeStakeholderInformationElementRelation
})(StakeholderInformationElementRelationshipchangeForm);
