import {giveRandomAnimal, giveRandomPokemon, giveRandomNoun, game} from './external.js';


// elements 
const upperContainerEl = document.querySelector(".upper-container");
const wordDivEl = document.querySelector(".word");
const wordInputEl = document.querySelector(".word-input");
const answersListEl = document.querySelector(".answers-list");

// variables
const maxNumOfLetters = 12;
let mainWord = "";
let wrongAnswers = [];
const colorPalette = ["#5bac2b", "#669e29", "#719027", "#7c8224", "#877422", "#926720", "#9d591e", "#a84b1c", 
    "#b33d1a", "#be2f17", "#c92115", "#d41313"]; // #50ba2d to #d41313

// functions
const displayWord =  (word) => {
    for (let i = 0; i < word.length; i++){
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("letter");
        // tempDiv.textContent = word[i];
        tempDiv.textContent = " ";
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
                }
            }
        }
        else if(!wrongAnswers.includes(input)) {
            AddToList(input);
            game.decreaseLives();
            game.changeBackgroundColor(game.currentLives);
        }
    }
}

const clearList = async () => {
    wrongAnswers = [];
    answersListEl.innerHTML = "";
}

// main 
const chooseWord = (async () => {
    do {
        await giveRandomNoun().then((name) => mainWord = name);
    } while (mainWord.length > maxNumOfLetters)
    displayWord(mainWord);
    checkWord("-").then(() => clearList());

    console.log(mainWord);
})();

wordInputEl.addEventListener('keydown', key => {
    if(key.code === "Enter" && wordInputEl.value !== ""){
        checkWord(wordInputEl.value);
        wordInputEl.value = "";
    }   
})
// there are word with "-"