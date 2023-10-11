const term = []; //Master array of every single term
const definition = []; //Master array of every single definition
const buttons = document.getElementsByClassName("btn");

var mainWord = document.getElementById("main-word-text").textContent; //current term
var currentWordPos = 0;
var setName = "ERROR NO GAMEMODE DETECTED";
var usedTerms = []; //list of used terms to avoid repeats
var newTerms = []; //list of terms used in current gamemode/set
var newDef = []; //list of definitions used in current gamemode/set
var pass = false; //pass boolean if all goes well in the gamemode switch statement
var incrementBy = 0;
var progressMax = 0; //currently not used but keeping it cuz its useful

var selectedSet = "";
var reviewFlag = false;

//Plays on body load, adds words 
async function start() {
    await create();
}

//Adds any html and other information i need to create at the start
async function create() {
    resize(); // window.addEventListener('resize', onResize);

    //Creates set options for dropdown and pushes pairs into master arrays
    var response = await fetch('../writer/words.txt');
    const words = await response.text();
    const list = words.split("\n");

    const dropdown = document.getElementById("gm-dropdown-menu");

    for (let line of list) {
        if (line.includes("-")) { //separates each line to words and definitions, pushes them accordingly into master arrays
            term.push(line.substring(0, line.indexOf("-") - 1));
            definition.push(line.substring(line.indexOf("-") + 2));
        } else { //If it doesn't have a dash in it, its a title, so those are created into options under the dropdown menu
            var option = document.createElement("OPTION");
            var title = document.createTextNode(line);

            option.appendChild(title);
            dropdown.appendChild(option);
        }
    }

    //Length of master array is written into all words
    document.getElementsByClassName("gm-term-count")[0].innerText = term.length + " Words";
}

//Screen size dependent elements
function resize() {
    //gm-arrow
    const arrow = document.getElementsByClassName("gm-arrow")[0];
    const wrapper = document.getElementsByClassName("gm-wrapper")[0];
    let wrapperMargin = window.getComputedStyle(wrapper).marginLeft;
    let wrapperValue = parseInt(wrapperMargin.substring(0, wrapperMargin.indexOf("px")));
    arrow.style.left = (wrapperValue - 62) + "px";
    arrow.style.display = "block";

    //card-progress
    const progressBar = document.getElementsByClassName("card-progress")[0];
    const card = document.getElementById("card");

    let cMarginStr = window.getComputedStyle(card).marginLeft;
    let cMarginValue = parseInt(cMarginStr.substring(0, cMarginStr.indexOf("px")));
    progressBar.style.left = (cMarginValue + 20) + "px";
    //left margin of card + 20px because thats the distance between button and card border
    //lines up beginning of progress bar with the leftmost buttons

    let cWidthStr = window.getComputedStyle(card).width;
    let cWidthValue = parseInt(cWidthStr.substring(0, cWidthStr.indexOf("px")));
    // progressBar.style.width = (cWidthValue - 54) + "px"; 
    //button px distance from border on both sides, reaches the holy 806px
    //set width is 806 but actual width of element is 820 because progressbar is an hr element
    //meaning it looks the way it does through a 7px border, so 806 + (7*2) = 820 + button padding of 20*2 = 820 + 40 = 860px, the total width of the card

    // let progressWidth = window.getComputedStyle(progressBar).width;
    let progressWidth = (cWidthValue - 54) + "px";
    let pWidthValue = parseInt(progressWidth.substring(0, progressWidth.indexOf("px")));
    progressMax = pWidthValue;
    incrementBy = Math.round(pWidthValue/newTerms.length);
    //sets the max width of the progress bar to an string let, and then parseInt's it into an int let
    //then it sets the maximum progress (width) the bar can go up to as well as the amount it increments by based on the maximum width divided by the 
}


function adjustBar() {
    //I AM KEEPING THIS HERE JUST IN CASE I WANT TO COME BACK TO THIS IDEA THAT ISN'T REALLY NECESSARY CUZ I HAD TO DO WAS NOT SET THE PROGRESS BAR'S WIDTH IN THE RESIZE FUNCTION

    //Lets just write out what i think is the solution to this, independent of variables that i may or may not have instantiated for the problem
    //So everytime the page is resized, this function shall be called, it will adjust the progress bar according to where it should be directly aligned with the left and right ends of the buttons in the card
    //To do this, i will need to grab the same values i grab and calculate in the regular resize function above: the left margin of the card + 20px so i can set the left of the progress bar to that, directly aligning it under the card how i want it. As well as the card width - 54px so i can set the maximum width of the progress bar so it aligns with the card buttons
    //I would also need to calculate the maximum progress the bar can reach like the last part of my resize function, as well as setting the increment value based on the maximum progress
}

//Function that sets which gamemode is chosen 
async function setGamemode(event) {
    var gamemode = event.target.id; //grabs id of button, id of button is equal to its gamemode
    document.getElementsByClassName("gm-all")[0].style.display = "none";
    document.getElementsByClassName("gm-all")[0].style.opacity = "0";
    document.getElementsByClassName("gm-all")[0].style.left = "1300px";
    document.getElementById("card").style.display = "block";

    switch (gamemode) { //gamemode will be grabbed when player presses start on a specific gamemode 시작 
        case "allWords":
            newTerms = term; //sets newterms to terms because im just using all words
            newDef = definition; //same as above
            setName = "All Words: " + term.length + " words";
            document.title = "퀴즈레트 | " + setName;
            pass = true;
            break;
        case "certainIndex": //treat prompted indicies as actual indicies, not just words 1-5 but rather index 0-4
            await certainIndex();
            break;
        case "sets":
            await selectSet();
            break;
        case "randomX":
            randomX();
            break;
        default:
            alert("Error: Invalid Gamemode");
    }

    if (pass) {
        reset();
        resize();
        document.getElementsByClassName("card-progress")[0].style.width = "0px";
    } else {
        location.reload(); //reloads page
    }
}

//Checks if the input indexes are cool
async function certainIndex() {
    let min = document.getElementsByClassName("indexRange")[0].value; //will grab min from player input box
    let max = document.getElementsByClassName("indexRange")[1].value; //same as above
    
    if (max - min <= 2) {
        alert("Try again, minimum of 4 terms required"); 
    } else if (max < 0 || min < 0) {
        alert("No negatives");
    } else {
        max++; //adds to max cuz slice is like substring
        newTerms = term.slice(min, max); //slices newTerms into an array from min to max
        newDef = definition.slice(min, max); //same as above
        setName = "CertainIndex: Indicies " + min + " to " + max + " - " + newTerms.length + " words";

        document.title = "퀴즈레트 | Indicies: " + min + " to " + max;
        pass = true;
    }
}

async function selectSet() { //note, take note of first item in set and last item in set, find their indexes in master list, slice accordingly
    var response = await fetch('writer/words.txt'); //looks at words.txt 
    const words = await response.text(); //words.txt as a big string
    const list = words.split("\n"); //words.txt as an array whereas each line is an entry
    
    var select = document.getElementById("gm-dropdown-menu"); //dropdown menu element
    var option = select.options[select.selectedIndex].text //code used to grab the selected option's text

    var start = list.indexOf(option); //the index of my chosen date in words.txt
    var firstTerm = list[start+1]; //start+1 since the entry after my selected date would be the first term in the set
    firstTerm = firstTerm.substring(0, firstTerm.indexOf("-") - 1); //substrings to grab the term
    let min = term.indexOf(firstTerm); //gets index of grabbed term by indexing it into master list
    let max = min; //max will start from min because we increment from there how far we should go

    for (let i = start+1; i < list.length; i++) {
        if (list[i].includes("-")) { //if a dash in in the line, add to max
            max++;
        } else { //if we hit the next date, break the loop
            break;
        }
    }
    
    //No need to add an extra +1 to max in this case, all is well
    newTerms = term.slice(min, max);
    newDef = definition.slice(min, max);

    if (newTerms.length >= 4) {
        setName = "Sets: " + option + " - " + newTerms.length + " words";
        selectedSet = option;

        document.title = "퀴즈레트 | " + option;
        pass = true;
    } else {
        alert("Selected set does not have at least 4 terms, try again");
    }
}

//Gets the x from input box and chooses x random terms and adds them to newTerms
async function randomX() {
    let x = document.getElementsByClassName("indexRange")[2].value; //grabs x from randomX input box

    if (x < 4) {
        alert("Try again, minimum of 4 terms required");
    } else {
        while(x > 0) { //i think i did a while loop here cuz i felt like doing something different, really doesnt matter i think if i do for or while loop
            let index = Math.floor(Math.random() * term.length);

            while (newTerms.includes(term[index])) {
                index = Math.floor(Math.random() * term.length);
            }

            newTerms.push(term[index]);
            newDef.push(definition[index]);
            x--;
        }
        setName = "RandomX: " + newTerms.length + " words";

        document.title = "퀴즈레트 | " + setName;
        pass = true;
    }
}
// ## Problem Occurred: 2 words (토록 & 왔다갔다) appeared twice. I think its because i didnt check whether the term[index] above was inside of newterms already. I beleive i fixed it now but leaving this message here in case it ever appears again. Also 2 words appearing twice is an absolute coincidence as there are nearly over 300 words in the pool



//Main function of website, will choose random words in given set of words and will place them into the term and definition locations, method is used after each term is answered correctly
async function reset() {
    //Resets changed CSS elements
    buttonReset();    
    
    //Get random word
    currentWordPos = Math.floor(Math.random() * newTerms.length);

    while (usedTerms.includes(currentWordPos)) { //while currentWordPos IS in usedTerms, reroll
        currentWordPos = Math.floor(Math.random()* newTerms.length);
    }
    
    usedTerms.push(currentWordPos); //usedTerms is based on indicies instead of actual words
    mainWord = document.getElementById("main-word-text").innerHTML = newTerms[currentWordPos];

    var used = []; //arr of definition positions that have already been used for each question, gets reset after each question

    //Loop that randomizes answers with no repeats (ex. avoids rolling 135 twice and having that definition two times)
    for (let button of buttons) {
        button.disabled = false; //reenables previously disabled buttons on reset
        let currentDef = Math.floor(Math.random() * newDef.length);
            
        if (!used.includes(currentDef)) { //if word isnt used yet, do this
            button.innerHTML = newDef[currentDef];
            used.push(currentDef);    
            
        } else { //if word was already used, do this
            while (used.includes(currentDef)) { //for as long as the current word has already been used, try again
                currentDef = Math.floor(Math.random() * newDef.length);
            }

            used.push(currentDef);
            button.innerHTML = newDef[currentDef];
        }
    }
    
    //if correct definition for word isnt among the 4, places it in one of the spots randomly
    if (!used.includes(currentWordPos)) {
        buttons[Math.floor(Math.random() * buttons.length)].innerHTML = newDef[currentWordPos];
    }
}

//Checks whether selected answer is the correct one based on their indexes in the master array
function checkAnswer(event) {
    let select = event.target;
    let selectText = select.innerText; //selected answer (uses innertext to ignore css padding)
    let defPos = definition.indexOf(selectText); //position of selected answer in the definition arr
    let termPos = term.indexOf(mainWord); //position of current term in the term arr
    
    if (select != "[object HTMLDivElement]") { //checks if selected element the btn
        select.disabled = true;
        select.style.cursor = "default";

        if (defPos == termPos) {
            result("정답", event);
        } else {
            result("실패", event);
        }
    }
}

//Method that gets called after an answer is chcked, plays correct animation according to result
function result(status, event) {
    if (status == "정답") {
        for (let btn of buttons) {
            btn.style.pointerEvents = "none";
        }

        event.target.style.animation = "correct 500ms forwards";
        let win = usedTerms.length == newTerms.length;
        // let win = true;

        if (win) {
            setTimeout(moveBar, 1000);

            setTimeout( function() {
                fireworks();
                document.getElementsByClassName("wrapper")[0].style.display = "none";
                document.getElementsByClassName("card-progress")[0].style.display = "none";
                document.getElementsByClassName("dubbie-div")[0].style.display = "block";
                document.title = "퀴즈레트 | Congrats!";
            }, 2000);
        } else {
            setTimeout( function() {
                document.getElementsByClassName("card-progress")[0].style.display = "block";
                reset();
                moveBar();
            }, 3000);
        }

        
    } 

    if (status == "실패") {
        event.target.style.animation = "incorrect 500ms forwards";
    }
}

function moveBar() {
    const progressBar = document.getElementsByClassName("card-progress")[0];
    let progressWidth = window.getComputedStyle(progressBar).width; //width of prog bar
    let pWidthValue = parseInt(progressWidth.substring(0, progressWidth.indexOf("px")));
    let pWidthInitial = pWidthValue; //initial width so we 
    let pWidthMax = progressBar.style.width; //a temporary max for the bar to reach and stop at

    var addWidth = setInterval( function() {
        if ((pWidthInitial + incrementBy + "px") != pWidthMax) {
            // alert((pWidthTemp + incrementBy + "px") + " vs " + progressBar.style.width);
            pWidthValue++;
            pWidthMax = pWidthValue + "px";
            progressBar.style.width = pWidthMax;
        } else {
            clearInterval(addWidth);
        }
    }, 5)
}

//Resets the css because otherwise the green and red borders would stay
function buttonReset() {
    for (let btn of buttons) {
        btn.style.animationName = "none"; 
        btn.style.pointerEvents = "initial";
        btn.style.cursor = "pointer";
    }
}

//Opens naver dict if you specifically click on the term, might implement iframe at some point instead or something along the lines of a small screen so you dont have to head to naver but if you want to head to naver as well there will be a little link at the bottom right of the popup, i do like the naver thing right now tho since if i had an iframe and someone was trying to learn the word after getting it right, the card would change
function openNaver(event) {
    open("https://korean.dict.naver.com/koendict/#/search?range=all&query=" + event.target.textContent);
}


//Method that animates the opening and closing of a gamemode, and its so simple... after all that stupid stuff i tried to do with adding to total height based on height of the text...
function select(event) {
    var content = event.target.nextElementSibling; //the element right after the title is the content div

    if (content.style.maxHeight) { //if the content is at max height, do this
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px"; //*scrollHeight/scrollWidth is equal to the height/width of an element, however it just gives a number/value, not the px or vh part
    }

    const contentDivs = document.getElementsByClassName("gm-content");
    let openCount = 0;
    let closeCount = 0;

    for (let content of contentDivs) {
        if (content.style.maxHeight) {
            openCount++;
        } else {
            closeCount++;
        }
    }

    var arrow = document.getElementsByClassName("gm-arrow")[0];

    if (openCount == 4) {
        arrow.className = "gm-arrow rotate-open";
    }   

    if (closeCount == 4) {
        arrow.className = "gm-arrow rotate-close";
    }
}

function dropdown(event) {
    var arrow = event.target;
    var open = "gm-arrow rotate-open";
    var close = "gm-arrow rotate-close";

    if (arrow.className == close) {
        arrow.className = open;
    } else {
        arrow.className = close;
    }

    const contentDivs = document.getElementsByClassName("gm-content");

    for (let content of contentDivs) {
        if (arrow.className == close) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }
}

function reviewContent() {
    var rect = document.getElementsByClassName("dubbie-direct")[0].getBoundingClientRect();
    var x = rect.left + window.scrollX;
    var y = rect.top + window.scrollY;
    
    if (!reviewFlag) {
        printText();
        reviewFlag = true;
        document.getElementsByClassName("dubbie-review")[0].style.display = "block";
    }
    
    window.scrollTo(x, y);
}

function printText() {
    const text = document.getElementsByClassName("text")[0];
    const br = document.createElement("BR");
    
    var bold = document.createElement("STRONG");
    var set = document.createTextNode(setName);
    bold.appendChild(set);
    bold.className = "title";
    text.appendChild(bold);
    text.appendChild(br);
    
    var ul = document.createElement("ul");
    
    for (let i = 0; i < newTerms.length; i++) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        var term = newTerms[usedTerms[i]];
        var definition = newDef[usedTerms[i]];

        span.appendChild(document.createTextNode(term));
        span.className = "term";

        li.appendChild(span);
        li.appendChild(document.createTextNode(" - "));
        li.appendChild(document.createTextNode(definition));

        ul.appendChild(li);
        text.appendChild(ul);
    }
}

function returnToGM() {
    document.getElementsByClassName("dubbie-div")[0].style.animation = "exitLeft 750ms ease-in forwards";

    setTimeout(function() {
        document.getElementsByClassName("dubbie-div")[0].style.display = "none";
        document.getElementsByClassName("gm-all")[0].style.display = "block";
        document.getElementsByClassName("gm-all")[0].style.animation = "enterRight 750ms ease-in-out forwards";
        resetAll();
    }, 750);
}

function retrySet() { //the lame version for now cuz i needa actually start studying korean
    //Counteract resetAll()
    usedTerms = [];
    currentWordPos = 0;
    reset();

    //Unqiue Stuff
    document.getElementsByClassName("dubbie-div")[0].style.display = "none"; 
    document.getElementById("card").style.display = "block"; 

    //Review Stuff
    reviewFlag = false;
    document.getElementsByClassName("text")[0].innerText = "";
    document.getElementsByClassName("dubbie-div")[0].style.animationName = "none";
}

function resetAll() {
    //General
    usedTerms = [];
    newTerms = [];
    newDef = [];
    setName = "ERROR NO GAMEMODE DETECTED";
    pass = false;
    currentWordPos = 0;
    document.title = "퀴즈레트 | Gamemodes";
    resize();

    //GM Selections
    // document.getElementsByClassName("gm-all")[0].style.animationName = "none";
    document.getElementsByClassName("gm-arrow")[0].className = "gm-arrow rotate-close";
    const contentDivs = document.getElementsByClassName("gm-content");
    for (let content of contentDivs) {
        content.style.maxHeight = null;
    }

    //Card Stuff
    document.getElementsByClassName("card-progress")[0].style.width = "0px";

    //Review Stuff
    reviewFlag = false;
    document.getElementsByClassName("text")[0].innerText = "";
    document.getElementsByClassName("dubbie-div")[0].style.animationName = "none";
}