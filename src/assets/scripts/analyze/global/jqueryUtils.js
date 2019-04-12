$(document).ready(function () {

	let manifest = require('../../../../../webpack/manifest')
	let mapping = require('../modules/mapping.js');
	let utils = require('../modules/utils.js');
	const urlParams = new URLSearchParams(window.location.search);
	let policyId = urlParams.get('policy');
	let regId = urlParams.get('regulation');

	$('.editing-checkbox').on('change', function(){

		if(this.checked) {
			$.ajax({
				url: `${manifest.PETER_URL}policy/${policyId}`,

				beforeSend: function(xhr) {
						xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
				}, 
				dataType: "json",
				contentType: "application/json",
				success: function(response){
					$('.includePolicy').html(`<div><button type="button" class="btn btn-primary save-editor-changes" data-dismiss="modal">Save changes</button>
					<textarea placeholder="Enter Note here..." class="form-control" id="policy_editor" ></textarea></div>`)
				
						var simplemdeCreate = new SimpleMDE({
							autofocus: true,
							hideIcons: ["guide"],
							spellChecker: false,
							element: document.getElementById(`policy_editor`),
						});

							let convertedMarkdownText = turndownService.turndown(response.markdown_text);
							simplemdeCreate.value(convertedMarkdownText.toString());
							
							simplemdeCreate.render();
							$("#editorModal").focus(function () {
								simplemdeCreate.codemirror.refresh();
							});
			
					$(".save-editor-changes").on("click", function(evt) {

							let policyData = {};

							policyData["id"] = parseInt(policyId);
							policyData["markdown_text"] = simplemdeCreate.markdown(simplemdeCreate.value());

								$.ajax({
										url: manifest.PETER_URL + 'policy',
		
										beforeSend: function(xhr) {
												xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
										}, 
		
										type: "PUT",
										dataType: "json",
										contentType: "application/json",
										data: JSON.stringify(policyData),
		
										success: function(response){       
											alert("Edited Policy/Note!");
										}, 
		
										error: function(XMLHttpRequest, textStatus, errorThrown) { 
											alert("Error in updating policy");
										}  
								});
						});
				}, 
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
								alert("Error in fetching policy"); 
						},
			});
				
		}
		
		else{
			$('.includePolicy').html('');
			loadPolicyById(policyId, ".includePolicy", ".policy-title");
			mapping.loadRegPolicyMappings(regId,policyId);
		}
	});

	$('.mapping-checkbox').on('change', function(){
		const urlParams = new URLSearchParams(window.location.search);
		
		utils.removeHighlights('obligation');
		utils.removeHighlights('clause');
		utils.removeHighlights('card-link');

	    utils.decolorByClassName("card-link");
	    utils.decolorByClassName("obligation");
	    utils.decolorByClassName("clause");

		if(this.checked) {
			utils.highlightByClassName('unmapped', false);
			utils.highlightContainingCardsByClassName('unmapped', false)
			utils.hideElements('dropdown');
		}

		else{
			utils.highlightByClassName('mapped', true);
			utils.highlightContainingCardsByClassName('mapped', true)
			utils.showElements('dropdown');	
		}

	});

	$('.reg-mapping-checkbox').on('change', function(){
		const urlParams = new URLSearchParams(window.location.search);
		
		utils.removeHighlights('obligation');
		utils.removeHighlights('clause');
		utils.removeHighlights('card-link');

	    utils.decolorByClassName("card-link");
	    utils.decolorByClassName("obligation");
	    utils.decolorByClassName("clause");

		if(this.checked) {
			utils.highlightByClassName('unmappedX', false);
			utils.highlightContainingCardsByClassName('unmappedX', false)
			utils.hideElements('dropdown');
			utils.highlightByClassName('unmappedY', false);
			utils.highlightContainingCardsByClassName('unmappedY', false)
			utils.hideElements('dropdown');
		}

		else{
			utils.highlightByClassName('mappedX', true);
			utils.highlightContainingCardsByClassName('mappedX', true)
			utils.showElements('dropdown');	
			utils.highlightByClassName('mappedY', true);
			utils.highlightContainingCardsByClassName('mappedY', true)
			utils.showElements('dropdown');
		}

	});
});
