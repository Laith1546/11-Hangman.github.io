import {game} from "./external.js";
import { chooseWord } from "./main.js";

// elements
const gameTypeEl = document.querySelector(".game-type span");
const gameTypeButtonEls = document.querySelectorAll(".game-type button");
const gameDiffEl = document.querySelector(".game-difficulty span");
const gameDiffButtonEls = document.querySelectorAll(".game-difficulty button");
const gameStartEl = document.querySelector(".menu > button");
const loadingEl = document.querySelector(".loading");

// main 
    // highlight selected elements
gameTypeButtonEls.forEach(element => {
    if(element.classList.contains("selected")){
        const targetColor = getComputedStyle(element).color;
        element.style.backgroundColor = targetColor;
        element.style.color = "white";
        game.type = element.textContent.trim().toLowerCase();
    }
})
gameDiffButtonEls.forEach(element => {
    if(element.classList.contains("selected")){
        const targetColor = getComputedStyle(element).color;
        element.style.backgroundColor = targetColor;
        element.style.color = "white";
    }
})

    // select clicked game type elements
gameTypeEl.addEventListener('click', (e) => {
    if(e.target.classList.contains("selected") || e.target.nodeName !== "BUTTON") return;

    const targetColor = getComputedStyle(e.target).color;
    e.target.style.backgroundColor = targetColor;
    e.target.style.color = "white";
    e.target.classList.add("selected"); 
    game.type = e.target.textContent.toLowerCase().toLowerCase();

    gameTypeButtonEls.forEach(element => {
        if(element.textContent.trim() !== e.target.textContent.trim() && element.classList.contains("selected")){
            element.classList.remove("selected");

            const tempColor = getComputedStyle(element).backgroundColor;
            element.style.color = tempColor;
            e;element.style.backgroundColor = "white";
        }
    })
})

    // select clicked game difficulty elements
gameDiffEl.addEventListener('click', (e) => {
    if(e.target.classList.contains("selected") || e.target.nodeName !== "BUTTON") return;

    const targetColor = getComputedStyle(e.target).color;
    e.target.style.backgroundColor = targetColor;
    e.target.style.color = "white";
    e.target.classList.add("selected"); 

    switch(e.target.textContent.toLowerCase()){
        case "easy":
            game.changeDifficulty("easy");
            break;
        case "normal":
            game.changeDifficulty("normal");
            break;
        case "hard":
            game.changeDifficulty("hard");
            break;
        default:
            game.changeDifficulty("easy");
    }

    gameDiffButtonEls.forEach(element => {
        if(element.textContent.trim() !== e.target.textContent.trim() && element.classList.contains("selected")){
            element.classList.remove("selected");

            const tempColor = getComputedStyle(element).backgroundColor;
            element.style.color = tempColor;
            element.style.backgroundColor = "white";
        }
    })
})

    // click start button 
gameStartEl.addEventListener('click', () => {
    console.log("-----------");
    console.log("Type= " + game.type);
    console.log("Diff= " + game.difficulty);
    console.log("live= " + game.currentLives);
    loadingEl.style.display = "inline-block";
    chooseWord(game.type);
})