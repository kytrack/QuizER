var objektumok = []; // A globális hatókörben deklarált objektumok változó

// Egy függvény, ami feldolgozza a beolvasott sorokat és objektumokká alakítja őket
function feldolgozSorokat(sorok) {
    var objektumok = [];

    sorok.forEach(function(sor) {
        var adatok = sor.split(';'); // A sor felosztása a ; mentén

        // Az objektum létrehozása a sor adatok alapján
        var obj = {
            tétel: adatok[0],
            esemény: adatok[1],
            időpont: adatok[2],
            képek: adatok.slice(3) // A képeket tartalmazó rész
        };

        objektumok.push(obj); // Az objektum hozzáadása a tömbhöz
    });

    return objektumok;
}

var legorudlolista = document.getElementById("temaValasztas");
var tartoDiv = document.getElementById("opciok");
var eddigiElemek = [];

// Fájl beolvasása és feldolgozása
document.getElementById("fileInput").addEventListener('change', function(event) {
    while ( legorudlolista.firstChild) {
        legorudlolista.removeChild(legorudlolista.firstChild);
    }
    objektumok=[];

    var file = event.target.files[0]; // az első kiválasztott fájl
    var reader = new FileReader(); // FileReader példány létrehozása

    reader.onload = function(event) {
        var contents = event.target.result; // beolvasott tartalom
        var sorok = contents.split('\n'); // sorok felosztása

        // Beolvasott sorok feldolgozása objektumokká
        objektumok = feldolgozSorokat(sorok);
        console.log(objektumok); // objektumok kiírása a konzolra





        
        objektumok.forEach(x => {
            if (!eddigiElemek.includes(x.tétel)) {
                var opt = document.createElement("option");
                opt.value = x.tétel;
                opt.innerHTML = x.tétel;
                legorudlolista.appendChild(opt);
                eddigiElemek.push(x.tétel);
            }
        });
    };

    // A fájl beolvasása a fájlrendszerből
    
    reader.readAsText(file);
});







var jatekFolyamatban = false; // Jelzi, hogy a játék éppen fut-e
var marMegvalaszoltKerdesek = []; // Tömb a már megválaszolt kérdések nyomon követéséhez
var pontok = 0; // A pontok száma

document.getElementById("quizStart").addEventListener("click", function() {
    if (!jatekFolyamatban) {
        document.getElementById("temavalaszodiv").style.display = "none";
        
        tartoDiv.innerHTML = "";

        var valasztott = document.getElementById("temaValasztas").value;
        if (valasztott != null) {
            var valasztottlista = [];
            objektumok.forEach(function(x) {
                if (valasztott == x.tétel) {
                    valasztottlista.push(x);
                }
            });

            var kerdesek = valasztottlista.filter(function(kerdes) {
                return !marMegvalaszoltKerdesek.includes(kerdes);
            });

            if (kerdesek.length > 0) {
                jatekFolyamatban = true;
                var randomszam = Math.floor(Math.random() * kerdesek.length);
                var kerdes = kerdesek[randomszam];
                marMegvalaszoltKerdesek.push(kerdes);

                document.getElementById("kerdes").innerHTML = kerdes.esemény + "?";

                kerdes.képek.forEach(function(kep) {
                    // Képek megjelenítése stb.
                });

                valasztottlista.forEach(function(x) {
                    var valaszdiv = document.createElement("div");
                    valaszdiv.value = x.időpont;
                    valaszdiv.innerHTML = x.időpont;

                    valaszdiv.addEventListener("click", function(y) {
                        if (y.target.innerHTML == kerdes.időpont) {
                            console.log("helyes");
                            pontok++;
                        } else {
                            console.log("helytelen");
                            console.log(y.target.innerHTML);
                            console.log(kerdes.időpont);
                        }

                        // Új kérdés generálása
                        setTimeout(function() {
                            if (marMegvalaszoltKerdesek.length == valasztottlista.length) {
                                console.log("Pontok: " + pontok);
                                tartoDiv.innerHTML="";
                                document.getElementById("kerdes").innerHTML = "Pontjaid: " + valasztottlista.length+"/"+pontok;
                          
                                jatekFolyamatban = false;

                                var ujratoltoGomb = document.createElement("button");
                                ujratoltoGomb.innerHTML = "Oké";
                                ujratoltoGomb.addEventListener("click", function() {
                                    location.reload();                  
                                    var ujElem = document.createElement("div");
                                    ujElem.innerHTML = "Új elem hozzáadva dinamikusan!";
                                    tartoDiv.appendChild(ujElem);
                                });
                                tartoDiv.appendChild(ujratoltoGomb);

                            } else {
                                var randomszam = Math.floor(Math.random() * kerdesek.length);
                                var kerdes = kerdesek[randomszam];
                                marMegvalaszoltKerdesek.push(kerdes);
                                document.getElementById("kerdes").innerHTML = kerdes.esemény + "?";
                            }
                        }, 1); // Időzítés az új kérdés megjelenítéséhez (például 1 másodperc)
                    });

                    tartoDiv.appendChild(valaszdiv);
                });
            } else {
                console.log("Nincs több kérdés!");
            }
        }
    }
});
