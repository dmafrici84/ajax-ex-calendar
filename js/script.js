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
    stampaMese();
    stampaFeste();
  }

  function stampaMese() {
    var meseTmplete = $("#template-mese").html();
    var compiled = Handlebars.compile(meseTmplete)
    var gioniMeseTarget= $("#giorni-mese");
    var meseCorrente = moment("2018-01-01");
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

  function stampaFeste(){
    var meseCorrente = moment("2018-01-01");
    var anno = meseCorrente.year();
    console.log(anno);
    var mese = meseCorrente.month();
    console.log(mese);

      $.ajax({
        url: "https://flynn.boolean.careers/exercises/api/holidays",
        method: "GET",
        data:{
          "year": anno,
          "month": mese
        },
        success: function(data, state) {
          console.log(data);
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
