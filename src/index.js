// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(){
    fetchAllQuoutes()
    const form = document.getElementById("new-quote-form")
    form.addEventListener("submit", addQuote)
})

function fetchAllQuoutes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(quotesArray => {
        quotesArray.forEach(renderQuote)
    })
}

function renderQuote(quote){
    // quoteLi.innerHTML = 
    // `<li class="quote-card">
    //     <blockquote class="blockquote">
    //         <p class="mb-0" data-quote-id="${quote.id}">${quote.quote}</p>
    //         <footer class="blockquote-footer">${quote.author}</footer>
    //         <br>
    //         <button class="btn-success">Likes: <span>${quote.likes.length}</span></button>
    //     </blockquote>
    // </li>`

    //create quote li
    let quoteUl = document.getElementById("quote-list")
    let quoteLi = document.createElement("li")
    let blockQuote = document.createElement("blockquote")
    blockQuote.classList.add("blockquote")
    let quoteP = document.createElement("p")
    quoteP.classList.add("mb-0")
    quoteP.dataset.id = quote.id
    quoteP.innerText = `${quote.quote}`
    let quoteFooter = document.createElement("footer")
    quoteFooter.classList.add("blockquote-footer")
    quoteFooter.innerText = `${quote.author}`
    let likeButton = document.createElement("button")
    likeButton.classList.add("btn-success")
    let quoteSpan = document.createElement("span")
    quoteSpan.innerText = `Likes: ${quote.likes.length}`
    likeButton.appendChild(quoteSpan)
    // likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    quoteLi.appendChild(blockQuote)
    blockQuote.appendChild(quoteP)
    blockQuote.appendChild(quoteFooter)
    blockQuote.appendChild(document.createElement("br"))
    blockQuote.appendChild(likeButton)
    let deleteButton = document.createElement("button")
    deleteButton.classList.add("btn-danger")
    deleteButton.dataset.id = quote.id
    deleteButton.innerText = "Delete"
    blockQuote.appendChild(deleteButton)
    quoteUl.appendChild(quoteLi)
    deleteButton.addEventListener("click", deleteQuote)
    likeButton.addEventListener("click", (event) => {likeQuote(event, quote, quoteSpan)})
}

function addQuote(event){
    event.preventDefault()
    let data = {
        quote: event.target[0].value,
        author: event.target[1].value,
        likes: [],
    }
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => renderQuote(data))
}

function deleteQuote(event){
    let id = event.target.dataset.id
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE"
    }).then(response => response.json())
    .then(deletedData => {
        event.target.parentElement.parentElement.remove()
    })
}

function likeQuote(event, quote, quoteSpan){
    let data = {
        quoteId: quote.id,
        created_at: Date.now()
    }
    fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        let num = parseInt(quoteSpan.innerText.split(" ")[1]) + 1
        quoteSpan.innerText = `Likes: ${num}`
    })
}
