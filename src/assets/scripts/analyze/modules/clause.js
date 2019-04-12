var clause = (function() {

    let utils = require('./utils.js')
    var index=-1

    function colorObligationsForClause(clauseId, mappedBtn) {

        let clauseElements = document.getElementById('clause_'+ clauseId)
        let mappedObligationIds = clauseElements.getAttribute('mappedobligations')
        let mappedObligationIdsArry= mappedObligationIds.split(',')
        
        if(mappedBtn === 'next'){
            if(index !== mappedObligationIdsArry.length-1){
                index++;
            }
            else{
                index=0;
            }
        }
        else{
            if(index !== -1){
                index--;
            }
            else{
                index=mappedObligationIdsArry.length-1;
            }
        }
        let linkedClauseTag = 'obl_'+ mappedObligationIdsArry[index]
                
        mappedObligationIdsArry.forEach(function(item){
            obligationId='obl_'+item
            elem = document.getElementById(obligationId)
            
            utils.color(elem);
            utils.colorContainingCards(elem);
        })
        var obligationElement= document.getElementById(linkedClauseTag);
                
        if(obligationElement){

            $(".includeRegulation").find(".card-body.show").removeClass('show')
            $.each($(obligationElement).parents(".card-body"),function(){$(this).addClass('show')})
            obligationElement.scrollIntoView();
        }

    }

    
    function colorClausesForClause(clauseId,mappedBtn) {

        let clauseElements = document.getElementById('clause_'+ clauseId)
        let mappedClauseIds = clauseElements.getAttribute('mappedclauses')
        let mappedClauseIdsArry= mappedClauseIds.split(',')
        
        if(mappedBtn === 'next'){
            if(index !== mappedClauseIdsArry.length-1){
                index++;
            }
            else{
                index=0;
            }
        }
        else{
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

            if($(".includePolicyX").find(".card-body.show")){
                 $(".includePolicyY").find(".card-body.show").removeClass('show')
                 $.each($(clauseElement).parents(".card-body"),function(){$(this).addClass('show')})
                 clauseElement.scrollIntoView();
             }
            else{
                $(".includePolicyX").find(".card-body.show").removeClass('show')
                $.each($(clauseElement).parents(".card-body"),function(){$(this).addClass('show')})
                clauseElement.scrollIntoView();
            }
        }
    }
    module.exports = {  
        colorObligationsForClause: colorObligationsForClause,
        colorClausesForClause: colorClausesForClause
    };

}());

