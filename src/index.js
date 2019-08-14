// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const list = document.getElementById("quote-list")

document.addEventListener("DOMContentLoaded", event => {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(res => res.forEach(quote => {showQuote(quote)}))
    const form = document.getElementById("new-quote-form")
    form.addEventListener("submit", event => coinNewPhrase(event))
})

function coinNewPhrase(event) {
    event.preventDefault()
    let quoteText = document.getElementById("new-quote").value
    let quoteAuthor = document.getElementById("author").value
    data = {quote: quoteText, author: quoteAuthor, likes: [] }
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => showQuote(res))
    // console.log("Making fetch happen")
}


function showQuote(quote){
    let line = document.createElement("li")
    let bq = document.createElement("blockquote")
    let para = document.createElement("p")
    let footer = document.createElement("footer")
    let buttonSuccess = document.createElement("button")
    let buttonDanger = document.createElement("button")
    para.innerText = quote.quote;
    footer.innerText = quote.author
    // if (quote.likes) {
        buttonSuccess.innerText = `Likes ${quote.likes.length}`
    // }
    buttonDanger.innerText = "Delete"
    buttonSuccess.classList.add("btn-success")
    buttonDanger.classList.add("btn-danger")
    buttonSuccess.addEventListener("click", addLike)
    buttonDanger.addEventListener("click", event => unlearnQuote(quote.id))
    footer.classList.add("blockquote-footer")
    bq.classList.add("blockquote")
    bq.id = quote.id
    line.classList.add("quote-card")
    bq.append(para, footer, document.createElement("br"), buttonSuccess, buttonDanger)
    line.append(bq)
    list.prepend(line);
}


function addLike(){
    let id = event.target.parentElement.id
    fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({quoteId: parseInt(id)}),
    })
    let button = event.target
    let newTally = parseInt(button.innerText.split(" ")[1])+1
    button.innerText = `Likes ${newTally}`
    
    console.log("you like this, but you probably won't embody this")
}

function unlearnQuote(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE"
    })
    block = event.target.parentElement.parentElement
    block.remove()
    console.log("you can erase this text bt you can't unlearn it")
}