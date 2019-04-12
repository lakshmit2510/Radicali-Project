window.compareMappedElements = function(elementId, isReg, compareWithPolicy, mappedBtn) {

    isReg = $.parseJSON(isReg)
    compareWithPolicy = $.parseJSON(compareWithPolicy)

    if (isReg){
        obligationClick(elementId, compareWithPolicy, mappedBtn)
    }
    else{
        clauseClick(elementId, compareWithPolicy, mappedBtn)
    }
}

window.popupMappedElements = function(entityId, entityText, isReg, compareWithPolicy) {
    
    isReg = $.parseJSON(isReg)
    compareWithPolicy = $.parseJSON(compareWithPolicy)
    
    if (isReg && compareWithPolicy){  //RP
        popupForMappedObligationClause(entityId, entityText)
    }
    else if (isReg && !compareWithPolicy){ //RR 
        popupForMappedObligationObligation(entityId, entityText)
    } 
    else if (!isReg && compareWithPolicy){ // PP
        popupForMappedClauseClause(entityId, entityText)
    }    
    else if (!isReg && !compareWithPolicy){ // PR
        popupForMappedClauseObligation(entityId, entityText)
    }
}