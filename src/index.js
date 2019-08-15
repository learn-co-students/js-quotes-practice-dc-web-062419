document.addEventListener('DOMContentLoaded', ()=>{
    console.log(`I sometimes see you outside my door /
    henlo, is it me you're looking for?`)
    fetchQuotes()
    const quoteForm = document.querySelector("form")
    quoteForm.addEventListener("submit", addNewQuote)
})

function addNewQuote(event){
    event.preventDefault()
    
    const newQuote = event.target.querySelector('#new-quote').value
    const newAuthor = event.target.querySelector('#author').value

    if (newQuote === '' || newAuthor === '') {
        alert('Hi there! Please fill out both quote text body and its author.')
    } else {
        let data = {
            quote: newQuote,
            author: newAuthor
        }
    postQuote(data)
    document.querySelector('form').reset()
    }
}

function postQuote(data){
    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
    const editButton = document.createElement('button')

    // adding class names to elements 
    quoteLi.classList.add('quote-card')
    quoteLi.dataset.quoteId = quote.id
    blockQuote.classList.add('blockquote')
    quoteP.classList.add('mb-0')
    newFooter.classList.add('blockquote-footer')
    likeButton.classList.add('btn-success')
    deleteButton.classList.add('btn-danger')
    editButton.classList.add('btn-edit')

    // adding all the innerText/HTML
    quoteP.innerText = quote.quote
    newFooter.innerText = quote.author
    deleteButton.innerText = 'Delete'
    if (quote.likes) {
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`;
        likeButton.addEventListener('click', likeQuote)
    } else {
        likeButton.innerHTML = `Likes: <span>0</span>`;
        likeButton.addEventListener('click', likeQuote)
    }
    editButton.innerText = 'Edit'
    editButton.dataset.quoteId = quote.id 

    // appending ALL the children
    blockQuote.append(quoteP, newFooter, lineBreak, likeButton, deleteButton, editButton)
    quoteLi.appendChild(blockQuote)
    quoteUl.appendChild(quoteLi)

    // adding event listeners to buttons
    deleteButton.addEventListener('click', deleteQuote)
    editButton.addEventListener('click', editQuote)
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
            quoteId: quoteIdForLikes,
            createdAt: Date.parse(new Date())
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

function editQuote(event){
    const block = event.target.parentElement
    const editForm = document.createElement('form')
    editForm.innerHTML = buildEditForm(event)
    
    block.appendChild(editForm)

    const quoteId = event.target.dataset.quoteId
    const quoteP = event.target.parentNode.querySelector('p')
    const authorFooter = event.target.parentNode.querySelector('footer')

    editForm.addEventListener('submit', (event) => handleEdit(event, quoteId, quoteP, authorFooter))
}

function handleEdit(event, quoteId, quoteP, authorFooter){
    event.preventDefault()

    const updatedText = event.target.querySelector('#edit-quote').value
    const updatedAuthor = event.target.querySelector('#edit-author').value

    const updatedData = {
        quote: updatedText,
        author: updatedAuthor
    }
    patchQuote(updatedData, quoteId, quoteP, authorFooter, event)
}

function patchQuote(updatedData, quoteId, quoteP, authorFooter, event) {
    const configObject = {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    }

    fetch(`http://localhost:3000/quotes/${quoteId}`, configObject)
        .then(res => res.json())
        .then(updated => {
            quoteP.innerText = updated.quote
            authorFooter.innerText = updated.author
        })

    event.currentTarget.remove()
}

function buildEditForm(event){
    return `
    <label for="edit-quote">Edit Quote</label>
    <input type="text" class="form-control" id="edit-quote" value="${event.target.parentNode.querySelector('p').innerText}" ></input><br>
    <label for="edit-author">Edit Author</label>
    <input type="text" class="form-control" id="edit-author" value="${event.target.parentNode.querySelector('footer').innerText}"></input>
    <input type="submit" class="btn btn-primary" id="edit-submit"></input>
    `  
}