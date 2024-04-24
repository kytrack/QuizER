var objektumok = []; // Globális változó az objektumoknak

function feldolgozSorokat(sorok) {
    var objektumok = [];
    sorok.forEach(function(sor) {
        var adatok = sor.split(';');
        var obj = {
            tétel: adatok[0],
            esemény: adatok[1],
            időpont: adatok[2],
            képek: adatok.slice(3)
        };
        objektumok.push(obj);
    });


    
    return objektumok;
}

var legorudlolista = document.getElementById("temaValasztas");
var tartoDiv = document.getElementById("opciok");
var eddigiElemek = [];

var valasztottlista = [];


document.getElementById("fileInput").addEventListener('change', function(event) {
    while (legorudlolista.firstChild) {
        legorudlolista.removeChild(legorudlolista.firstChild);
    }
    objektumok = [];
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var contents = event.target.result;
        var sorok = contents.split('\n');
        objektumok = feldolgozSorokat(sorok);
        objektumok.forEach(x => {
            if (!eddigiElemek.includes(x.tétel)) {
                var opt = document.createElement("option");
                opt.value = x.tétel;
                opt.innerHTML = x.tétel;
                legorudlolista.appendChild(opt);
                eddigiElemek.push(x.tétel);
            }
        });

        // Feltöltjük a valasztottlista-t a fájlból beolvasott objektumokkal
        var valasztott = document.getElementById("temaValasztas").value;
        if (valasztott) {
            valasztottlista = objektumok.filter(x => x.tétel === valasztott);
        }
    };
    reader.readAsText(file);
});

// A legördülő lista változtatásának figyelése és a valasztottlista frissítése
legorudlolista.addEventListener("change", e => {
    var valasztott = document.getElementById("temaValasztas").value;
    valasztottlista = []; // Ürítjük a listát minden változtatásnál

    if (valasztott) {
        valasztottlista = objektumok.filter(x => x.tétel === valasztott);
    }
    console.log(valasztottlista.length);
});

var rosszvalaszok=[];

function addRosszValasz(kerdes, rosszValasz, helyesValasz) {
    rosszvalaszok.push({
        kerdes: kerdes,
        rosszValasz: rosszValasz,
        helyesValasz: helyesValasz
    });
}


var quiz = {
    data: [],
    hWrap: null,
    hQn: null,
    hAns: null,
    now: 0,
    score: 0,

    init: () => {
        quiz.hWrap = document.getElementById("quizWrap");
        quiz.hQn = document.createElement("div");
        quiz.hQn.id = "quizQn";
        quiz.hWrap.appendChild(quiz.hQn);
        quiz.hAns = document.createElement("div");
        quiz.hAns.id = "quizAns";
        quiz.hWrap.appendChild(quiz.hAns);
        quiz.draw();
    },

    draw: () => {
        quiz.hQn.innerHTML = quiz.data[quiz.now].q;
        quiz.hAns.innerHTML = "";
        for (let i in quiz.data[quiz.now].o) {
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "quiz";
            radio.id = "quizo" + i;
            quiz.hAns.appendChild(radio);
            let label = document.createElement("label");
            label.innerHTML = quiz.data[quiz.now].o[i];
            label.setAttribute("for", "quizo" + i);
            label.dataset.idx = i;
            label.addEventListener("click", () => { quiz.select(label); });
            quiz.hAns.appendChild(label);
        }
        document.getElementById("kep1").src="images/"+quiz.data[quiz.now].i[0];
        document.getElementById("kep2").src="images/"+quiz.data[quiz.now].i[1];
        document.getElementById("kep3").src="images/"+quiz.data[quiz.now].i[2];
        console.log(quiz.data[quiz.now].i[1]);

    },

    select: option => {
        let all = quiz.hAns.getElementsByTagName("label");
        for (let label of all) {
            label.removeEventListener("click", quiz.select);
        }
        
        let correct = option.dataset.idx == quiz.data[quiz.now].a;
        if (correct) {
            quiz.score++;
            option.classList.add("correct");
        } else {
            option.classList.add("wrong");
            addRosszValasz(quiz.data[quiz.now].q, option.innerHTML, quiz.data[quiz.now].o[quiz.data[quiz.now].a]);
            //console.log(quiz.data[quiz.now].q);
            //console.log(option.innerHTML);
            //console.log(quiz.data[quiz.now].o[quiz.data[quiz.now].a]);
        }
        
        quiz.now++;
        setTimeout(() => {
            if (quiz.now < quiz.data.length) {
                quiz.draw();
            } else {
                quiz.hQn.innerHTML = `${quiz.score} válaszod volt helyes a ${quiz.data.length}-ből.`;
                quiz.hAns.innerHTML = "";
                document.getElementById("btnquiz").style.display = "block";
                document.getElementById("kepekDiv").style.display = "none";
                document.getElementById("kepekCheckbox").style.display="none";
        
                // Új div létrehozása a rossz válaszoknak
                let rosszvalaszokDiv = document.createElement("div");
                rosszvalaszokDiv.id = "rosszvalaszok";
                document.body.appendChild(rosszvalaszokDiv);
        



                for (let i = 0; i < rosszvalaszok.length; i++) {
                    let rosszvalaszDiv = document.createElement("div");
                    let kerdes = rosszvalaszok[i].kerdes;
                    let rosszvalasz = rosszvalaszok[i].rosszValasz;
                    let helyesvalasz = rosszvalaszok[i].helyesValasz;
                    rosszvalaszDiv.innerHTML = `Kérdés: ${kerdes}<br>Rosszválasz: ${rosszvalasz}<br>Helyesválasz: ${helyesvalasz}`;
                    rosszvalaszokDiv.appendChild(rosszvalaszDiv);
                }



            }
        }, 1000);
    },

    reset: () => {
        quiz.now = 0;
        quiz.score = 0;
        quiz.draw();
    },

    // Új metódus az adat hozzáadására
    addQuestion: (question, options, correctIndex,images) => {
        quiz.data.push({
            q: question,
            o: options,
            a: correctIndex,
            i: images
        });
    }
};



// A kérdések és válaszlehetőségek hozzáadása

document.getElementById("quizStart").addEventListener("click",e=>{
    document.getElementById("temavalaszodiv").style.display="none";
    document.getElementById("quizStart").style.display="none";
    document.getElementById("kepekCheckbox").style.display="block";

    let i=0;
    console.log(valasztottlista.length)
    console.log(valasztottlista[0].időpont)
    console.log(valasztottlista[0].esemény)
    console.log(valasztottlista[0].képek)

    

    valasztottlista.forEach(e=>{
    let randomNumbers = generateRandomNumbers(i, 4, valasztottlista.length);

    randomszam=Math.floor(Math.random() * 4);
    randomNumbers[randomszam]=i;
    helyesindex=randomszam;

    console.log("random:" +randomNumbers[0])
    console.log("random:" +randomNumbers[1])
    console.log("random:" +randomNumbers[2])
    console.log("random:" +randomNumbers[3])

    console.log(i)
    
    quiz.addQuestion(e.esemény,[valasztottlista[randomNumbers[0]].időpont,
                                valasztottlista[randomNumbers[1]].időpont,
                                valasztottlista[randomNumbers[2]].időpont,
                                valasztottlista[randomNumbers[3]].időpont], helyesindex, valasztottlista[i].képek
    )
    


    console.log(e.esemény);
    console.log(helyesindex);
    
    i++;
    })
    
})




// Egyéb kódok
document.getElementById("quizStart").addEventListener("click", quiz.init);



function generateRandomNumbers(exclude, count, forciklus) {
    let numbers = [];
    
    // Az összes lehetséges szám 1 és 7 között
    for (let i = 0; i <= forciklus-1; i++) {
        if (i !== exclude) { // Kihagyjuk az exclude változó által megadott számot
            numbers.push(i);
        }
    }
    
    // Véletlenszerűen választunk egy számot az összes lehetséges számból
    let selectedNumbers = [];

    for (let i = 0; i < count; i++) {
        let randomIndex = Math.floor(Math.random() * numbers.length);
        selectedNumbers.push(numbers[randomIndex]); // Hozzáadjuk a véletlenül kiválasztott számot a kiválasztott számokhoz
        numbers.splice(randomIndex, 1); // Eltávolítjuk a kiválasztott számot a listából
    }

    return selectedNumbers;
}

function Vissza(){
    location.reload();
}

const kepekCheckbox = document.getElementById("kepekCheckbox");

// Checkbox változásának figyelése
kepekCheckbox.addEventListener("change", function() {
    // Ha be van jelölve a checkbox
    if (kepekCheckbox.checked) {
        document.getElementById("kepekDiv").style.display = "block";
    } else {
        document.getElementById("kepekDiv").style.display = "none";
    }
});