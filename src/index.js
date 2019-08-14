// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Page Loaded Bro")
    getQuotes(likesURL)
})


const likesURL = 'http://localhost:3000/quotes?_embed=likes'
let newForm = document.getElementById('new-quote-form')

newForm.addEventListener('submit', newQuoteSubmit)



function getQuotes(likesURL){

    fetch(likesURL)
    .then(res => res.json())
    .then(res =>{
        res.forEach(createQuote)
    })
}


function createQuote(quote){
    let quoteUI = document.getElementById("quote-list")
    let quoteLi = document.createElement('li')
    quoteLi.classList.add("quote-card")
    quoteLi.dataset.id = quote.id
    quoteUI.appendChild(quoteLi)
    let blockQuote = document.createElement("blockquote")
    blockQuote.classList.add("blockquote")
    quoteLi.appendChild(blockQuote)
    let pQuoute = document.createElement('p')
    pQuoute.classList.add('mb-0')
    pQuoute.innerText = quote.quote
    let footerQuote = document.createElement('footer')
    footerQuote.classList.add('blockquote-footer')
    footerQuote.innerText = quote.author
    let brQuote = document.createElement('br')
    let likeButton = document.createElement('button')
    likeButton.classList.add('btn-success')
    likeButton.innerText = 'Likes:'
    let spanQuote = document.createElement('span')
    spanQuote.innerText = quote.likes.length
    likeButton.addEventListener('click', (e) => addLike(e, quote, spanQuote))
    likeButton.appendChild(spanQuote)
    let deleteButton = document.createElement('button')
    deleteButton.classList.add('btn-danger')
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener('click', (e) => deleteQuote(e, quoteLi, quote))
    blockQuote.append(pQuoute, footerQuote, brQuote, likeButton ,deleteButton)
}

function addLike(e, quote, spanQuote){
    
    let data = {quoteId: quote.id}
    


    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data) 
    }).then(res=> res.json())
    .then(res => {
        // debugger
        quote.likes.push(res)
        spanQuote.innerText = quote.likes.length  
    })


}

function deleteQuote(e, quoteLi, quote){
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
    }).then(res => res.json())
    .then(res => quoteLi.remove())



}




function newQuoteSubmit(){
   
    event.preventDefault()
    let quote = document.getElementById('new-quote').value
    let author = document.getElementById('author').value
    let data = {
        quote: quote,
        author: author,
        likes: []
    }

    fetch('http://localhost:3000/quotes', {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(res => createQuote(res))



}