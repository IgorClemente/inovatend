// GET JSON VIA API
$.ajax({
  dataType: "json",
  url: "http://inovatend.mybluemix.net/users/45124712864",
  success: function(res) {
    var arvores = res.arvore_ids;
    var user_firstName = res.usuario["0"].nome;
    var user_lastName = res.usuario["0"].sobrenome;
    var user_fullName = user_firstName + " " + user_lastName;
    var user_cpf = res.usuario["0"].cpf_user;
    var user_localidade = res.usuario["0"].localidade;
    var arvore_id = arvores[0].arvore_id;
    var contador = arvores.length-1;
    // var ultimoCartao = arvores[contador].arvore_id;
    // watsonChangeStatus(ultimoCartao);
    for (var i = 0; i <= arvores.length-1; i++) {
      adicionaCartao(user_fullName, user_cpf, user_localidade, arvore_id);
      arvore_id = arvore_id + 10;
    }
  }
});


function adicionaCartao(nome, cpf, localidade, arvore_id) {

var divCardWatsonStatus = $("<div>Watson: Analisando Imagem...</div>").addClass("card-footer")
                                    .addClass("small")
                                    .addClass('watsonStatus')
                                    .addClass("watsonStatus" + arvore_id)
                                    .css("background-color", "#f1c40f")
                                    .css("color", "white")
                                    .css("text-align", "center")
                                    .css("margin-top", "15px");

var hrCardBody = $("<hr>").addClass("my-0");

var cardMunicipio = $("<span></span>").css("font-size", "0.8rem")
                                      .html("Município: " + localidade);

var cardCpf = $("<span></span>").css("font-size", "0.8rem")
                                .html("CPF: " + cpf)
                                .append("<br>");

var cardName = $("<h6></h6>").addClass("card-title")
                                         .addClass("mb-1")
                                         .css("color", "#007bff")
                                         .html(nome);

var div = $("<div>").append(cardName)
                    .append(cardCpf)
                    .append(cardMunicipio);

var cardBody = $("<div>").addClass("card-body")
                         .append(div)
                         .append(hrCardBody)
                         .append(divCardWatsonStatus);

var image = $("<img>").addClass("card-img-top")
                      .addClass("img-fluid")
                      .addClass("w-100")
                      .css("transform", "rotate(90deg)")
                      .attr("src", "http://inovatend.mybluemix.net/imagensComprimidas/comprimida45124712864" + arvore_id + ".jpg");

var imageLink = $("<a>").append(image);

var divCard = $("<div>").addClass("card")
                        .addClass("mb-3")
                        .addClass("divCardContainer")
                        .append(imageLink)
                        .append(cardBody);

var divCol4 = $("<div>").addClass("col-md-4")
                        .append(divCard);

$("#row-cards").prepend(divCol4); 

}

// function adicionaUltimoCartao(nome, cpf, localidade, ultimoCartao) {

// var divCardWatsonStatus = $("<div>Watson: Imagem em Análise</div>").addClass("card-footer")
//                                     .addClass("small")
//                                     .addClass('watsonStatus')
//                                     .attr("id", "watsonStatus" + ultimoCartao)
//                                     .css("background-color", "#f1c40f")
//                                     .css("color", "white")
//                                     .css("text-align", "center")
//                                     .css("margin-top", "15px");

// var hrCardBody = $("<hr>").addClass("my-0");

// var cardMunicipio = $("<span></span>").css("font-size", "0.8rem")
//                                       .html("Município: " + localidade);

// var cardCpf = $("<span></span>").css("font-size", "0.8rem")
//                                 .html("CPF: " + cpf)
//                                 .append("<br>");

// var cardName = $("<h6></h6>").addClass("card-title")
//                                          .addClass("mb-1")
//                                          .css("color", "#007bff")
//                                          .html(nome);

// var div = $("<div>").append(cardName)
//                     .append(cardCpf)
//                     .append(cardMunicipio);

// var cardBody = $("<div>").addClass("card-body")
//                          .append(div)
//                          .append(hrCardBody)
//                          .append(divCardWatsonStatus);

// var image = $("<img>").addClass("card-img-top")
//                       .addClass("img-fluid")
//                       .addClass("w-100")
//                       .css("transform", "rotate(90deg)")
//                       .attr("src", "http://inovatend.mybluemix.net/imagensComprimidas/comprimida45124712864" + ultimoCartao + ".jpg");

// var imageLink = $("<a>").append(image);

// var divCard = $("<div>").addClass("card")
//                         .addClass("mb-3")
//                         .addClass("divCardContainer")
//                         .append(imageLink)
//                         .append(cardBody);

// var divCol4 = $("<div>").addClass("col-md-4")
//                         .append(divCard);

// $("#row-cards").prepend(divCol4); 

// }

// FUNÇÕES
function watsonChangeStatus(){
  $(".watsonStatus").css("background-color", "red");
  $(".watsonStatus").html("Watson: Imagem Reprovada");
}

window.setTimeout('watsonChangeStatus()', 4000);










