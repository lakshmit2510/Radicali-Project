window.openPolicyMappingPage = function(policyX, policyY){	
	window.open('analyze_policy_mapping.html?policyX='+policyX+'&policyY='+policyY, "_self");
}
window.policyMappingOnload = function() {

    if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
        document.querySelector("meta[name='is_called']").setAttribute("content", "true");
    
        let manifest = require('../../../../../webpack/manifest.js');
        
        $.ajax({
            url: manifest.PETER_URL + 'policy_policy',

            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
            }, 

            success: function(response){
                
                let policiesMappingMetadata = [];

                var mappingTable = $('#policy-mapping-list').DataTable({
                    data: policiesMappingMetadata,
                    columns: [
                        { title: "Policy X", "orderable": false },
                        { title: "Policy Y", "orderable": false },
                        { title: "Mapping", "orderable": false },
                    ],

                    // initComplete: function () {
                    //     var dropdowncolumnslist =[1,2,3];
                    //     this.api().columns(dropdowncolumnslist).every(function () {
                    //         var column = this;
                    //         var select = $('<br/><select style="width:50%"><option value=""></option></select>')
                    //             .appendTo($("#policy-mapping-list").find("th").eq(column.index()))
                    //             .on('change', function () {
                    //             var val = $.fn.dataTable.util.escapeRegex(
                    //             $(this).val());                                     

                    //             column.search(val ? '^' + val + '$' : '', true, false)
                    //                 .draw();
                    //         });
                    //         column.data().unique().sort().each(function (d, j) {
                    //             select.append('<option value="' + d + '">' + d + '</option>')
                    //         });
                    //     })

                    // },
                });     
                
                for (var i in response['data']){

                    let policyIdX = response['data'][i].policy_1_id;
                    let policyIdY = response['data'][i].policy_2_id;

                    $.ajax({
                        url: manifest.PETER_URL + 'policy/' + policyIdX,

                        beforeSend: function(xhr) {
                             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                        }, 

                        success: function(policyDataX){             
                            
                            let policyTitleX = policyDataX.title;

                            $.ajax({
                                url: manifest.PETER_URL + 'policy/' + policyIdY,

                                beforeSend: function(xhr) {
                                     xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                                }, 

                                success: function(policyDataY){              

                                    let policyTitleY = policyDataY.title;
                                    
                                    let mappingHtml = "<button class=\"btn btn-primary\" onClick=\"openPolicyMappingPage("+policyIdX+","+policyIdY+")\">Analyze</a>"

                                    let mapping = [];

                                    mapping.push(policyTitleX);
                                    mapping.push(policyTitleY);
                                    mapping.push(mappingHtml);

                                    mappingTable.row.add(mapping).draw( false );
                                },

                                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                                    //
                                }  

                            }) 

                        },

                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            //
                        }  
                    })      
                }

                return policiesMappingMetadata;
            }, 

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
            }  
        })
    }

}  
var clauseIndex = 0;

window.policyXArrowPrev = function(){

        
        let mappedArr = []
        
        mappedArr = $('.clause.mappedX').map(function(idx,item){
            return $(item).attr('id');
        })

    var clauseId = document.getElementById(mappedArr[clauseIndex]);
    
    if(clauseId){
        $(".includePolicyX").find(".card-body.show").removeClass('show')
       $.each($(clauseId).parents(".card-body"),function(){$(this).addClass('show')})
       clauseId.scrollIntoView();
        if(clauseIndex !== 0){
            clauseIndex--;
        }
        
    } 
}

window.policyXArrowNext = function(){

        
        let mappedArr = [];

        mappedArr = $('.clause.mappedX').map(function(idx,item){
            return $(item).attr('id');
        })
    
    var clauseId = document.getElementById(mappedArr[clauseIndex]);
    if(clauseId){
       $(".includePolicyX").find(".card-body.show").removeClass('show')
       $.each($(clauseId).parents(".card-body"),function(){$(this).addClass('show')})
       clauseId.scrollIntoView();
        if(clauseIndex !== mappedArr.length-1){
            clauseIndex++;
        } 
    }       
}

window.policyYArrowPrev = function(){

        
    let mappedArr = []
    
    mappedArr = $('.clause.mappedY').map(function(idx,item){
        return $(item).attr('id');
    })

var clauseId = document.getElementById(mappedArr[clauseIndex]);

if(clauseId){
    $(".includePolicyY").find(".card-body.show").removeClass('show')
   $.each($(clauseId).parents(".card-body"),function(){$(this).addClass('show')})
   clauseId.scrollIntoView();
    if(clauseIndex !== 0){
        clauseIndex--;
    }
    
} 
}

window.policyYArrowNext = function(){

    
    let mappedArr = [];

    mappedArr = $('.clause.mappedY').map(function(idx,item){
        return $(item).attr('id');
    })

var clauseId = document.getElementById(mappedArr[clauseIndex]);
if(clauseId){
   $(".includePolicyY").find(".card-body.show").removeClass('show')
   $.each($(clauseId).parents(".card-body"),function(){$(this).addClass('show')})
   clauseId.scrollIntoView();
    if(clauseIndex !== mappedArr.length-1){
        clauseIndex++;
    } 
}       
}