var obligation = (function() {

    let utils = require('./utils.js')
    var index=-1
    function colorClausesForObligation(obligationId,mappedBtn) {

        let obligationElement = document.getElementById('obl_'+obligationId)
        let mappedClauseIds = obligationElement.getAttribute('mappedclauses')
        let mappedClauseIdsArry= mappedClauseIds.split(',')
        
        if(mappedBtn === 'next'){
            if(index !== mappedClauseIdsArry.length-1){
                index++;
            }
            else{
                index=0;
            }
        }else{
            if(index !== -1){
                index--;
            }
            else{
                index=mappedClauseIdsArry.length-1;
            }
        }
        let linkedClauseTag = 'clause_'+ mappedClauseIdsArry[index]
                
        mappedClauseIdsArry.forEach(function(item){
            clauseId='clause_'+item
            elem = document.getElementById(clauseId)
            
            utils.color(elem);
            utils.colorContainingCards(elem);
        })
        var clauseElement= document.getElementById(linkedClauseTag);
                
        if(clauseElement){

            $(".includePolicy").find(".card-body.show").removeClass('show')
            $.each($(clauseElement).parents(".card-body"),function(){$(this).addClass('show')})
            clauseElement.scrollIntoView();
        }
    }

    function colorObligationsForObligation(obligationId, mappedBtn) {

        var obligationElements = document.getElementById('obl_'+obligationId)

        let mappedObligationIds = obligationElements.getAttribute('mappedobligations')
        let mappedObligationIdsArry= mappedObligationIds.split(',')
        
        if(mappedBtn === 'next'){
            if(index !== mappedObligationIdsArry.length-1){
                index++;
            }
            else{
                index=0;
            }
        }else{
            if(index !== -1){
                index--;
            }
            else{
                index=mappedObligationIdsArry.length-1;
            }
        }
        let linkedObligationTag = 'obl_'+ mappedObligationIdsArry[index]

        mappedObligationIdsArry.forEach(function(item){
            obligationId='obl_'+item
            elem = document.getElementById(obligationId)
            
            utils.color(elem);
            utils.colorContainingCards(elem);
        })
        var obligationElement= document.getElementById(linkedObligationTag);
                
        if(obligationElement){

            $(".includeregulationY").find(".card-body.show").removeClass('show')
            $.each($(obligationElement).parents(".card-body"),function(){$(this).addClass('show')})
            obligationElement.scrollIntoView();
        }
    }

    module.exports = {  
        colorClausesForObligation: colorClausesForObligation,
        colorObligationsForObligation: colorObligationsForObligation,
        
    };

}());