window.loadRegulationById = function(regId, regulationClass, regulationTitleClass){

    let manifest = require('../../../../../webpack/manifest.js');

    $.ajax({
        url: manifest.PETER_URL + 'regulation/' + regId,

        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
        }, 

        success: function(response){                

            let regHtml = response.html_text
            , regTitle = response.title
            , regTag = "regulation_" + regId;
            ;

            $(regulationClass).html(regHtml);
            $(regulationClass).attr("id", regTag);

            $(regulationTitleClass).html(regTitle);

        }, 

        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
        }  
    })
}

window.openRegResearchPage = function(regId){ 
    window.open('regulation_research.html?regulation='+regId, "_self");
}

window.regulationOnload = function(obligationId){

    if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
        document.querySelector("meta[name='is_called']").setAttribute("content", "true");

        let manifest = require('../../../../../webpack/manifest.js');
        
        $.ajax({
            url: manifest.PETER_URL + 'regulation',

            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
            }, 

            success: function(response){                
                
                let regulationsMetadata = [];

                for (var i in response['data']){

                    let regulationMetadata = [];

                    data = response['data'][i]

                    let regId = data.id;
                    let title = data.title;
                    let link = decodeURIComponent(data.link);
                    let htmlText = "<a target=\"_blank\" href=\'" + link + "\'> " + title + "</a>";
                    let regAnalyzeHtml = ""

                    if (data.parsed == true){
                        regAnalyzeHtml = "<button class=\"btn btn-primary\" onClick=\"openRegResearchPage(" + regId + ")\">Research</a>"
                    }

                    regulationMetadata.push(htmlText);
                    regulationMetadata.push(data.date);
                    regulationMetadata.push(data.country);
                    regulationMetadata.push(data.regulator);
                    regulationMetadata.push(data.activity);
                    regulationMetadata.push(data.document_type);
                    regulationMetadata.push(regAnalyzeHtml)

                    regulationsMetadata.push(regulationMetadata);
                }

                var table = $('#regulation-list').DataTable({
                    data: regulationsMetadata,
                    orderCellsTop: true,
                    // bSortCellsTop: true,
                    columns: [
                        { title: "Regulation", "orderable": true },
                        { title: "Date", "orderable": true},
                        { title: "Country", "orderable": false },
                        { title: "Regulator", "orderable": false },
                        { title: "Activity", "orderable": false },
                        { title: "Document Type", "orderable": false },
                        { title: "Analyze", "orderable": false },
                      ],
                      columnDefs: [
                        { "width": "14%", "targets": 0 },
                        { "width": "14%", "targets": 1,"render": function ( data, type, row ) {
                           if(data){
                               const dateArr = data.split(' ');
                               return dateArr[0];
                           }
                            return data;
                        }, },
                        { "width": "14%", "targets": 2 },
                        { "width": "14%", "targets": 3 },
                        { "width": "14%", "targets": 4 },
                        { "width": "14%", "targets": 5 },  
                        { "width": "16%", "targets": 6 },
                    ],
                      initComplete: function () {
                          var dropdowncolumnslist =[2,3,4,5];
                        this.api().columns(dropdowncolumnslist).every(function (item) {
                        
                            var column = this;
                            var select = $('<br/><select style="width:100%"><option value=""></option></select>')
                                .appendTo($(".display").find("th").eq(column.index()))
                                .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val());                                     

                                column.search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                            });

                            column.data().unique().sort().each(function (d, j) {
                                select.append('<option value="' + d + '">' + d + '</option>')
                            });
                        });
                    }
                    
                });
                
                
                return regulationsMetadata;
            }, 

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                logoutIfBadToken(XMLHttpRequest.responseJSON.message);
            }  
        })
    }

}
var obligationsIndex = 0;
var isMapping = false;
window.regulationResearchArrowPrev = function(){

        
        let mappedArr = []
        
        mappedArr = $('.obligation').map(function(idx,item){
            return $(item).attr('id');
        })

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

window.regulationResearchArrowNext = function(){

        
        let mappedArr = [];

        mappedArr = $('.obligation').map(function(idx,item){
            return $(item).attr('id');
        })
    
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