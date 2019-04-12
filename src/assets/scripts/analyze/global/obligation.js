window.obligationClick = function(obligationId, colorClausesBool, mappedBtn){

    let utils = require('../modules/utils.js');
    let obligation = require('../modules/obligation.js');

    utils.decolorByClassName("card-link");
    utils.decolorByClassName("obligation");
    utils.decolorByClassName("clause");

    utils.color(document.getElementById("obl_" + obligationId));

    if (colorClausesBool){
        obligation.colorClausesForObligation(obligationId,mappedBtn);
        
	}
	else{
	    obligation.colorObligationsForObligation(obligationId,mappedBtn);
	}
}

window.popupForMappedObligationClause =function(obligationId, oblText) {
    let manifest = require('../../../../../webpack/manifest.js');

    $.ajax({
        url: manifest.PETER_URL + 'policy_clause/obligation/' + obligationId,

        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
        }, 

        success: function(response){
            
            $('#popup-modal').modal('toggle');
            const obligationText = `<div><h3>Obligaton:</h3><p>${oblText}</p><h3>Mapped Clauses:</h3></div>`;
            $('#popup-modal .modal-body').append(obligationText);

            for (var i in response['data']){
                
                let mappedClauseId = 'clause_' + response['data'][i].id;
                let mappedClause= response['data'][i].parsed_text;
                let clauseElement = document.getElementById(mappedClauseId);

                if ((clauseElement == null) || (typeof(clauseElement) == 'undefined')){
                    continue;
                }
                    const clauseDisplayArea = `<ul><li> ${mappedClause}</li></ul>`
                    
                    $('#popup-modal .modal-body').append(clauseDisplayArea); 
            }
                $('#popup-modal').on('hidden.bs.modal', function (e) {
                    $('#popup-modal .modal-body').html('');
                })
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Error in fetching clauses for obligation"); 
        }  
    })
}

window.popupForMappedObligationObligation =function(obligationId, oblText){
    let manifest = require('../../../../../webpack/manifest.js');
    console.log("here")
    $.ajax({
        url: manifest.PETER_URL + 'obligation/obligation/' + obligationId,

        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
        }, 

        success: function(response){

            $('#popup-modal').modal('toggle');
            const obligationText = `<div><h3>Obligaton:</h3><p>${oblText}</p><h3>Mapped Obligations:</h3></div>`;
            $('#popup-modal .modal-body').append(obligationText);
            
            for (var i in response['data']){
                 
                let mappedObligationId = 'obl_' + response['data'][i].id;
                let mappedObligation= response['data'][i].parsed_text;
                let obligationElement = document.getElementById(mappedObligationId);
                if ((obligationElement == null) || (typeof(obligationElement) == 'undefined')){
                    continue;
                }

                 const MappedObligationDisplayArea = `<ul><li> ${mappedObligation}</li></ul>`
                    
                    $('#popup-modal .modal-body').append(MappedObligationDisplayArea); 
            }
                $('#popup-modal').on('hidden.bs.modal', function (e) {
                    $('#popup-modal .modal-body').html('');
                })
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Error in fetching obligations for obligation"); 
        }  
    })
}