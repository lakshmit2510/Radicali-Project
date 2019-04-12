window.openRegMappingPage = function(regX, regY){ 
    window.open('analyze_reg_mapping.html?regX='+regX+'&regY='+regY, "_self");
}

window.regulationMappingOnload = function(obligationId){

    if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
        document.querySelector("meta[name='is_called']").setAttribute("content", "true");

        let manifest = require('../../../../../webpack/manifest.js');
        
        $.ajax({
            url: manifest.PETER_URL + 'regulation_regulation',

            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
            }, 

            success: function(response){                
                
                let regulationsMappingMetadata = [];

                var mappingTable = $('#regulation-mapping-list').DataTable({
                    data: regulationsMappingMetadata,
                    orderCellsTop: true,
                    columns: [
                        { title: "Regulation X", "orderable": true },
                        { title: "Regulation X Activity", "orderable": true},
                        { title: "Regulation Y", "orderable": false },
                        { title: "Regulation Y Activity", "orderable": false },
                        { title: "Mapping", "orderable": false },
                    ],

                    // initComplete: function () {
                    //     var dropdowncolumnslist =[1,2,3];
                    //     this.api().columns(dropdowncolumnslist).every(function (item) {

                    //         var column = this;
                    //         var select = $('<br/><select style="width:100%"><option value=""></option></select>')
                    //             .appendTo($("#regulation-mapping-list").find("th").eq(column.index()))
                    //             .on('change', function () {
                    //             var val = $.fn.dataTable.util.escapeRegex(
                    //             $(this).val());                                     

                    //             column.search(val ? '^' + val + '$' : '', true, false)
                    //                 .draw();
                    //         });

                    //         column.data().unique().sort().each(function (d, j) {
                    //             select.append('<option value="' + d + '">' + d + '</option>')
                    //         });
                    //     });
                    // }
                    
                });
                
                for (var i in response['data']){

                    let regulationIdX = response['data'][i].regulation_1_id;
                    let regulationIdY = response['data'][i].regulation_2_id;

                    $.ajax({
                        url: manifest.PETER_URL + 'regulation/' + regulationIdX,

                        beforeSend: function(xhr) {
                             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                        }, 

                        success: function(regDataX){             
                            
                            let regTitleX = regDataX.title;
                            let linkX = decodeURIComponent(regDataX.link);
                            let regActivityX = regDataX.activity
                            let regHtmlTextX = "<a target=\"_blank\" href=\'" + linkX + "\'> " + regTitleX + "</a>";

                            $.ajax({
                                url: manifest.PETER_URL + 'regulation/' + regulationIdY,

                                beforeSend: function(xhr) {
                                     xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                                }, 

                                success: function(regDataY){              

                                    let regTitleY = regDataY.title;
                                    let linkY = decodeURIComponent(regDataY.link);
                                    let regActivityY = regDataY.activity
                                    let regHtmlTextY = "<a target=\"_blank\" href=\'" + linkY + "\'> " + regTitleY + "</a>";

                                    let mappingHtml = "<button class=\"btn btn-primary\" onClick=\"openRegMappingPage("+regulationIdX+","+regulationIdY+")\">Analyze</a>"

                                    let mapping = [];

                                    mapping.push(regHtmlTextX);
                                    mapping.push(regActivityX);
                                    mapping.push(regHtmlTextY);
                                    mapping.push(regActivityY);
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
                
                return regulationsMappingMetadata;
            }, 

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
            }  
        })
    }

}
var obligationsIndex = 0;
var isMapping = false;
window.regulationRegXArrowPrev = function(){

    if(isMapping !== $('.reg-mapping-checkbox').prop("checked")){
        obligationsIndex = 0
    }
        isMapping = $('.reg-mapping-checkbox').prop("checked");
        let mappedArr = []
    
    if(!isMapping){
        
        mappedArr = $('.obligation.mappedX').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    else{

        mappedArr = $('.obligation.unmappedX').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    var obligationId = document.getElementById(mappedArr[obligationsIndex]);
    
    if(obligationId){
        $(".includeRegulationX").find(".card-body.show").removeClass('show')
       $.each($(obligationId).parents(".card-body"),function(){$(this).addClass('show')})
        obligationId.scrollIntoView();
        if(obligationsIndex !== 0){
            obligationsIndex--;
        }
        
    } 
}

window.regulationRegXArrowNext = function(){

    if(isMapping !== $('.reg-mapping-checkbox').prop("checked")){
        obligationsIndex = 0
    }

        isMapping = $('.reg-mapping-checkbox').prop("checked");
        let mappedArr = [];

    if(!isMapping){
        mappedArr = $('.obligation.mappedX').map(function(idx,item){
            return $(item).attr('id');
        });
    }
    else{
        mappedArr = $('.obligation.unmappedX').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    var obligationId = document.getElementById(mappedArr[obligationsIndex]);
    if(obligationId){
       $(".includeRegulationX").find(".card-body.show").removeClass('show')
       $.each($(obligationId).parents(".card-body"),function(){$(this).addClass('show')})
        obligationId.scrollIntoView();
        if(obligationsIndex !== mappedArr.length-1){
            obligationsIndex++;
        } 
    }       
}

window.regulationRegYArrowPrev = function(){

    if(isMapping !== $('.reg-mapping-checkbox').prop("checked")){
        obligationsIndex = 0
    }
        isMapping = $('.reg-mapping-checkbox').prop("checked");
        let mappedArr = []
    
    if(!isMapping){
        
        mappedArr = $('.obligation.mappedY').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    else{

        mappedArr = $('.obligation.unmappedY').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    var obligationId = document.getElementById(mappedArr[obligationsIndex]);
    
    if(obligationId){
        $(".includeRegulationY").find(".card-body.show").removeClass('show')
       $.each($(obligationId).parents(".card-body"),function(){$(this).addClass('show')})
        obligationId.scrollIntoView();
        if(obligationsIndex !== 0){
            obligationsIndex--;
        }
        
    } 
}

window.regulationRegYArrowNext = function(){

    if(isMapping !== $('.reg-mapping-checkbox').prop("checked")){
        obligationsIndex = 0
    }

        isMapping = $('.reg-mapping-checkbox').prop("checked");
        let mappedArr = [];

    if(!isMapping){
        mappedArr = $('.obligation.mappedY').map(function(idx,item){
            return $(item).attr('id');
        });
    }
    else{
        mappedArr = $('.obligation.unmappedY').map(function(idx,item){
            return $(item).attr('id');
        })
    }
    var obligationId = document.getElementById(mappedArr[obligationsIndex]);
    if(obligationId){
       $(".includeRegulationY").find(".card-body.show").removeClass('show')
       $.each($(obligationId).parents(".card-body"),function(){$(this).addClass('show')})
        obligationId.scrollIntoView();
        if(obligationsIndex !== mappedArr.length-1){
            obligationsIndex++;
        } 
    }       
}