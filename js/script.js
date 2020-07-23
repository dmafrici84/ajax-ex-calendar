// JSNACK-24
// Creiamo un calendario dinamico con le festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull'API).
// Milestone 1
// Creiamo il mese di Gennaio, e con la chiamata all'API inseriamo le festività.
// Milestone 2
// Diamo la possibilità di cambiare mese, gestendo il caso in cui l'API non possa ritornare festività.
// Attenzione!
// Ogni volta che cambio mese dovrò:
// Controllare se il mese è valido (per ovviare al problema che l'API non carichi holiday non del 2018)
// Controllare quanti giorni ha il mese scelto formando così una lista
// Chiedere all'api quali sono le festività per il mese scelto
// Evidenziare le festività nella lista


$(document).ready(init);

// FUNZIONI
  function init(){
    var meseCorrente = moment("2018-01-01");
    stampaMese(meseCorrente);
    stampaTitolo(meseCorrente);
    stampaFeste(meseCorrente);
    clickSuccessivo(meseCorrente);
    clickPrcedente(meseCorrente)
  }

  function stampaMese(meseCorrente) {
    var meseTemplete = $("#template-mese").html();
    var compiled = Handlebars.compile(meseTemplete)
    var gioniMeseTarget= $("#giorni-mese");
    var numGiorniMese = meseCorrente.daysInMonth();
    console.log(numGiorniMese);
    gioniMeseTarget.html("");
    for (var i = 1; i <= numGiorniMese; i++) {
      var giornoData = moment({year:meseCorrente.year(), month:meseCorrente.month(), day:i});
      var meseHtml = compiled({
        "data":giornoData.format("YYYY-MM-DD"),
        "value":i
      });
      gioniMeseTarget.append(meseHtml);
    }

  }

  function stampaTitolo(meseCorrente) {
    var titoloTemplete = $("#template-titolo").html();
    var compiled1 = Handlebars.compile(titoloTemplete)
    var titoloTarget= $("#titolo");
    titoloTarget.html("");
    var titoloHtml = compiled1({
      "anno":meseCorrente.year(),
      "mese":meseCorrente.format("MMMM")
    });
    titoloTarget.append(titoloHtml);
  }

  function stampaFeste(meseCorrente){

    var anno = meseCorrente.year();
    var mese = meseCorrente.month();

      $.ajax({
        url: "https://flynn.boolean.careers/exercises/api/holidays",
        method: "GET",
        data:{
          "year": anno,
          "month": mese
        },
        success: function(data, state) {
          console.log(data);
          var dato = $(".dati-inesistenti");
          dato.addClass("invisibile");
          var contenitore = $(".contenitore");
          contenitore.removeClass("invisibile");
          var success = data["success"];
          var feste = data["response"];
          console.log(feste);
          if (success) {
            for (var i = 0; i < feste.length; i++) {
              var elemento = $("#giorni-mese li[data-id='"+feste[i]["date"]+"'] ");
              elemento.addClass("feste");
              elemento.append(" - " + feste[i]["name"]);
            }
          } else {
            dato.removeClass("invisibile");
            var contenitore = $(".contenitore");
            contenitore.addClass("invisibile");
            console.log("errore");
          }

        },
        error: function(request, state, error) {
          console.log("request",request);
          console.log("state",state);
          console.log("error",error);
        }
      });
  }

  function clickSuccessivo(meseCorrente) {
    var successivo = $(".fa-angle-right");
    successivo.click(function() {

      var meseSuccessivo = meseCorrente.add(1, "month");

      stampaMese(meseSuccessivo);
      stampaTitolo(meseSuccessivo);
      stampaFeste(meseSuccessivo);
    });
  }

  function clickPrcedente(meseCorrente) {
    var successivo = $(".fa-angle-left");
    successivo.click(function() {

      var mesePrecedente = meseCorrente.subtract(1, "month");

      stampaMese(mesePrecedente);
      stampaTitolo(mesePrecedente);
      stampaFeste(mesePrecedente);
    });
  }
