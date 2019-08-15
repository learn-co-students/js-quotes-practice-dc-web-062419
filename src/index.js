
let likes = 0 

document.addEventListener("DOMContentLoaded", async () => {
    document.querySelector("form").addEventListener("submit", submitHandler)
    await fetchAllQuotes()

})

function fetchAllQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(quoteArray => {
        quoteArray.forEach(renderCard)
    })}


function submitHandler(event){
    event.preventDefault()
    
    let data ={
        quote: event.target[0].value,
        author: event.target[1].value}
    
    fetch("http://localhost:3000/quotes?_embed=likes",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(renderCard)
}




function renderCard(quote){
    let list = document.getElementById("quote-list")

    
    let li = document.createElement("li")
    let blockquote = document.createElement("blockquote")
    let p = document.createElement("p")
    let br = document.createElement("br")
    let likeButton = document.createElement("button")
    let deleteButton =  document.createElement("button")
    let footer = document.createElement("footer")


    blockquote.classList.add("blockquote")
    li.id = `li-${quote.id}`
    li.classList.add("quote-card")
    p.classList.add(`mb-${quote.id}`)
    footer.classList.add("blockquote-footer")
    deleteButton.classList.add("btn-danger")
    deleteButton.addEventListener("click", deleteQuote)
    likeButton.classList.add("btn-success")
    if (quote["likes"]) {
        likeButton.innerHTML = `Likes: <span>${quote["likes"].length}</span>`;
        likeButton.addEventListener('click', likeQuote)
    } else {
        likeButton.innerHTML = `Likes: 0`;
        likeButton.addEventListener('click', likeQuote)
    }




    list.appendChild(li)
    li.appendChild(blockquote)
    blockquote.appendChild(p)
    blockquote.appendChild(footer)
    blockquote.appendChild(br)
    blockquote.appendChild(likeButton)
    blockquote.appendChild(deleteButton)
    

    likeButton.addEventListener("click", likeQuote)
  
    p.innerText = quote.quote
    footer.innerText = quote.author
    deleteButton.innerText = "Delete" 
    likeButton.id = `like-${quote.id}`
    likeButton.dataset.id = quote.id;
    deleteButton.dataset.id = quote.id;
    blockquote.dataset.id = quote.id
  
   
}
async function likeQuote(e){
    let quoteIdForLikes = parseInt(e.currentTarget.parentNode.dataset.id)
    let currentLikeCount = parseInt(e.currentTarget.innerText.split(":")[1])
     
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

function deleteQuote(e){
    let id = parseInt(e.target.dataset.id)
    fetch(`http://localhost:3000/quotes/${id}`,{
        method: "DELETE"})
        .then(res => res.json())
        .then(document.getElementById(`li-${id}`).remove())
}