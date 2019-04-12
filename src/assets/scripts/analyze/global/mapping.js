window.openMappingPage = function(regId, policyId){	
	window.open('analyze.html?regulation='+regId+'&policy='+policyId, "_self");
}

window.loadMappings = function(elementX, isRegX, elementY, isRegY){

    let mapping = require('../modules/mapping.js');

	if (isRegX && !(isRegY)){
		mapping.loadRegPolicyMappings(elementX, elementY);
	}
	else if (isRegX && isRegY){
		mapping.loadRegRegMappings(elementX, elementY);
	}
	else if (!(isRegX) && !(isRegY)){
		mapping.loadPolicyPolicyMappings(elementX, elementY);
	}
	
}

window.mappingOnload = function() {

	if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
		document.querySelector("meta[name='is_called']").setAttribute("content", "true");

	    let manifest = require('../../../../../webpack/manifest.js');
	    
	    $.ajax({
	        url: manifest.PETER_URL + 'regulation_policy',

	        beforeSend: function(xhr) {
	             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
	        }, 

	        success: function(response){	            
		
				let mappings = [];

				var mappingTable = $('#mapping-list').DataTable({
					data: mappings,
					columns: [
					    { title: "Regulation", "orderable": false},
					    { title: "Policy", "orderable": false},
                        { title: "Country", "orderable": false},
                        { title: "Regulator", "orderable": false},
                        { title: "Regulation Activity", "orderable": false},
					    { title: "Mapping" }
					  ],
                }); 

			    for (var i in response['data']){

			    	let regulationId = response['data'][i].regulation_id;
					let policyId = response['data'][i].policy_id;

				    $.ajax({
				        url: manifest.PETER_URL + 'regulation/' + regulationId,

				        beforeSend: function(xhr) {
				             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
				        }, 

				        success: function(regData){	            
					    	
					    	let regTitle = regData.title;
					    	let link = decodeURIComponent(regData.link);
					    	let regCountry = regData.country
					    	let regulator = regData.regulator
					    	let regActivity = regData.activity
					    	let regDocumentType = regData.document_type

					    	let regHtmlText = "<a target=\"_blank\" href=\'" + link + "\'> " + regTitle + "</a>";

						    $.ajax({
						        url: manifest.PETER_URL + 'policy/' + policyId,

						        beforeSend: function(xhr) {
						             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
						        }, 

						        success: function(policyData){	            

						    		let policyTitle = policyData.title;
									let mappingHtml = "<button class=\"btn btn-primary\" onClick=\"openMappingPage("+regulationId+","+policyId+")\">Analyze</a>"

							    	let mapping = [];

							    	mapping.push(regHtmlText);
							    	mapping.push(policyTitle);
							    	mapping.push(regCountry);
							    	mapping.push(regulator);
							    	mapping.push(regActivity);
							    	mapping.push(mappingHtml);
							    	
									mappingTable.row.add(mapping).draw( false );
								},

						        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            						logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
						        }  

					    	}) 

						},

				        error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
				        }  
				    })	    
				}
	        }, 

	        error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
	        }  
	    })
	}
}
var obligationsIndex = 0;
var isMapping = false;
window.regulationArrowPrev = function(){

    if(isMapping !== $('.mapping-checkbox').prop("checked")){
        obligationsIndex = 0
    }
        isMapping = $('.mapping-checkbox').prop("checked");
        let mappedArr = []
    
    if(!isMapping){
        
        mappedArr = $('.obligation.mapped').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    else{

        mappedArr = $('.obligation.unmapped').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    var obligationId = document.getElementById(mappedArr[obligationsIndex]);
    
    if(obligationId){
        $(".includeRegulation").find(".card-body.show").removeClass('show')
       $.each($(obligationId).parents(".card-body"),function(){$(this).addClass('show')})
        obligationId.scrollIntoView();
        if(obligationsIndex !== 0){
            obligationsIndex--;
        }
        
    } 
}

window.regulationArrowNext = function(){

    if(isMapping !== $('.mapping-checkbox').prop("checked")){
        obligationsIndex = 0
    }

        isMapping = $('.mapping-checkbox').prop("checked");
        let mappedArr = [];

    if(!isMapping){
        mappedArr = $('.obligation.mapped').map(function(idx,item){
            return $(item).attr('id');
        });
    }
    else{
        mappedArr = $('.obligation.unmapped').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    var obligationId = document.getElementById(mappedArr[obligationsIndex]);
    if(obligationId){
       $(".includeRegulation").find(".card-body.show").removeClass('show')
       $.each($(obligationId).parents(".card-body"),function(){$(this).addClass('show')})
        obligationId.scrollIntoView();
        if(obligationsIndex !== mappedArr.length-1){
            obligationsIndex++;
        } 
    }       
}
var clauseIndex = 0;

window.policyArrowPrev = function(){

    if(isMapping !== $('.mapping-checkbox').prop("checked")){
        clauseIndex = 0
    }
        isMapping = $('.mapping-checkbox').prop("checked");
        let mappedArr = [];

    if(!isMapping){
        mappedArr = $('.clause.mapped').map(function(idx,item){
            return $(item).attr('id');
        });
    }
    else{

        mappedArr = $('.clause.unmapped').map(function(idx,item){
            return;
        });
    } 
    
    var clauseId = document.getElementById(mappedArr[clauseIndex]);
    if(clauseId){
        $(".includePolicy").find(".card-body.show").removeClass('show')
        $.each($(clauseId).parents(".card-body"),function(){$(this).addClass('show')})
        clauseId.scrollIntoView();
        if(clauseIndex !== 0){
            clauseIndex--;
        }
    }
}
window.policyArrowNext = function(){

    if(isMapping !== $('.mapping-checkbox').prop("checked")){
        clauseIndex = 0
    }
        isMapping = $('.mapping-checkbox').prop("checked");
        let mappedArr = [];

    if(!isMapping){
        mappedArr = $('.clause.mapped').map(function(idx,item){
            return $(item).attr('id');
        
        });
    }
    else{
        mappedArr = $('.clause.mapped').map(function(idx,item){
            return;
        });
    }

    var clauseId = document.getElementById(mappedArr[clauseIndex]);
    if(clauseId){
        $(".includePolicy").find(".card-body.show").removeClass('show')
        $.each($(clauseId).parents(".card-body"),function(){$(this).addClass('show')})
        clauseId.scrollIntoView();
        if(clauseIndex !== mappedArr.length-1){
            clauseIndex++;
        }
    }       
}