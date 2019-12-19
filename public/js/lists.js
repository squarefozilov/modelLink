$(document).on("submit","#addList",handleListFormSubmit);
getLists();
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

function handleListFormSubmit(event){
    event.preventDefault();

    var symbol = $("#addBarText").val().trim();
    // console.log(symbol);

    $.post("api/list/insert",{
        symbol: symbol
    })
    .then(getLists);
}

function getLists(){
    $.get("/api/list", function(data){
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++){
            console.log(data[i].symbol);
            $.ajax({
                url: "https://financialmodelingprep.com/api/v3/company/profile/" + data[i].symbol,
                method: "GET"
            }).then(function(response){
                console.log(response);
                var companyName = response.profile.companyName;
                var symbol = response.symbol;
                var price = "$" + response.profile.price;
                var changes = "$"+ response.profile.changes;
                var mktCap = d3.format("$,")(parseFloat(response.profile.mktCap));
                var image = response.profile.image;
                
                var cardDiv = $("<div class='card' style='margin-top: 20px;' data-id='"+(i+1)+"'>");
                var cardHeader = $("<div class='card-header'>");
                cardDiv.append(cardHeader);
                cardHeader.append(companyName);
                var row = $("<div class='row no-gutters'>");
                cardDiv.append(row);
                row.append("<div class='col-md-2'><br><img src='"+image+"'></div>");
                var cardText = $("<div class='col-md-7'>");
                row.append(cardText);
                cardText.append("<a href='/company/"+ symbol+"'> <h4 class='card-title'>"+symbol+"</a>");
                cardText.append("<p class='card-text'>Last Price: "+price);
                cardText.append("<p class='card-text'>Changes: "+changes);
                cardText.append("<p class='card-text'>Market Cap: "+mktCap);
                cardText.append("</div>");
                var cardBtn = $("<div class='col-md-3'><br><br>");
                row.append(cardBtn);
                // cardBtn.append("<button class='btn btn-primary' href='/company/"+symbol+"'>Click to see detail</button>");
                cardBtn.append("<button class='btn btn-danger'>Delete from list</button>");
                $("#lists").append(cardDiv);
            })
        }
        // location.reload();
        $("#addBarText").val("");
    })
}

