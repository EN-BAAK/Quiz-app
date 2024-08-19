//!     Select Elements

let countSpan = document.querySelector('.quiz-info .count span')
let bulletsSpanCountainer = document.querySelector('.bullets .spans')
let quizArea = document.querySelector('.quiz-area')
let answersArea = document.querySelector('.answers-area')
let submitButton = document.querySelector('.submit-button')
let bullets = document.querySelector('.bullets')
let resultsCountainer = document.querySelector('.results')
let countdownSpan = document.querySelector('.countdown')
//!     Set Options 
let currentIndex = 0
let rightAnswers = 0
let countdownInterval
//!     Main

getQuestions()




//!     Functions

function getQuestions() {

    let myRequest = new XMLHttpRequest(); 

    myRequest.onreadystatechange = function() {

        if(this.readyState === 4 && this.status === 200) {

            let questionsObject = JSON.parse(this.responseText)

            let questionCount = questionsObject.length -1

            //  Create BUllets And Set Questions Count
            createBullets(questionCount)

            //  Add Question Data
            addQuestionData(questionsObject[currentIndex], questionCount)

            //  Start Countdown
            countdown(380, questionCount)

            //  Click On Submit 
            submitButton.onclick = () => {

                //  Get Right Answer
                let  theRightAnswer = questionsObject[currentIndex].right_answer

                //  Increase Index
                currentIndex++

                //  Check The Answer
                checkAnswer(theRightAnswer,questionCount)

                //  Remove Previous Question
                quizArea.innerHTML = ''
                answersArea.innerHTML = ''

                //  Add New Question
                if(currentIndex <= questionCount) {
                    addQuestionData(questionsObject[currentIndex], questionCount)
                }

                //  Handle Bullets Class
                handleBullets()

                //  Start Countdown
                clearInterval(countdownInterval)
                countdown(3,questionCount)

                if(currentIndex === questionCount+1) {

                    //  SHow Results
                    showResults(questionCount+1)

                }
            }

    }
}

    myRequest.open('GET', "HTML_Questions.JSON", true)
    myRequest.send()
}

function createBullets(num) {
    countSpan.innerHTML = num

    //  Create Spans
    for(let i=0; i <= num; i++) {

        //  Create Span
        let theBullet = document.createElement('span')

        if (i=== 0) { theBullet.className = 'on' }

        //  Append Bullets To Main Bullets Container
        bulletsSpanCountainer.appendChild(theBullet)

    }
}

function addQuestionData(object, count) {

    //  Create H2 Question Title
    let questionTitle = document.createElement('h2')

    //  Append Text To H2

    questionTitle.appendChild(document.createTextNode(object['title']))

    //  Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle)

    //  Create The Answers
    for(let i = 1; i <=4; i++) {

        //  Create Main Answer Div
        let mainDiv = document.createElement('div')

        //  Add Class To Main Div
        mainDiv.className = 'answer'

        //  Create Radio Input
        let radioINput = document.createElement('input')

        //  Add Type And Name And Id And Data-Attribute
        radioINput.name = 'question'
        radioINput.type = 'radio'
        radioINput.id = `answer_${i}`
        radioINput.dataset.answer = object[`answer_${i}`]

        //  Make First Option Selected
        if (i === 1) { radioINput.checked = true }

        //  Create Label
        let theLabel = document.createElement('label')

        //  Add For Attribute
        theLabel.htmlFor =  `answer_${i}`

        //  Append Text To Label
        theLabel.appendChild(document.createTextNode(object[`answer_${i}`]))

        //  Add Input And Label To Main Div
        mainDiv.appendChild(radioINput)
        mainDiv.appendChild(theLabel)

        //  Append All Divs To Answers Area
        answersArea.appendChild(mainDiv)

    }

}

function checkAnswer(rAnswer, count) {

    let answers = document.getElementsByName("question")
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++) {

        if(answers[i].checked) {

            theChoosenAnswer = answers[i].dataset.answer
        }
    }

    if (rAnswer === theChoosenAnswer) {

        rightAnswers++
    }
}

function handleBullets() {

    let bulletsSpans = document.querySelectorAll('.bullets .spans span')
    let arrayOfSpans = Array.from(bulletsSpans)

    bulletsSpans.forEach((span, index) => {

        if(currentIndex === index) {
            span.className = 'on'
        }
    })

}

function showResults(count) {

    let theResults
    quizArea.remove()
    answersArea.remove()
    submitButton.remove()
    bullets.remove()

    if(rightAnswers > (count / 2) && rightAnswers < count) {
        theResults = `<span class='good'>Good</span>, ${rightAnswers} From ${count}.`
    } else if(rightAnswers === count) {
        theResults = `<span class='perfect'>Perfect</span>, ${rightAnswers} From ${count} All Answers Is Good.`
    } else {
        theResults = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count}.`
    }

    resultsCountainer.innerHTML = theResults
    resultsCountainer.style.padding = '10px'
    resultsCountainer.style.backgroundColor = 'white'
    resultsCountainer.style.marginTop = '10px'
}

function countdown(duration, count) {
    if(currentIndex < count) {

        let minutes, seconds
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)

            minutes = minutes < 10 ? `0${minutes}` : `${minutes}` 
            seconds = seconds < 10 ? `0${seconds}` : `${seconds}`

            countdownSpan.innerHTML = `${minutes}:${seconds}`

            if(--duration < 0) {
                clearInterval(countdownInterval)
                submitButton.click()
            }

        }, 1000);
    }
}