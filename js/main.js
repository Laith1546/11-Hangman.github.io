import {giveRandomAnimal, giveRandomPokemon, giveRandomNoun, game} from './external.js';
// import * as menu from './menu';

// elements 
const root = document.querySelector(":root");
const wordDivEl = document.querySelector(".word");
const wordInputEl = document.querySelector(".word-input");
const answersListEl = document.querySelector(".answers-list");
const overlayEl = document.querySelector(".overlay");
const loadingEl = document.querySelector(".loading");
const restartBtnEl = document.querySelector(".restart-btn");
// variables
const maxNumOfLetters = 12;
let mainWord = "";
let wrongAnswers = [];
const afterColor = "yellow";

// functions
const displayWord =  (word, show= false) => {
    if(show) {
        const letters = wordDivEl.querySelectorAll(".letter");
        
        for (let i = 0; i < word.length; i++){
            letters[i].textContent = word[i];
        }
        return;
    }

    for (let i = 0; i < word.length; i++){
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("letter");
        
        if(show) tempDiv.textContent = word[i];
        else tempDiv.textContent = " ";
        wordDivEl.appendChild(tempDiv);
    }
}

const AddToList = async (input) => {
    if(wrongAnswers.includes(input)) return;

    wrongAnswers.push(input);
    const tempDiv = await document.createElement("div");
    tempDiv.classList.add("answer");
    tempDiv.textContent = input;

    answersListEl.prepend(tempDiv);
}

const checkWord = async (input) => {
    input = input.toLowerCase();
    if(input.length > 1){
        if(input === mainWord){
            for (let i = 0; i < input.length; i++){
                const letterDiv = wordDivEl.querySelector(`.letter:nth-child(${i+1})`)
                letterDiv.textContent = input[i];
                for(let i = 0; i < mainWord.length; i++){
                    game.decreaseLetters();
                }
            }
        } else if(!wrongAnswers.includes(input)) {
            AddToList(input);
            game.decreaseLives();
            game.changeBackgroundColor(game.currentLives);
        }
    } else {
        if(mainWord.includes(input)){
            for (let i = 0; i < mainWord.length; i++){
                if(mainWord[i] === input){
                    const letterDiv = wordDivEl.querySelector(`.letter:nth-child(${i+1})`)
                    letterDiv.textContent = input;
                    game.decreaseLetters();
                }
            }
        }
        else if(!wrongAnswers.includes(input) && input !== "-") {
            AddToList(input);
            game.decreaseLives();
            game.changeBackgroundColor(game.currentLives);
        }
    }
}

const clearList = async () => {
    wrongAnswers = [];
    answersListEl.innerHTML = " ";
}

export const showMenu = async (show= true) => {
    if(show){
        overlayEl.style.display = "inline-block";
        setTimeout(() => overlayEl.style.opacity = "100", 300);
    } else {
        overlayEl.style.opacity = "0";
        setTimeout(() => overlayEl.style.display = "none", 300);
    }
}

export const newGame =  () => {
    game.hasStarted = 1;
    game.currentLives = game.totalLives;
    game.changeBackgroundColor(game.totalLives);
    clearList();
    wordDivEl.innerHTML = " ";
    wordInputEl.value = "";
    gameWon(true);
}

export const chooseWord = async (type) => {
    newGame();
    do {
        if(type === "noun")
            await giveRandomNoun()
                .then((name) => mainWord = name)
                .then(() => showMenu(false));
        else if (type === "animal")
            await giveRandomAnimal()
                .then((name) => mainWord = name)
                .then(() => showMenu(false))
        else if (type === "pokemon")
            await giveRandomPokemon()
                .then((name) => mainWord = name)
                .then(() => showMenu(false))
    } while (mainWord.length > maxNumOfLetters)

    displayWord(mainWord);

    game.remainingLetters = mainWord.length;

    checkWord("-")
        .then(() => clearList())
        .then(() => loadingEl.style.display = "none")
        .then(() => wordInputEl.focus());

    console.log(mainWord);
}

export const gameWon = (revers= false) => {
    if(revers){
      wordInputEl.disabled = false;
        root.style.setProperty("--after-background-color", afterColor);

        setTimeout(() => {
            wordDivEl.querySelectorAll(".letter").forEach(element => {
                element.style.width = "4rem";
                element.style.margin = "1rem 0.5rem";
                element.style.fontSize = "3rem";  
            })
        }, 300);
        return;
    }
    
    wordInputEl.disabled = true;
    root.style.setProperty("--after-background-color", "transparent");
    clearList();
    displayWord(mainWord, true);
    setTimeout(() => {
        wordDivEl.querySelectorAll(".letter").forEach(element => {
            element.style.width = "auto";
            element.style.margin = "1rem -1rem";
            element.style.fontSize = "8rem";
        })
    }, 300);
}


// main 
    // input field
wordInputEl.addEventListener('keydown', key => {
    if(key.code === "Enter" && wordInputEl.value !== ""){
        checkWord(wordInputEl.value);
        wordInputEl.value = "";
    }   
})

    // restart button
    restartBtnEl.addEventListener('click', () => {
        showMenu();
        console.log("bruh");
    })
restartBtnEl.onmouseover = () => {
    restartBtnEl.style.transform = "rotateZ(180deg)"
}
restartBtnEl.onmouseleave = () => {
    restartBtnEl.style.transform = "rotateZ(0deg)";
}



// error handling 