import React, { useState, useEffect   } from "react";
import { connect } from "react-redux";


import { toggleModal,toggleModal2 } from "../../../redux/actions/modalActions";
import {  getStakeholdersById } from "../../../redux/actions/stakeholderActions";
import { getApplicationdata } from "../../../redux/actions/applicationActions";
const HighlightedText = ({ application, stakeholders }) => {
    const [nameList, setNameList] = useState([]);
    const [applicationData, setApplicationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // List of stakeholders
    const stakeholders1 = ["stakeholder1", "stakeholder2", "stakeholder3"];

    // Text with placeholders for stakeholders
    const textWithStakeholders = "Lorem ipsum stakeholder1 sit amet, consectetur adipiscing elit. Fusce et ex ullamcorper, luctus quam ut, accumsan mi. Nullam vel ultricies enim, a posuere metus. Duis imperdiet sapien at enim congue, sit amet blandit est dictum. Maecenas varius semper odio, ac luctus justo finibus eu. Aenean et erat vitae est aliquet suscipit. Integer at tellus sed metus hendrerit dapibus. Ut varius, neque vel congue congue, arcu libero vehicula lectus, vel ultricies ante enim id ligula. Sed in tortor ultrices, ullamcorper libero vel, sollicitudin odio. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer tempor turpis vitae ex convallis, in lobortis ipsum scelerisque. Aliquam a metus dapibus, porttitor quam ac, interdum est. Cras vehicula, lacus sit amet fermentum feugiat, risus justo varius erat, in fringilla magna enim ac ante. Ut id mauris sed odio placerat egestas. Sed ut neque at arcu blandit tristique.";
    // Function to highlight stakeholders

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!application) {
                    console.error("Error fetching data:", application.id);
                }
                //const applicationData1 = await getStakeholdersById(application.id);
                const names = stakeholders.map(stakeholder => stakeholder.name);

                setNameList(names);
                console.error("Error fetching data:", nameList);
                console.error("Error fetching data:", stakeholders);
                const data = await getApplicationdata(application.id);
                setApplicationData(data['transparency_note']);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [application.id]);

    const highlightStakeholders =  (text, stakeholders) => {
        const textAsString = typeof text === 'string' ? text : '';
        return textAsString.replace(
            new RegExp(`\\b(${stakeholders.join('|')})\\b`, 'gi'),
            (match) => `<span style="background-color: yellow;">${match}</span>`
        );
    };


    return (
        <div style={{ maxHeight: '150px', overflow: 'auto' }}>
           {isLoading ? (
                <p>Loading...</p>
                ) : (
                <p dangerouslySetInnerHTML={{ __html: highlightStakeholders(applicationData, nameList) }}></p>
                )}
        </div>
    );
}

const mapStateToProps = state => ({
    application: state.application.application,
    stakeholders: state.stakeholder.stakeholders
});

export default connect(mapStateToProps, {
    toggleModal,
    toggleModal2,
})(HighlightedText);