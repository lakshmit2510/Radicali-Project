var mapping = (function() {

let manifest = require('../../../../../webpack/manifest.js');
let utils = require('./utils.js');

function loadRegPolicyMappings(regId, policyId) {

    if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
        document.querySelector("meta[name='is_called']").setAttribute("content", "true");

        $.ajax({

            url: manifest.PETER_URL + 'obligation/regulation/' + regId,

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
            },

            success: function(response){

                let obligationsList = response['data'];
                
                let clausesOnDOM = [];
                $.each($(".clause"),function(){
                    clausesOnDOM.push(parseInt($(this).attr("id").split("_")[1]))
                });

                for (var i in obligationsList){

                    let obligationId = obligationsList[i].id;

                    $.ajax({
                        url: manifest.PETER_URL + 'policy_clause/obligation/' + obligationId,


                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                        },

                        success: function(response){
                            
                            let obligationElement = document.getElementById("obl_" + obligationId);
                            var obligationText = obligationElement.firstChild.innerText;

                            let mappedClauseIds = [];
                            let mappedClauses = response['data'];
                            for (var k in mappedClauses){
                                mappedClauseIds.push(mappedClauses[k].id);
                            }
                            
                            let mappedClausesOnDOM = _.intersection(mappedClauseIds, clausesOnDOM);
                            let mappedClausesString = mappedClausesOnDOM.join();
                                                            
                            if (mappedClausesOnDOM.length > 0){
                               
                                utils.highlight(obligationElement, is_mapped=true);
                                utils.highlightContainingCards(obligationElement, is_mapped=true);
                                
                                if (obligationElement.classList.contains('mapped') == false){
                                                            
                                    obligationElement.classList.add('mapped');

                                    obligationElement.setAttribute("mappedClauses", mappedClausesString)
                                    
                                    let obligationButtonHtml = utils.getButtonHtml(obligationId, obligationText, true, true);
                                    obligationElement.appendChild(obligationButtonHtml);
                                }
                            }
                            else{
                                obligationElement.classList.add('unmapped');
                            }
                        }
                    })
                }
            }
        })

        $.ajax({

            url: manifest.PETER_URL + 'policy_clause/policy/' + policyId,

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
            },

            success: function(response){

                let policyClausesList = response['data'];
                
                let obligationsOnDOM = [];
                $.each($(".obligation"),function(){
                    obligationsOnDOM.push(parseInt($(this).attr("id").split("_")[1]))
                });

                for (var i in policyClausesList){
    
                    let clauseId = policyClausesList[i].id;

                    $.ajax({
                        url: manifest.PETER_URL + 'obligation/policy_clause/' + clauseId,

                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                        },

                        success: function(response){

                            let clauseElement = document.getElementById("clause_" + clauseId);
							let clauseText = clauseElement.innerText;
                            let mappedObligationIds = [];
                            let mappedObligations = response['data'];
                            for (var k in mappedObligations){
                                mappedObligationIds.push(mappedObligations[k].id);
                            }
                            
                            let mappedObligationsOnDOM = _.intersection(mappedObligationIds, obligationsOnDOM);
                            let mappedObligationsString = mappedObligationsOnDOM.join();                

                            if (mappedObligationsOnDOM.length > 0){

                                utils.highlight(clauseElement, is_mapped=true);
								utils.highlightContainingCards(clauseElement, is_mapped=true);
                                
                                if (clauseElement.classList.contains('mapped') == false){
                                                            
                                    clauseElement.classList.add('mapped');
                                    clauseElement.setAttribute("mappedObligations", mappedObligationsString)
                                    
									let clauseButtonHtml = utils.getButtonHtml(clauseId, clauseText, false, false);
									
                                    clauseElement.appendChild(clauseButtonHtml);
                                }
                            }
                        }
                    })
                }
            }
        })

    }
}

function loadRegRegMappings(regX, regY) {

		if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
			document.querySelector("meta[name='is_called']").setAttribute("content", "true");

			$.ajax({

				url: manifest.PETER_URL + 'obligation/regulation/' + regX,
		
				beforeSend: function(xhr) {
						xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
				},
		
				success: function(response){
		
				let obligationsList = response['data'];
				
				let obligationsOnDOM = [];
				$.each($(".obligation"),function(){
					obligationsOnDOM.push(parseInt($(this).attr("id").split("_")[1]))
				});
			
				for (var i in obligationsList){
			
					let obligationIdX = obligationsList[i].id;
			
						$.ajax({
								url: manifest.PETER_URL + 'obligation/obligation/' + obligationIdX,
			
								beforeSend: function(xhr) {
										xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
								},
			
								success: function(response){
							
							let obligationElementX = document.getElementById("obl_" + obligationIdX);
							var obligationTextX = obligationElementX.firstChild.innerText;
			
							let mappedObligationIds = [];
							let mappedObligations = response['data'];
							
							for (var k in mappedObligations){
								mappedObligationIds.push(mappedObligations[k].id);
							}
							
							let mappedObligationsOnDOM = _.intersection(mappedObligationIds, obligationsOnDOM);
							let mappedObligationString = mappedObligationsOnDOM.join();
						
							if (mappedObligationsOnDOM.length > 0){
			
								utils.highlight(obligationElementX, is_mapped=true);
								utils.highlightContainingCards(obligationElementX, is_mapped=true);
								
								if (obligationElementX.classList.contains('mappedX') == false){
			
									obligationElementX.classList.add('mappedX');
									obligationElementX.setAttribute("mappedObligations",mappedObligationString)
			
									let obligationXButtonHtml = utils.getButtonHtml(obligationIdX, obligationTextX, true, false);
									obligationElementX.appendChild(obligationXButtonHtml);
								}
							}
							else{
                                obligationElementX.classList.add('unmapped');
                            }
						}
					})

				}
			}
		})

		$.ajax({

			url: manifest.PETER_URL + 'obligation/regulation/' + regY,
	
			beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
			},
	
			success: function(response){
	
				let obligationsList = response['data'];
				
				let obligationsOnDOM = [];
				$.each($(".obligation"),function(){
					obligationsOnDOM.push(parseInt($(this).attr("id").split("_")[1]))
				});
		
				for (var i in obligationsList){
			
					let obligationIdY = obligationsList[i].id;
			
						$.ajax({
								url: manifest.PETER_URL + 'obligation/obligation/' + obligationIdY,
			
								beforeSend: function(xhr) {
										xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
								},
			
								success: function(response){
							
							let obligationElementY = document.getElementById("obl_" + obligationIdY);
							var obligationTextY = obligationElementY.firstChild.innerText;
			
							let mappedObligationIds = [];
							let mappedObligations = response['data'];
							
							for (var k in mappedObligations){
								mappedObligationIds.push(mappedObligations[k].id);
							}
							
							let mappedObligationsOnDOM = _.intersection(mappedObligationIds, obligationsOnDOM);
							let mappedObligationString = mappedObligationsOnDOM.join();
						
							if (mappedObligationsOnDOM.length > 0){
			
								utils.highlight(obligationElementY, is_mapped=true);
								utils.highlightContainingCards(obligationElementY, is_mapped=true);
								
								if (obligationElementY.classList.contains('mappedY') == false){
			
									obligationElementY.classList.add('mappedY');
									obligationElementY.setAttribute("mappedobligations",mappedObligationString)
			
									let obligationYButtonHtml = utils.getButtonHtml(obligationIdY, obligationTextY, true, false);
									obligationElementY.appendChild(obligationYButtonHtml);
								}
							}
							else{
                                obligationElementY.classList.add('unmapped');
                            }
						}
					})
				}
			}
		})
	}

}


function loadPolicyPolicyMappings(policyX, policyY) {

		if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
			document.querySelector("meta[name='is_called']").setAttribute("content", "true");

		    $.ajax({

		        url: manifest.PETER_URL + 'policy_clause/policy/' + policyX,

		        beforeSend: function(xhr) {
		            xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
		        },

		        success: function(response){

					let policyClausesList = response['data'];
					
					let clausesOnDOM = [];
					$.each($(".clause"),function(){
						clausesOnDOM.push(parseInt($(this).attr("id").split("_")[1]))
					});

					for (var i in policyClausesList){
		
						let policyClauseIdX = policyClausesList[i].id;

					    $.ajax({
					        url: manifest.PETER_URL + 'policy_clause/policy_clause/' + policyClauseIdX,

					        beforeSend: function(xhr) {
					            xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
					        },

					        success: function(response){

								let policyClauseElementX = document.getElementById("clause_" + policyClauseIdX);
								let policyClauseText = policyClauseElementX.innerText;

								let mappedClauses = response['data'];
								let mappedClauseIds = [];

								for (var k in mappedClauses){
									mappedClauseIds.push(mappedClauses[k].id)
								}

								let mappedClausesOnDOM = _.intersection(mappedClauseIds, clausesOnDOM);
								let mappedClausesString = mappedClausesOnDOM.join();

					        	if (mappedClausesOnDOM.length > 0){
									
									utils.highlight(policyClauseElementX, is_mapped=true);
									utils.highlightContainingCards(policyClauseElementX, is_mapped=true);
									
									if (policyClauseElementX.classList.contains('mappedX') == false){

										policyClauseElementX.classList.add('mappedX');
										policyClauseElementX.setAttribute("mappedclauses",mappedClausesString)

										let clauseXButtonHtml = utils.getButtonHtml(policyClauseIdX,policyClauseText, false, true);
									
                                    	policyClauseElementX.appendChild(clauseXButtonHtml);
									}
									
							    }

					        }, 

					        error: function(XMLHttpRequest, textStatus, errorThrown) { 
								//					        
					        }

						})
					}
		        }, 

		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					//			        
		        }

			})

			$.ajax({

				url: manifest.PETER_URL + 'policy_clause/policy/' + policyY,

				beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
				},

				success: function(response){

					let policyClausesList = response['data'];
					
					let clausesOnDOM = [];
					$.each($(".clause"),function(){
						clausesOnDOM.push(parseInt($(this).attr("id").split("_")[1]))
					});

					for (var i in policyClausesList){
		
						let policyClauseIdY = policyClausesList[i].id;

						$.ajax({
							url: manifest.PETER_URL + 'policy_clause/policy_clause/' + policyClauseIdY,

							beforeSend: function(xhr) {
								xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
							},

							success: function(response){

								let policyClauseElementY = document.getElementById("clause_" + policyClauseIdY);
								let policyClauseText = policyClauseElementY.innerText;

								let mappedClauses = response['data'];
								let mappedClauseIds = [];

								for (var k in mappedClauses){
									mappedClauseIds.push(mappedClauses[k].id)
								}

								let mappedClausesOnDOM = _.intersection(mappedClauseIds, clausesOnDOM);
								let mappedClausesString = mappedClausesOnDOM.join()

								if (mappedClausesOnDOM.length > 0){
									
									utils.highlight(policyClauseElementY, is_mapped=true);
									utils.highlightContainingCards(policyClauseElementY, is_mapped=true);
									
									if (policyClauseElementY.classList.contains('mappedY') == false){

										policyClauseElementY.classList.add('mappedY');
										policyClauseElementY.setAttribute("mappedclauses", mappedClausesString)
										let clauseYButtonHtml = utils.getButtonHtml(policyClauseIdY,policyClauseText, false, true);

										policyClauseElementY.appendChild(clauseYButtonHtml);
									}
									
								}

							}, 

							error: function(XMLHttpRequest, textStatus, errorThrown) { 
								//					        
							}

						})
					}
				}, 

				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					//			        
				}

			})

		}
	}

	
	
    module.exports = {  
        loadRegPolicyMappings: loadRegPolicyMappings,
        loadRegRegMappings: loadRegRegMappings,
        loadPolicyPolicyMappings: loadPolicyPolicyMappings
	};

}());