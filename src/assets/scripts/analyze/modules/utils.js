var utils = (function() {

	let attentionColor = "red";
	let unmappedColor = "orange";
	let highlightColor = "yellow";
	let defaultColor = "grey";
	let transparentColor = "transparent";

	function color(element){
		element.style.color = attentionColor;
	}

	function highlight(element, isMapped){
		if (isMapped){
			element.style.backgroundColor = highlightColor;
		}
		else{
			element.style.backgroundColor = unmappedColor;
		}
	}

	function decolor(element, isMapped){
		element.style.color = defaultColor;
	}

	function removeColor(element){
		element.style.removeProperty("color");
	}

	function dehighlight(element){
		element.style.backgroundColor = transparentColor;
	}

	function findCardDiv(div){

		href = "#" + div.id;
		query = "a[href=\'" + href + "\']";
		return document.querySelector(query);

	}

	function findSectionCard(element){

		sectionContent = element.parentNode.parentNode; 
		sectionCard = findCardDiv(sectionContent);

		return sectionCard;
	}

	function colorContainingCards(element){

		subsectionContent = element.parentNode;
		subsectionCard = findCardDiv(subsectionContent)

		if (subsectionCard != null){
			// Found a subsection-card

			color(subsectionCard)

			sectionCard = findSectionCard(subsectionCard);
			if (sectionCard != null){
				color(sectionCard);
			}	
		}
		else{
			// The element doesn't belong to a subsection-card
			sectionCard = findSectionCard(element);
			if (sectionCard != null){
				color(sectionCard);
			}
		}
	}

	function highlightContainingCards(element, is_mapped){

		subsectionContent = element.parentNode;
		subsectionCard = findCardDiv(subsectionContent)

		if (subsectionCard != null){
			// Found a subsection-card

			highlight(subsectionCard, is_mapped)

			sectionCard = findSectionCard(subsectionCard);
			if (sectionCard != null){
				highlight(sectionCard, is_mapped);
			}	
		}
		else{
			// The element doesn't belong to a subsection-card
			sectionCard = findSectionCard(element);
			if (sectionCard != null){
				highlight(sectionCard, is_mapped);
			}
		}
	}
	function highlightContainingCardsByClassName(className, isMapped){
	    var elementsDiv = document.getElementsByClassName(className);

		for (var i = 0, len = elementsDiv.length; i < len; i++) {
			highlightContainingCards(elementsDiv[i], isMapped);
		};		
	}

	function decolorByClassName(className, isMapped){

		var elementsDiv = document.getElementsByClassName(className);
		for (var i = 0, len = elementsDiv.length; i < len; i++) {
			decolor(elementsDiv[i], isMapped);
		};
	}

	function removeHighlights(className){
	    var elementsDiv = document.getElementsByClassName(className);

		for (var i = 0, len = elementsDiv.length; i < len; i++) {
			dehighlight(elementsDiv[i]);
		};		
	}

	function highlightByClassName(className, isMapped){
	    var elementsDiv = document.getElementsByClassName(className);

		for (var i = 0, len = elementsDiv.length; i < len; i++) {
			highlight(elementsDiv[i], isMapped);
		};		
	}

	function removeColorPropertyByClassName(className){
	    var elementsDiv = document.getElementsByClassName(className);

		for (var i = 0, len = elementsDiv.length; i < len; i++) {
			removeColor(elementsDiv[i]);
		};		
	}
	function hideElements(className){
	    var elementsDiv = document.getElementsByClassName(className);

		for (var i = 0, len = elementsDiv.length; i < len; i++) {
			elementsDiv[i].style.display = "none";
		};	

	}
	function showElements(className){
	    var elementsDiv = document.getElementsByClassName(className);

		for (var i = 0, len = elementsDiv.length; i < len; i++) {
			elementsDiv[i].style.display = "block";
		};	

	}
	function disableMappingMode(){

    	removeHighlights("card-link");
    	removeColorPropertyByClassName("card-link");
    	
    	removeHighlights("obligation");
    	decolorByClassName("obligation");

    	removeHighlights("clause");
		decolorByClassName("clause");
		
    	hideElements("circle-button");
	}	

	function getButtonHtml(elementId, elementText, isReg, compareWithPolicy){

		var dropDownBtn = document.createElement('div');
		dropDownBtn.className = 'dropdown';
		
		dropDownBtn.innerHTML = 
		`<button id="btnGroupDrop1" type="button" class="btn btn-info btn-sm" aria-haspopup="true" aria-expanded="false" >
		
		<a onclick='popupMappedElements("${elementId}", "${elementText}", "${isReg}", "${compareWithPolicy}")';event.preventDefault();>View Mapped </a>
		</button>
		<button type="button" class="btn btn-info btn-sm" onclick='compareMappedElements("${elementId}", "${isReg}", "${compareWithPolicy}", "prev")';event.preventDefault();>
		<span class="ti-arrow-left"></span>
		</button>
		<button type="button" class="btn btn-info btn-sm" onclick='compareMappedElements("${elementId}", "${isReg}", "${compareWithPolicy}", "next")';event.preventDefault(); >
			<span class="ti-arrow-right"></span>
		</button>` 

		
		return dropDownBtn;
	}
	module.exports = {  
		color: color,
		highlight: highlight,
		removeHighlights: removeHighlights,
		colorContainingCards: colorContainingCards,
		highlightByClassName: highlightByClassName,
		highlightContainingCards: highlightContainingCards,
		decolorByClassName: decolorByClassName,
		disableMappingMode: disableMappingMode,
		hideElements: hideElements,
		showElements: showElements,
		highlightContainingCardsByClassName: highlightContainingCardsByClassName,
		getButtonHtml: getButtonHtml
	};

}());