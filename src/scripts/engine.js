const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel"),
    }
}

const pathImages = "src/assets/icons/"

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
]

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", idCard)
    cardImage.classList.add("card")

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"))
        })

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard)
        })
    }

    

    return cardImage
}

async function setCardsField(cardId) {
    await removeAllCardsImage()

    let computerCardId = await getRandomCardId()

    await showHiddenCardFieldImages(true)

    await hiddenCardDetails()

    drawCardsInfield(cardId, computerCardId)

    let duelResults = await checkDuelResults (cardId, computerCardId)

    await updateScore();
    await drawButton(duelResults)
}

async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img
}

async function showHiddenCardFieldImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block"
        state.fieldCards.computer.style.display = "block"
    } else {
        state.fieldCards.player.style.display = "none"
        state.fieldCards.computer.style.display = "none"
    }
}

async function hiddenCardDetails() {
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerHTML = ""
    state.cardSprites.avatar.src = ""
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
    
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playercardId, computerCardId) {
    let duelResults = "Draw"
    let playerCard = cardData[playercardId]

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Win"
        state.score.playerScore++
    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose"
        state.score.computerScore++
    }
    await playAudio(duelResults)
    return duelResults
}

async function removeAllCardsImage() {
    let {computerBox, player1Box} = state.playerSides
    let imgElements = computerBox.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = `Atribute: ${cardData[index].type}`
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
        
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init()
}

async function playAudio(status) {
    const audio = new Audio(`src/assets/audios/${status}.wav`)
    try {
        audio.play()
    } catch{

    }
}

function init() {
    
    showHiddenCardFieldImages(false)

    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init();