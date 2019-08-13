// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(){
    fetchAllQuotes()
        let qForm = document.getElementById("new-quote-form")
            qForm.addEventListener('submit', addQuote)
})

function addQuote(e){
    e.preventDefault()
    const newQuote = document.getElementById("new-quote")
    const newAuthor = document.getElementById("author")
    let data = {
        quote: newQuote.value,
        author: newAuthor.value
    }
    fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(newQ => {
        renderQuotes(newQ)
    })
            newQuote.value = ""
            newAuthor.value = ""
}


function fetchAllQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotesArray =>{
        quotesArray.forEach((quote) => {
            renderQuotes(quote)
        })
    })
}


function renderQuotes(quote){
    
    const quoteList = document.getElementById("quote-list")
    const quoteLi = document.createElement('li')
    const quoteBlock = document.createElement('blockquote')
    const quoteP = document.createElement('p')
    const quoteFoot = document.createElement("footer")
            const likeButton = document.createElement('button')
            const deleteButton = document.createElement('button')
                const qSpan = document.createElement('span')

    quoteLi.className = "quote-card"
    quoteBlock.className = "blockquote"
    quoteP.className = "mb-0"
    quoteFoot.className = 'blockquote-footer'
            likeButton.className = 'btn-success'
            deleteButton.className = 'btn-danger'

    quoteList.appendChild(quoteLi)
    quoteLi.appendChild(quoteBlock)
    quoteBlock.append(quoteP, quoteFoot, likeButton, deleteButton)
    
    quoteP.innerText = quote.quote
    quoteFoot.innerText = quote.author
    deleteButton.innerText = "Delete"
    likeButton.innerText = `Likes: `
    likeButton.appendChild(qSpan)
    
    if (quote.likes){

     qSpan.innerText = `${quote.likes.length}`
     debugger
    }
    else{
        qSpan.innerText = "0"
    }
    
     deleteButton.addEventListener("click", (e) => {deleteQuote(e, quote, quoteLi)})
    
      likeButton.addEventListener("click", (e) => {addLikes(e, quote, qSpan)})
        }
        
     function addLikes(e, quote, qSpan){
         let data = {
            quoteId: quote.id
         }
         fetch("http://localhost:3000/likes",{
             method: "POST",
             headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(() => { 
            let num = parseInt(qSpan.innerText) + 1
            qSpan.innerText = num
        })

        
     }


        function deleteQuote(e, quote, quoteLi){
                fetch(`http://localhost:3000/quotes/${quote.id}`, {
                    method: 'DELETE',
            })
            .then(res => res.json())
            .then(() =>  quoteLi.remove()
            )
      
        }