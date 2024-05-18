import { React, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import Card from "../Card";
import Tag from "../Tag";
import "../Detail/_detail.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../../../utils/colors";
import { toggleModal, toggleModal2} from "../../../redux/actions/modalActions";
import { updateStakeholder } from "../../../redux/actions/stakeholderActions";


const Stakeholder = ({
    id,
    focused,
    stakeholder,
    stakeholders,
    informationElements,
    relationships,
    help,
    updateStakeholder,
    toggleModal, 
    toggleModal2
}) => {
    const afterRef = useRef(null);
    const [toggle, setToggle] = useState({
        production: false,
        obligatory: true,
        optional: false,
        restricted: false,
        undecided: false
    });
    const [isEditName, setIsEditName] = useState(false);
    const [isEditDescription, setIsEditDescription] = useState(false);
    const [isEditWeight, setIsEditWeight] = useState(false);
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");
    const [description, setDescription] = useState("");
    const [nameList, setNameList] = useState([]);
    const [applicationData, setApplicationData] = useState([]);
    const searchRelation = (id) => {
        return relationships.find(r => {
            return (
                (r.stakeholder === +focused.id &&
                    r.information_element === +id) ||
                (r.stakeholder === +id &&
                    r.information_element === +focused.id)
            );
        });
    };


    useEffect(() => {
        afterRef?.current?.setAttribute(
            "style",
            "--tooltip-type-color: #4A6FA5;"
        );
    }, []);

    useEffect(() => {
        setIsEditName(false);
        setIsEditDescription(false);
        setIsEditWeight(false);
    }, [stakeholder]);

    const handleToggle = toggleName => {
        setToggle({
            ...toggle,
            [toggleName]: !toggle[toggleName]
        });
    };

    const handleMenuClick = (e, type, relation) => {
        toggleModal(type, relation);
    };

    const handleMenuClickupdate = async (e, type, relations, id, ine) => {
        toggleModal2(type, relations, id, ine);
    };
    const handleDelete = (e, id) => {
        console.log("card id", id);
            if (id.includes("relation")) {
                // remove relation
                let relation = searchRelation();
                console.log("remove relation", relation?.id);
            } 
    };

    const getRelatedInformationElements = type => {
        return relationships
            .filter(r => {
                return r.stakeholder === stakeholder.id && r.type === type;
            })
            .map(r => {
                return r.information_element;
            })
            .map(ie => {
                return informationElements.find(ie_ => {
                    return ie_.id === ie;
                });
            })
            .sort((a, b) => {
                return a.label > b.label ? 1 : -1;
            });
    };

    const handleUpdate = (e, formData) => {
        e.preventDefault();
        setIsEditName(false);
        setIsEditDescription(false);
        setIsEditWeight(false);
        updateStakeholder(stakeholder.id, formData);
    };

    return (
        <div className="detail__card">
            <div className="detail__title">
                {isEditName ? (
                    <form>
                        <input
                            className="detail__input"
                            type="text"
                            name=""
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                            }}
                            id=""
                            autoFocus
                        />
                        <div className="detail__action">
                            <a
                                className="detail__primary"
                                onClick={e => {
                                    handleUpdate(e, { name });
                                }}
                            >
                                Update
                            </a>
                            <a
                                className="detail__secondary"
                                onClick={() => setIsEditName(false)}
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                ) : (
                    <h2
                        style={{
                            maxWidth: "350px",
                            lineHeight: "2rem",
                            cursor: "pointer"
                        }}
                        title="Click to edit"
                        onClick={e => {
                            setName(stakeholder.name);
                            setIsEditName(true);
                        }}
                    >
                        {stakeholder.name}
                    </h2>
                )}
                <span
                    style={{
                        paddingBottom: "3px"
                    }}
                >
                    {stakeholder.label}
                </span>
            </div>
            <div className="detail__title">
                {isEditWeight ? (
                    <form>
                        <input
                            className="detail__input"
                            type="text"
                            name=""
                            value={weight}
                            onChange={e => {
                                setWeight(e.target.value);
                            }}
                            id=""
                            autoFocus
                        />
                        <div className="detail__action">
                            <a
                                className="detail__primary"
                                onClick={e => {
                                    handleUpdate(e, { weight });
                                }}
                            >
                                Update
                            </a>
                            <a
                                className="detail__secondary"
                                onClick={() => setIsEditWeight(false)}
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                ) : (
                    <h4
                        style={{
                            maxWidth: "350px",
                            lineHeight: "2rem",
                            cursor: "pointer"
                        }}
                        title="Click to edit"
                        onClick={e => {
                            setWeight(stakeholder.weight);
                            setIsEditWeight(true);
                        }}
                    >
                         {'Stakeholder s weight: ' + stakeholder.weight}
                    </h4>
                )}
            </div>
            
            <div className="detail__info" style={{ width: "100%" }}>
                <div className="detail__type">
                    <p ref={afterRef}>Stakeholder</p>
                </div>
                {isEditDescription ? (
                    <form style={{ marginBottom: "40px" }}>
                        <textarea
                            className="detail__area"
                            name=""
                            value={description}
                            onChange={e => {
                                setDescription(e.target.value);
                            }}
                            id=""
                            autoFocus
                        />
                        <div className="detail__action">
                            <a
                                className="detail__primary"
                                onClick={e => {
                                    handleUpdate(e, { description });
                                }}
                            >
                                Update
                            </a>
                            <a
                                className="detail__secondary"
                                onClick={() => {
                                    setIsEditDescription(false);
                                }}
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                ) : (
                    <p
                        className="detail__description"
                        title="Click to edit"
                        onClick={e => {
                            setDescription(stakeholder.description);
                            setIsEditDescription(true);
                        }}
                    >
                        {stakeholder.description ? (
                            stakeholder.description
                        ) : (
                            <span
                                className="d-flex align-items-start justify-content-center text-muted"
                                style={{
                                    margin: "14px 0",
                                    fontSize: "14px",
                                    width: "100%"
                                }}
                            >
                                No description provided
                            </span>
                        )}
                    </p>
                )}
                {stakeholder.modell === "Manual" ?
                    <span
                        style={{
                            paddingBottom: "3px"
                        }}
                    >
                        {'This Stakeholder was manually added'}
                    </span>
                    :
                    <span style={{ paddingBottom: "3px" }}>
                        {'This Stakeholder was added by '}
                        <span style={{ color: "Magenta" }}>
                            {stakeholder.modell}
                        </span>
                    </span>
                }               <
                    div className="detail__other">
                    <div
                        className={
                            "detail__list" +
                            (toggle.production ? "" : "-collapsed")
                        }
                    >
                        <div
                            className="d-flex justify-content-between"
                            style={{
                                marginBottom: "20px",
                                marginTop: "20px"
                            }}
                        >
                            <div className="d-flex">
                                <h4
                                    style={{
                                        margin: "0",
                                        marginTop: "-1px",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        lineHeight: "2rem",
                                        maxWidth: "350px"
                                    }}
                                    className={help ? "tip" : ""}
                                    data-tip="1"
                                    onClick={() => handleToggle("production")}
                                >
                                    Produced Information elements
                                    {help && (
                                        <div className="tooltip__wrapper">
                                            <span className="help__text">
                                                <b>Production relationship </b>{" "}
                                                means that the stakeholder
                                                produces the information element
                                                for other stakeholders.
                                            </span>
                                        </div>
                                    )}
                                </h4>
                                <Tag
                                    content={
                                        getRelatedInformationElements(
                                            "production"
                                        ).length
                                    }
                                    color="#3d4659"
                                />
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                fixedWidth
                                size="sm"
                                className={
                                    "detail__toggle" +
                                    (toggle.production ? "" : "-collapsed")
                                }
                                onClick={() => handleToggle("production")}
                            />
                        </div>
                        <div
                            className={
                                "detail__list_content" +
                                (toggle.production ? "" : "-collapsed")
                            }
                        >
                            <Card
                                title={"Add new produced Information element"}
                                addNew={true}
                                onClick={e => {
                                    handleMenuClick(
                                        e,
                                        "stakeholder-information-element-relationship",
                                        "production"
                                    );
                                }}
                            />
                            {getRelatedInformationElements("production")
                                .length !== 0 ? (
                                getRelatedInformationElements(
                                    "production"
                                ).map(ie => (
                                    <Card
                                        id={`card-relation-production-${ie.id}`}
                                        key={ie.id}
                                        label={ie.label}
                                        name={ie.name}
                                        color={colors[ie.type]}
                                    />
                                ))
                            ) : (
                                <span
                                    className="d-flex align-items-start justify-content-center text-muted"
                                    style={{
                                        margin: "30px 0",
                                        fontSize: "14px"
                                    }}
                                >
                                    No information elements
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={
                            "detail__list" +
                            (toggle.obligatory ? "" : "-collapsed")
                        }
                    >
                        <div
                            className="d-flex justify-content-between"
                            style={{
                                marginBottom: "20px",
                                marginTop: "20px"
                            }}
                        >
                            <div className="d-flex">
                                <h4
                                    style={{
                                        margin: "0",
                                        marginTop: "-1px",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        lineHeight: "2rem",
                                        maxWidth: "350px"
                                    }}
                                    onClick={() => handleToggle("obligatory")}
                                    className={help ? "tip" : ""}
                                    data-tip="1"
                                >
                                    Obligatory Information elements
                                    {help && (
                                        <div className="tooltip__wrapper">
                                            <span className="help__text">
                                                <b>Obligation relationship</b>{" "}
                                                denotes that the stakeholder
                                                provides the information element
                                                based on mandatory supply or
                                                requests the information element
                                                based on legal demands.
                                            </span>
                                        </div>
                                    )}
                                </h4>
                                <Tag
                                    content={
                                        getRelatedInformationElements(
                                            "obligatory"
                                        ).length
                                    }
                                    color="#3d4659"
                                />{" "}
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                fixedWidth
                                size="sm"
                                className={
                                    "detail__toggle" +
                                    (toggle.obligatory ? "" : "-collapsed")
                                }
                                onClick={() => handleToggle("obligatory")}
                            />
                        </div>
                        <div
                            className={
                                "detail__list_content" +
                                (toggle.obligatory ? "" : "-collapsed")
                            }
                        >
                            <Card
                                title={"add new obligatory relationship"}
                                addNew={true}
                                onClick={e => {
                                    handleMenuClick(
                                        e,
                                        "stakeholder-information-element-relationship",
                                        "obligatory"
                                    );
                                }}
                            />
                            {getRelatedInformationElements("obligatory")
                                .length !== 0 ? (
                                getRelatedInformationElements(
                                    "obligatory"
                                ).map(ie => (
                                    <Card
                                        id={`card-relation-obligatory-${ie.id}`}
                                        key={ie.id}
                                        label={ie.label}
                                        name={ie.name}
                                        color={colors[ie.type]}
                                    />
                                ))
                            ) : (
                                <span
                                    className="d-flex align-items-start justify-content-center text-muted"
                                    style={{
                                        margin: "30px 0",
                                        fontSize: "14px"
                                    }}
                                >
                                    No information elements
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={
                            "detail__list" +
                            (toggle.optional ? "" : "-collapsed")
                        }
                    >
                        <div
                            className="d-flex justify-content-between"
                            style={{
                                marginBottom: "20px",
                                marginTop: "20px"
                            }}
                        >
                            <div className="d-flex">
                                <h4
                                    style={{
                                        margin: "0",
                                        marginTop: "-1px",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        lineHeight: "2rem",
                                        maxWidth: "350px"
                                    }}
                                    onClick={() => handleToggle("optional")}
                                    className={help ? "tip" : ""}
                                    data-tip="1"
                                >
                                    Optional Information elements
                                    {help && (
                                        <div className="tooltip__wrapper">
                                            <span className="help__text">
                                                <b> Optionality relationship</b>{" "}
                                                denotes that the information
                                                element was provided by the
                                                stakeholder based on voluntary
                                                supply or requests the
                                                information element based on
                                                personal demands.
                                            </span>
                                        </div>
                                    )}
                                </h4>
                                <Tag
                                    content={
                                        getRelatedInformationElements(
                                            "optional"
                                        ).length
                                    }
                                    color="#3d4659"
                                />
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                fixedWidth
                                size="sm"
                                className={
                                    "detail__toggle" +
                                    (toggle.optional ? "" : "-collapsed")
                                }
                                onClick={() => handleToggle("optional")}
                            />
                        </div>
                        <div
                            className={
                                "detail__list_content" +
                                (toggle.optional ? "" : "-collapsed")
                            }
                        >
                            <Card
                                title={"add new optional relationship"}
                                addNew={true}
                                onClick={e => {
                                    handleMenuClick(
                                        e,
                                        "stakeholder-information-element-relationship",
                                        "optional"
                                    );
                                }}
                            />
                            {getRelatedInformationElements("optional")
                                .length !== 0 ? (
                                getRelatedInformationElements(
                                    "optional"
                                ).map(ie => (
                                    <Card
                                        id={`card-relation-optional-${ie.id}`}
                                        key={ie.id}
                                        label={ie.label}
                                        name={ie.name}
                                        color={colors[ie.type]}
                                    />
                                ))
                            ) : (
                                <span
                                    className="d-flex align-items-start justify-content-center text-muted"
                                    style={{
                                        margin: "30px 0",
                                        fontSize: "14px"
                                    }}
                                >
                                    No information elements
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={
                            "detail__list" +
                            (toggle.restricted ? "" : "-collapsed")
                        }
                    >
                        <div
                            className="d-flex justify-content-between"
                            style={{
                                marginBottom: "20px",
                                marginTop: "20px"
                            }}
                        >
                            <div className="d-flex">
                                <h4
                                    style={{
                                        margin: "0",
                                        marginTop: "-1px",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        lineHeight: "2rem",
                                        maxWidth: "350px"
                                    }}
                                    onClick={() => handleToggle("restricted")}
                                    className={help ? "tip" : ""}
                                    data-tip="1"
                                >
                                    Restricted Information elements
                                    {help && (
                                        <div className="tooltip__wrapper">
                                            <span className="help__text">
                                                <b>
                                                    The Restriction relationship
                                                </b>{" "}
                                                denotes that the information
                                                element should not be available
                                                to the stakeholder.
                                            </span>
                                        </div>
                                    )}
                                </h4>
                                <Tag
                                    content={
                                        getRelatedInformationElements(
                                            "restricted"
                                        ).length
                                    }
                                    color="#3d4659"
                                />
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                fixedWidth
                                size="sm"
                                className={
                                    "detail__toggle" +
                                    (toggle.restricted ? "" : "-collapsed")
                                }
                                onClick={() => handleToggle("restricted")}
                            />
                        </div>

                        <div
                            className={
                                "detail__list_content" +
                                (toggle.restricted ? "" : "-collapsed")
                            }
                        >
                            <Card
                                title={"add new restricted relationship"}
                                addNew={true}
                                onClick={e => {
                                    handleMenuClick(
                                        e,
                                        "stakeholder-information-element-relationship",
                                        "restricted"
                                    );
                                }}
                            />
                            {getRelatedInformationElements("restricted")
                                .length !== 0 ? (
                                getRelatedInformationElements(
                                    "restricted"
                                ).map(ie => (
                                    <Card
                                        id={`card-relation-restricted-${ie.id}`}
                                        key={ie.id}
                                        label={ie.label}
                                        name={ie.name}
                                        color={colors[ie.type]}
                                    />
                                ))
                            ) : (
                                <span
                                    className="d-flex align-items-start justify-content-center text-muted"
                                    style={{
                                        margin: "30px 0",
                                        fontSize: "14px"
                                    }}
                                >
                                    No information elements
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={
                            "detail__list" +
                            (toggle.undecided ? "" : "-collapsed")
                        }
                    >
                        <div
                            className="d-flex justify-content-between"
                            style={{
                                marginBottom: "20px",
                                marginTop: "20px"
                            }}
                        >
                            <div className="d-flex">
                                <h4
                                    style={{
                                        margin: "0",
                                        marginTop: "-1px",
                                        cursor: "pointer",
                                        userSelect: "none"
                                    }}
                                    onClick={() => handleToggle("undecided")}
                                    className={help ? "tip" : ""}
                                    data-tip="1"
                                >
                                    Undecided Information elements
                                    {help && (
                                        <div className="tooltip__wrapper">
                                            <span className="help__text">
                                                <b>
                                                    The undecidedness
                                                    relationship
                                                </b>{" "}
                                                denotes that the relationship
                                                between the stakeholder and the
                                                information element is not
                                                decided yet.
                                            </span>
                                        </div>
                                    )}
                                </h4>
                                <Tag
                                    content={
                                        getRelatedInformationElements(
                                            "undecided"
                                        ).length
                                    }
                                    color="#3d4659"
                                />
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                fixedWidth
                                size="sm"
                                className={
                                    "detail__toggle" +
                                    (toggle.undecided ? "" : "-collapsed")
                                }
                                onClick={() => handleToggle("undecided")}
                            />
                        </div>

                        <div
                            className={
                                "detail__list_content" +
                                (toggle.undecided ? "" : "-collapsed")
                            }
                        >
                            <Card
                                title={"add new undecided relationship"}
                                addNew={true}
                                onClick={e => {
                                    handleMenuClick(
                                        e,
                                        "stakeholder-information-element-relationship",
                                        "undecided"
                                    );
                                }}
                            />
                            {getRelatedInformationElements("undecided")
                                .length !== 0 ? (
                                getRelatedInformationElements(
                                    "undecided"
                                ).map(ie => (
                                    <Card
                                        id={`card-relation-undecided-${ie.id}`}
                                        key={ie.id}
                                        label={ie.label}
                                        name={ie.name}
                                        color={colors[ie.type]}
                                        title={"change the undecided relationship to another type"}
                                        onClick={e => {
                                            // remove relation
                                            let relation = searchRelation(ie.id);
                                            console.log("remove relation", relation?.id);
                                            handleMenuClickupdate(
                                                e,
                                                "stakeholder-information-element-relationship2",
                                                "undecided",
                                                relation?.id, ie.id
                                            );
                                                
                                        }}
                                        
                                    />
                                ))
                            ) : (
                                <span
                                    className="d-flex align-items-start justify-content-center text-muted"
                                    style={{
                                        margin: "30px 0",
                                        fontSize: "14px"
                                    }}
                                >
                                    No information elements
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapSateToProps = state => ({
    stakeholder: state.application.focused,
    stakeholders: state.stakeholder.stakeholders,
    informationElements: state.informationElement.informationElements,
    relationships: state.relationship.relations,
    help: state.help.help,
    focused: state.application.focused,
    application: state.application.application,
});

export default connect(mapSateToProps, { updateStakeholder, toggleModal , toggleModal2})(
    Stakeholder
);
