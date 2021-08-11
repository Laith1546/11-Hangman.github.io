import {giveRandomAnimal, giveRandomPokemon, giveRandomNoun, game} from './external.js';

// elements 
const root = document.querySelector(":root");
const wordDivEl = document.querySelector(".word");
const wordInputEl = document.querySelector(".word-input");
const answersListEl = document.querySelector(".answers-list");
const overlayEl = document.querySelector(".overlay");
const loadingEl = document.querySelector(".loading");
const restartBtnEl = document.querySelector(".restart-btn");
const wordDescDiv = document.querySelector(".description");
const livesDiv = document.querySelector(".lives");
const timesEl = document.querySelector(".fa-times");

// variables
const maxNumOfLetters = 12;
let mainWord = "";
let listOfAnswers = [];
const afterColor = "yellow";
const purplishColor = "#50178b";

// functions
const moveIn = (element, from= "top", speed= 300, delay= 100, method= "ease-out") => {
    speed /= 1000;

    const property = ["transform", "-webkit-transform"];
    const setTransition = (sp= speed, meth= method) => {
        for(let i = 0; i < 2; i++){
            let elemTrans = getComputedStyle(element).transition;
            let startPos = elemTrans.indexOf(property[i]) + property[i].length;
            let endPos = elemTrans.indexOf(",", startPos);
            if(endPos === -1) endPos = elemTrans.length;
    
            const beforeString = elemTrans.substring(0, startPos);
            const afterString = elemTrans.substring(endPos, elemTrans.length);
            
            elemTrans= `${beforeString} ${sp}s ${meth} 0s${afterString}`;
            element.style.transition = elemTrans;
        }
    }
    // element.style.opacity = "0";
    setTransition(0, method);
    const pos = element.getBoundingClientRect();

    if(from === "bottom"){
        const elemHeight = 
            getComputedStyle(element).height.substring(0, getComputedStyle(element).height.length -2);
        element.style.transform = 
            `translateY(${window.innerHeight - pos.bottom + parseInt(elemHeight)}px)`;

        setTimeout(() => {
            // element.style.transition = `transform ${speed}s ease-out`;
            setTransition(speed);
            element.style.transform = `translateY(0%)`;
        }, delay)
        
    } else if (from === "top"){
        const elemHeight = 
            getComputedStyle(element).height.substring(0, getComputedStyle(element).height.length -2);
        element.style.transform = 
            `translateY(-${window.innerHeight + pos.top + parseInt(elemHeight)}px)`;

        setTimeout(() => {
            // element.style.transition = `transform ${speed}s ease-out`;
            setTransition(speed);
            element.style.transform = `translateY(0%)`;
        }, delay)
        
    } else if (from === "left"){
        const elemWidth = 
            getComputedStyle(element).height.substring(0, getComputedStyle(element).width.length -2);
        element.style.transform = 
            `translateX(-${window.innerWidth + pos.left + parseInt(elemWidth)}px)`;

        setTimeout(() => {
            // element.style.transition = `transform ${speed}s ease-out`;
            setTransition(speed);
            element.style.transform = `translateX(0%)`;
        }, delay)
   
    } else if (from === "right"){
        const elemWidth = 
            getComputedStyle(element).height.substring(0, getComputedStyle(element).width.length -2);
        element.style.transform = 
            `translateX(${window.innerWidth + pos.right + parseInt(elemWidth)}px)`;

        setTimeout(() => {
            // element.style.transition = `transform ${speed}s ease-out`;
            setTransition(speed);
            element.style.transform = `translateX(0%)`;
        }, delay)
    }

    element.style.opacity = "100";
}

const displayWord =  (word, show= false) => {
    if(show) {
        const letters = wordDivEl.querySelectorAll(".letter");
        
        for (let i = 0; i < word.length; i++){
            letters[i].textContent = word[i];
            letters[i].style.color = "white";
        }
        return;
    }

    for (let i = 0; i < word.length; i++){
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("letter");
        
        tempDiv.textContent = word[i];
        tempDiv.style.color = "transparent";

        // if(show) tempDiv.textContent = word[i];
        // else tempDiv.textContent = " ";
        wordDivEl.appendChild(tempDiv);
    }
}

const AddToList = (input) => {
    if(listOfAnswers.includes(input)) return;

    listOfAnswers.push(input);
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("answer");
    tempDiv.textContent = input;

    answersListEl.prepend(tempDiv);
}

const checkWord = async (input) => {
    input = input.toLowerCase();
    if(listOfAnswers.includes(input)) return;
    if(input.length > 1){
        if(input === mainWord){
            for (let i = 0; i < input.length; i++){
                const letterDiv = wordDivEl.querySelector(`.letter:nth-child(${i+1})`)
                letterDiv.textContent = input[i];
                for(let i = 0; i < mainWord.length; i++){
                    game.decreaseLetters();
                }
            }
        } else if(!listOfAnswers.includes(input)) {
            AddToList(input);
            game.decreaseLives();
            game.changeBackgroundColor(game.currentLives);
        }
    } else {
        if(mainWord.includes(input)){
            for (let i = 0; i < mainWord.length; i++){
                if(mainWord[i] === input){
                    const letterDiv = wordDivEl.querySelector(`.letter:nth-child(${i+1})`)
                    listOfAnswers.push(input);
                    letterDiv.style.color = "white";
                    game.decreaseLetters();
                }
            }
        }
        else if(!listOfAnswers.includes(input) && input !== "-") {
            AddToList(input);
            game.decreaseLives();
            game.changeBackgroundColor(game.currentLives);
        }
    }
}

const clearList = async () => {
    listOfAnswers = [];
    answersListEl.innerHTML = " ";
}

export const showMenu = (show= true, delay= 300) => {
    if(show){
        overlayEl.style.display = "inline-block";
        setTimeout(() => overlayEl.style.opacity = "100", delay);
    } else {
        overlayEl.style.opacity = "0";
        setTimeout(() => overlayEl.style.display = "none", delay);
    }
}

export const chooseWord = async (type) => {
    // newGame();
    do {
        if(type === "noun"){
            mainWord = await giveRandomNoun();
            showMenu(false);
        }
        else if (type === "animal"){
            mainWord = await giveRandomAnimal();
            showMenu(false);
        }
        else if (type === "pokemon"){
            mainWord = await giveRandomPokemon();
            showMenu(false);
        }
    } while (mainWord.length > maxNumOfLetters || mainWord.includes(" "))

    displayWord(mainWord);

    game.remainingLetters = mainWord.length;

    checkWord("-")
        .then(() =>{
            clearList();
            loadingEl.style.display = "none";
            wordInputEl.style.opacity = "100";
            wordInputEl.focus();

            // description & lives and animation
            moveIn(livesDiv, "bottom", 300, 300);
            moveIn(wordDescDiv, "bottom", 300, 100);

            let article = "a";
            let wordLength = mainWord.length;
            if(game.type === "animal")
                article = "an";
            if(mainWord.includes("-"))
                wordLength--;
            wordDescDiv.textContent = `${article} ${game.type} with ${wordLength} letters`;
            livesDiv.textContent = `lives: ${game.totalLives}`;
        })

    console.log(mainWord);
}

export const gameEnded = () => {
    wordInputEl.disabled = true;
    root.style.setProperty("--after-background-color", "transparent");
    clearList();
    displayWord(mainWord, true);
    wordInputEl.style.opacity = "0";
    wordDescDiv.style.opacity = "0";
    livesDiv.style.opacity = "0";
    setTimeout(() => {
        wordDivEl.querySelectorAll(".letter").forEach(element => {
            element.style.userSelect = "text";
            element.style.padding = "0rem 0rem 2rem 0rem"
            element.style.width = "auto";
            
            setTimeout(() => {
                element.style.fontSize = "8rem";
            }, 400);
        })
    }, 300);
}

const highlightAnswer = async () => {
    const answers = answersListEl.querySelectorAll(".answer");
    const letters = wordDivEl.querySelectorAll(".letter");
    if (letters.length === 0 && answers.length === 0) return;
    
    const divList = [...answers, ...letters];

    divList.forEach(div => {
        const txtClr = getComputedStyle(div).color;
        const transColor = "rgba(0, 0, 0, 0)";

        if(div.textContent === wordInputEl.value && txtClr !== transColor){
            if(div.classList.contains("answer"))
                div.style.marginLeft = "2rem";
            else div.style.transform = "translateY(-0.5rem)";

            div.style.textShadow = 
                `1px 1px 0px white,
                -1px 1px 0px white,
                1px -1px 0px white,
                -1px -1px 0px white`;
                
            div.style.color = purplishColor;
            setTimeout(() => {
                wordInputEl.style.backgroundColor = purplishColor;
                wordInputEl.style.borderColor = "white";
                wordInputEl.style.color = "white";
            }, 0)
        } else if(txtClr !== transColor){
            if(div.classList.contains("answer"))
                div.style.marginLeft = "1rem";
            else div.style.transform = "translateY(0rem)";

            div.style.textShadow = "none";
            div.style.color = "white";
            wordInputEl.style.backgroundColor = "white";
            wordInputEl.style.borderColor = "black";
            wordInputEl.style.color = "black";
        }
    })
} 

export const startGame = () => {
    chooseWord(game.type);
    // setting variables
    game.hasStarted = 1;
    game.currentLives = game.totalLives;
    game.changeBackgroundColor(game.totalLives);
    clearList();
    wordDivEl.innerHTML = " ";
    wordInputEl.value = "";
    wordInputEl.style.backgroundColor = "white";
    wordInputEl.style.borderColor = "black";
    wordInputEl.style.color = "black";
    wordInputEl.disabled = false;
    root.style.setProperty("--after-background-color", afterColor);
    
    setTimeout(() => {
        wordDivEl.querySelectorAll(".letter").forEach(element => {
            element.style.userSelect = "none";
            element.style.width = "3rem";
            element.style.margin = "1rem 0.5rem";
            element.style.fontSize = "3rem";  
        })
    }, 300);
}

// main 
    // keep input field focused
document.addEventListener("keydown", () => {
    if(game.hasStarted)
        wordInputEl.focus();
})

    // input field
wordInputEl.addEventListener('keydown', key => {
    setTimeout(highlightAnswer, 10);

    if(key.code === "Enter" && wordInputEl.value !== ""){
        checkWord(wordInputEl.value);
        wordInputEl.value = "";
    }   
})

    // restart button
restartBtnEl.addEventListener('click', () => {
    showMenu(true, 0);
    timesEl.style.display = "block";
})
restartBtnEl.onmouseover = () => {
    restartBtnEl.style.transform = "rotateZ(180deg)"
}
restartBtnEl.onmouseleave = () => {
    restartBtnEl.style.transform = "rotateZ(0deg)";
}

    // close menu
timesEl.addEventListener("click", () => {
    showMenu(false);
    setTimeout(() => timesEl.style.display = "none", 500);
})

// add tooltip  
// animation when a wrong answer is given
// add a way to tell if you won or lost
// add some animation to game end
// about the word
// slow/no internet message
// error handling 