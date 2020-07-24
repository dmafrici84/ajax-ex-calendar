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
    clickPrcedente(meseCorrente);
  }

  function stampaMese(mese) {
    var meseTemplete = $("#template-mese").html();
    var compiled = Handlebars.compile(meseTemplete);
    var giorniMeseTarget= $(".riga");
    var numGiorniMese = mese.daysInMonth();
    giorniMeseTarget.html("");
    for (var i = 1; i <= numGiorniMese; i++) {
      var giornoData = moment({year:mese.year(), month:mese.month(), day:i});
      var meseHtml = compiled({
        "data": giornoData.format("YYYY-MM-DD"),
        "giorno": i
      });
      giorniMeseTarget.append(meseHtml);
    }
  }

  function stampaTitolo(mese) {
    var titoloTemplete = $("#template-titolo").html();
    var compiled = Handlebars.compile(titoloTemplete);
    var titoloTarget= $("#titolo");
    titoloTarget.html("");
    var titoloHtml = compiled({
      "anno":mese.year(),
      "mese":mese.format("MMMM").toLocaleUpperCase()
    });
    titoloTarget.append(titoloHtml);
  }

  function stampaFeste(mese) {
    var anno = mese.year();
    var mese = mese.month();
      $.ajax({
        url: "https://flynn.boolean.careers/exercises/api/holidays",
        method: "GET",
        data:{
          "year": anno,
          "month": mese
        },
        success: function(data, state) {
          var allarme = $(".dati-inesistenti");
          allarme.addClass("invisibile");
          var contenitore = $(".contenitore");
          contenitore.removeClass("invisibile");

          var success = data["success"];
          var feste = data["response"];

          if (success) {
            for (var i = 0; i < feste.length; i++) {
              var elemento = $(".riga div[data-id='"+feste[i]["date"]+"']");
              elemento.addClass("feste");
              elemento.append(feste[i]["name"]);
            }
          } else {
            allarme.removeClass("invisibile");
            contenitore.addClass("invisibile");
            if ( anno === 2019) {
              $(".successivo").addClass("invisibile");
            } else if (anno === 2017) {
              $(".precedente").addClass("invisibile");
            }
          }
        },
        error: function(request, state, error) {
          console.log("request",request);
          console.log("state",state);
          console.log("error",error);
        }
      });
  }

  function clickSuccessivo(mese) {
    var successivo = $(".successivo");
    successivo.click(function() {
      $(".precedente").removeClass("invisibile");
      var meseSuccessivo = mese.add(1, "month");

      stampaMese(meseSuccessivo);
      stampaTitolo(meseSuccessivo);
      stampaFeste(meseSuccessivo);
    });
  }

  function clickPrcedente(mese) {
    var precedente = $(".precedente");
    precedente.click(function() {
      $(".successivo").removeClass("invisibile");
      var mesePrecedente = mese.subtract(1, "month");

      stampaMese(mesePrecedente);
      stampaTitolo(mesePrecedente);
      stampaFeste(mesePrecedente);
    });
  }
