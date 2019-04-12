window.clauseClick = function(clauseId, colorClausesBool, mappedBtn) {

	let utils = require('../modules/utils.js');
	let clause = require('../modules/clause.js');

    utils.decolorByClassName("card-link");
    utils.decolorByClassName("obligation");
    utils.decolorByClassName("clause");

    utils.color(document.getElementById("clause_" + clauseId));

    if (colorClausesBool){
	    clause.colorClausesForClause(clauseId, mappedBtn);
	}
	else{
	    clause.colorObligationsForClause(clauseId, mappedBtn);
	}
}

window.popupForMappedClauseObligation = function(clauseId,calText) {
	
	let manifest = require('../../../../../webpack/manifest.js');

	$.ajax({
		url: manifest.PETER_URL + 'obligation/policy_clause/' + clauseId,

		beforeSend: function(xhr) {
			 xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
		}, 

		success: function(response){
			
			$('#popup-modal').modal('toggle');
            const clauseText = `<div><h3>Clause:</h3><p>${calText}</p><h3>Mapped Obligations:</h3></div>`;
            $('#popup-modal .modal-body').append(clauseText);
			
			for (var i in response['data']){

				let mappedObligationId = 'obl_' + response['data'][i].id;
                let mappedObligation= response['data'][i].parsed_text;
				let obligationElement = document.getElementById(mappedObligationId);
				
				if ((obligationElement == null) || (typeof(obligationElement) == 'undefined')){
                    continue;
                }

                const obligationsDisplayArea = `<ul><li> ${mappedObligation}</li></ul>`                
                $('#popup-modal .modal-body').append(obligationsDisplayArea); 
            }

            $('#popup-modal').on('hidden.bs.modal', function (e) {
                $('#popup-modal .modal-body').html('');
            })
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Error in fetching obligations for clause"); 
        }  
	})	
}

window.popupForMappedClauseClause= function(clauseId, calText) {

	let manifest = require('../../../../../webpack/manifest.js');

	$.ajax({
		url: manifest.PETER_URL + 'policy_clause/policy_clause/' + clauseId,

		beforeSend: function(xhr) {
			 xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
		}, 

		success: function(response){

			$('#popup-modal').modal('toggle');
            const clauseText = `<div><h3>Clause:</h3><p>${calText}</p><h3>Mapped Clauses:</h3></div>`;
            $('#popup-modal .modal-body').append(clauseText);
			
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
			logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
		}  
	})

}