const AWS = require('aws-sdk')

window.viewPolicy = function(policyId){ 

    var policyPage = window.open('', '_blank');    

    let manifest = require('../../../../../webpack/manifest.js')
    , policyTag = "policy_" + policyId;
    ;
    
    $.ajax({
        url: manifest.PETER_URL + 'policy/' + policyId,

        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
        }, 

        success: function(response){
        
            let policyS3 = response['original_pdf_s3_link'];
            
            AWS.config.update({region: 'ap-southeast-1', credentials: {accessKeyId:manifest.ACCESS_KEY, secretAccessKey: manifest.SECRET_ACCESS_KEY}});
            var s3 = new AWS.S3();

            var params = {Bucket: 'radicali-uploaded-policies', Key: policyS3, Expires: 3600};

            const url = s3.getSignedUrl('getObject', params);

            policyPage.location.href = url;

        }, 

        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
        }  
    })
}

window.loadPolicyById = function(policyId, policyClass, policyTitleClass){
    
    let manifest = require('../../../../../webpack/manifest.js')
    , policyTag = "policy_" + policyId;
    ;
    
    $.ajax({
        url: manifest.PETER_URL + 'policy/' + policyId,

        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
        }, 

        success: function(response){
            
            let policyHtml = response['html_text']
            , policyTitle = response['title']
            ;

            $(policyClass).html(policyHtml);
            $(policyClass).attr("id", policyTag);
            $(policyTitleClass).html(policyTitle);

        }, 

        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
        }
    })
}

window.policyOnload = function() {

    if (document.querySelector("meta[name='is_called']").getAttribute("content") == "false"){
        document.querySelector("meta[name='is_called']").setAttribute("content", "true");
    
        let manifest = require('../../../../../webpack/manifest.js');
        
        $.ajax({
            url: manifest.PETER_URL + 'policy',

            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
            }, 

            success: function(response){
                let policiesMetadata = [];

                for (var i in response['data']){
                    
                    let data = response['data'][i];
                    let policyMetadata = [];


                    policyMetadata.push(data.title);
                    policyMetadata.push(data.activity);
                    policyMetadata.push(data.region);
                    policyMetadata.push(data.id);

                    if (data.parsed == false){
                        policyMetadata.push("Draft");
                    }
                    else{
                        let policyViewHtml = "<button class=\"btn btn-primary\" onClick=\"viewPolicy("+ data.id +")\">View</a>"
                        policyMetadata.push(policyViewHtml);
                    }

                    policiesMetadata.push(policyMetadata);
                }

                var table = $('#policy-list').DataTable({
                    data: policiesMetadata,
                    columns: [
                        { title: "Policy", "orderable": false },
                        { title: "Activity/Risk", "orderable": false },
                        { title: "Region/Country", "orderable": false },
                        { title: "Action", "orderable": false},
                        { title: "View Policy", "orderable": false },
                    ],
                      
                    "columnDefs": [{
                        "targets": 3,
                        "render": function ( data, type, row, meta ) {
                            return `<button type="button" class="policy-edit btn btn-primary" data-policy-id="${data}">Edit</button>`;
                        }
                    }],

                    initComplete: function () {
                        var dropdowncolumnslist =[1,2];
                        this.api().columns(dropdowncolumnslist).every(function () {
                            var column = this;
                            var select = $('<br/><select style="width:50%"><option value=""></option></select>')
                                .appendTo($("#policy-list").find("th").eq(column.index()))
                                .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val());                                     

                                column.search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                            });
                            column.data().unique().sort().each(function (d, j) {
                                select.append('<option value="' + d + '">' + d + '</option>')
                            });
                        })

                    },
                });           

                var policyId
                , simplemde = new SimpleMDE({
                    autofocus: true,
                    hideIcons: ["guide"],
                    spellChecker: false,
                    element: document.getElementById("policy-markdown")
                });

                $('.policy-edit').on('click', function(){
                    
                    policyId = $(this).data('policy-id');

                    simplemde.render();
                    $("#editorModal").focus(function () {
                        simplemde.codemirror.refresh();
                    });

                    $("#editorModal").modal("toggle");

                    $.ajax({
                        url: `${manifest.PETER_URL}policy/${policyId}`,

                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                        }, 
                        dataType: "json",
                        contentType: "application/json",
                        success: function(response){
                            $("#policy-title").val(response.title);
                            $("#policy-activity").val(response.activity);
                            $("#policy-region").val(response.region);
                            let convertedMarkdownText = turndownService.turndown(response.markdown_text);
                            simplemde.value(convertedMarkdownText.toString());
                        }, 
                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
                        },
                    });
                })

                $("#editorModal").on("click", ".save-editor-changes", function(evt) {

                    let policyData = {};

                    policyData["id"] = policyId;
                    policyData["title"] = $("#policy-title").val();
                    policyData["activity"] = $("#policy-activity").val();
                    policyData["region"] = $("#policy-region").val();
                    policyData["markdown_text"] = simplemde.markdown(simplemde.value());

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
                            location.reload();
                        }, 

                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
                        }  
                    });
                });

                var simplemdeCreate = new SimpleMDE({
                    autofocus: true,
                    hideIcons: ["guide"],
                    spellChecker: false,
                    element: document.getElementById("policy-markdown-create")
                });

                $('.policy-create').on('click', function(){

                    simplemdeCreate.render();
                    $("#editorModalCreate").focus(function () {
                        simplemdeCreate.codemirror.refresh();
                    });

                    $("#editorModalCreate").modal("toggle");
                });

                $("#editorModalCreate").on("click", ".save-editor-changes", function(evt) {

                    let policyData = {};

                    policyData["org_id"] = parseInt(localStorage["org_id"]);
                    policyData["title"] = $("#policy-title-create").val();
                    policyData["activity"] = $("#policy-activity-create").val();
                    policyData["region"] = $("#policy-region-create").val();
                    policyData["markdown_text"] = simplemdeCreate.markdown(simplemdeCreate.value());

                    $.ajax({
                        url: manifest.PETER_URL + 'policy',

                        beforeSend: function(xhr) {
                             xhr.setRequestHeader("Authorization", localStorage["PETER_API_KEY"])
                        }, 

                        type: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(policyData),

                        success: function(response){
                            location.reload();
                        }, 

                        error: function(XMLHttpRequest, textStatus, errorThrown) {                 
                            logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
                        }  
                    });
                });

            }, 

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                logoutIfBadToken(XMLHttpRequest.responseJSON.message);    
            }  
        })
    }

}  
window.printPolicy = function() {   

    var doc = new jsPDF();

    doc.fromHTML($('.includePolicy').html(), 15, 15, {'width': 170});
    doc.save('policy.pdf');
};