import React, { useState } from "react";
import { connect } from "react-redux";


import { toggleModal } from "../../../redux/actions/modalActions";
import { getInfoById , generateInformationElementchoose } from  "../../../redux/actions/informationElementsActions";
import { getApplicationdata } from "../../../redux/actions/applicationActions";
import InfoForm4 from "./ieform3";
const InfoForm3 = ({ application, toggleModal , applicationData }) => {
    const [model, setmodel] = useState();   
    const [generetedie, setgeneretedie] = useState([]);
    const [activeForm, setActiveForm] = useState('form3');
    const [isLoading, setIsLoading] = useState(false);
    const [Tnote, setTnote] = useState("");
    const [namelist, setnameList] = useState([]);
    const [warning, setWarning] = useState('');


    const handleTnoteChange = (e) => {
        const newValue = e.target.value;
        setTnote(newValue);
        // Check if Tnote contains application.name
        if (!newValue.includes(application.name)) {
            setWarning(`The Application's terms do not contain **${application.name}**.`);
        } else {
            setWarning(''); // Clear the warning if the condition is met
        }
    };

    //const note = "Conditions d'utilisation et règles de confidentialité Vos données et Bard Cet avis et nos Règles de confidentialitéS'ouvre dans une nouvelle fenêtre décrivent comment Google traite vos données Bard. Veuillez les lire attentivement. Dans l'Espace économique européen et en Suisse, Bard est fourni par Google Ireland Limited ; partout ailleurs, Bard est fourni par Google LLC (ci-après dénommés Google). Google collecte vos conversations avec Bard, des informations sur l'utilisation du produit, des informations sur votre position, et vos commentaires. Google utilise ces données conformément à ses Règles de confidentialitéS'ouvre dans une nouvelle fenêtre pour fournir, améliorer et développer ses produits et services, ainsi que ses technologies de machine learning (apprentissage automatique), y compris ses produits d'entreprise tels que Google Cloud. Si vous avez 18 ans ou plus, Google stocke par défaut votre activité BardS'ouvre dans une nouvelle fenêtre dans votre compte Google pendant 18 mois au maximum. Vous pouvez choisir une période de 3 ou 36 mois à l'adresse myactivity.google.com/product/bardS'ouvre dans une nouvelle fenêtre. Des informations sur votre position (y compris la zone géographique générale de votre appareil, l'adresse IP, l'adresse professionnelle ou personnelle indiquées dans votre compte Google) sont aussi stockées avec votre activité Bard. Pour en savoir plus, consultez g.co/privacypolicy/locationS'ouvre dans une nouvelle fenêtre. Pour améliorer la qualité et nos produits (tels que les modèles de machine learning génératifs qui alimentent Bard), des réviseurs humains lisent, annotent et traitent vos conversations avec Bard. Dans le cadre de ce processus, nous prenons les mesures adéquates pour protéger la confidentialité de vos données. Par exemple, vos conversations avec Bard sont dissociées de votre compte Google avant que les réviseurs les voient ou les annotent. Veuillez ne pas saisir d'informations confidentielles dans vos conversations avec Bard, ni d'informations que vous ne souhaiteriez pas qu'un réviseur consulte ou que Google utilise pour améliorer ses produits, services et technologies de machine learning."
    //let stakeholderslist = ['Bard', 'Google Ireland Limited', 'Google LLC'];
    
    const handleSubmit = async e => {
        e.preventDefault();
        setActiveForm('form3');
        setIsLoading(true);
        await getInfoById(application.id)
            .then(applicationData => {
                // Your code that relies on applicationData goes here
                //setnameList(applicationData.map((item) => item.name))
                setnameList(applicationData.map((item) => ({ name: item.name, weight: item.weight })));
                console.log("Name List:", namelist);
                // Check if stakeholder exists in nameList
            })
        console.log("Name List1:", namelist);
        let informationelements = []
        let applicationdata1 = await getApplicationdata(application.id);
        console.log("application data inside form 2", applicationdata1['transparency_note'])
        try {
            if (Tnote != ''){
                informationelements = await generateInformationElementchoose(Tnote, model);
            }else{
                informationelements = await generateInformationElementchoose(applicationdata1['transparency_note'], model);
            }
            setActiveForm('form4');
            
            console.log("inforelements:", informationelements);
            setgeneretedie(informationelements)
        } catch (error) {
            // Handle errors here
            console.error("Error:", error);
        } finally {
            setIsLoading(false); 
            //console.log("stakeholders after after", activeForm )
            console.log("inforelements after", informationelements )
            
        }
        
        
        
    };

    
    return (
        
        <div>    
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        )} 
        {activeForm === 'form3' && (
        <form className="form-modal" onSubmit={handleSubmit} >
                    <h3>Choose Model</h3>
                    <div className="form-group">
                        <span className="form-label"><b>Application's terms </b></span>
                        <span className="form-label">Add transparency note if you created your application manuallay</span>
                        <textarea
                        cols="30"
                        rows="4"
                        placeholder="Paste the application's terms and conditions here..."
                        value={Tnote}
                        onChange={handleTnoteChange}
                        className="form-control"
                        />
                        {warning && <span className="text-danger"  style={{ fontSize: '0.8em', color: 'red' }}>{warning}</span>}
                    </div>    
                    <div className="form-group">
                        <span className="form-label-req">
                            Model name
                        </span>
                        <select
                            value={model}
                            onChange={e => {
                                setmodel(e.target.value);
                            }}
                            className="form-control"
                        >
                            <option value="">choose</option>
                            <option value="predictModelFull">LSTM model</option>
                            <option value="predictHuggingFaceModel">BART model</option>
                        </select>
                    </div>
            
            <button type="submit" className="form-submit">
                Suggest
            </button>
        </form>
         )}
        {activeForm === 'form4' && <InfoForm4 informationelements={generetedie} namelist1={namelist} toggleModal={toggleModal} />} {/* Display Form1 */}
        </div>
       
    );
};

const mapSateToProps = state => ({
    application: state.application.application,
    applicationData: state.application.applicationData
});

export default connect(mapSateToProps, { toggleModal })(
    InfoForm3
);
