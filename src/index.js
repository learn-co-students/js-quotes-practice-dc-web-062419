document.addEventListener('DOMContentLoaded', ()=>{
    console.log(`I sometimes see you outside my door /
    henlo, is it me you're looking for?`)
    fetchQuotes()
    const quoteForm = document.querySelector("form")
    quoteForm.addEventListener("submit", addNewQuote)
})

function addNewQuote(event){
    event.preventDefault()
    
    let newQuoteData = {
        quote: event.target.querySelector('#new-quote').value,
        author: event.target.querySelector('#author').value
    }

    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuoteData)
    })
        .then(res => res.json())
        .then(newQuote => renderQuoteToDOM(newQuote))
}

function fetchQuotes(){
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(res => res.json())
    .then(quotesArray => quotesArray.forEach(renderQuoteToDOM))
}

function renderQuoteToDOM(quote){
    // creating all elements to populate quotes list
    const quoteUl = document.querySelector('#quote-list')
    const quoteLi = document.createElement('li')
    const blockQuote = document.createElement('blockquote')
    const quoteP = document.createElement('p')
    const newFooter = document.createElement('footer')
    const lineBreak = document.createElement('br')
    const likeButton = document.createElement('button')
    const deleteButton = document.createElement('button')

    // adding class names to elements 
    quoteLi.classList.add('quote-card')
    quoteLi.dataset.quoteId = quote.id
    blockQuote.classList.add('blockquote')
    quoteP.classList.add('mb-0')
    newFooter.classList.add('blockquote-footer')
    likeButton.classList.add('btn-success')
    deleteButton.classList.add('btn-danger')

    // adding all the innerText/HTML
    quoteP.innerText = quote.quote
    newFooter.innerText = quote.author
    deleteButton.innerText = 'Delete'
    if (quote.likes) {
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`;
        likeButton.addEventListener('click', likeQuote)
    } else {
        likeButton.innerHTML = `Likes: 0`;
        likeButton.addEventListener('click', likeQuote)
    }

    // appending ALL the children
    blockQuote.append(quoteP, newFooter, lineBreak, likeButton, deleteButton)
    quoteLi.appendChild(blockQuote)
    quoteUl.appendChild(quoteLi)

    // adding event listeners to buttons
    deleteButton.addEventListener('click', deleteQuote)
}

function likeQuote(event){
    let quoteIdForLikes = parseInt(event.currentTarget.parentNode.parentNode.dataset.quoteId)
    let currentLikeCount = parseInt(event.currentTarget.parentNode.querySelector('span').innerText)
    
    fetch(`http://localhost:3000/likes/`, {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: quoteIdForLikes
        })
    })
        .then(res => res.json())
        .then(event.currentTarget.innerText = `Likes: ${currentLikeCount + 1}`)
}

function deleteQuote(event){
    let quoteId = parseInt(event.target.parentNode.parentNode.dataset.quoteId)
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "DELETE", 
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(event.target.parentNode.parentNode.remove())
}