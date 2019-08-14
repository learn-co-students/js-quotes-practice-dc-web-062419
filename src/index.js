// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(){
 fetchQuotes()

 let form = document.querySelector('form')
 form.addEventListener('submit', addQuote)
})


//part of displaying quotes
let quotes = function(){
    return document.querySelector('#quote-list')
}

function fetchQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes').then(resp => resp.json()).then(quotes => quotes.forEach(displayQuote))
}


function displayQuote(quote){
    let newLi = document.createElement('li')
    newLi.className = 'quote-card'
    quotes().appendChild(newLi)

    let block = document.createElement('blockquote')
    block.className = 'blockquote'
    newLi.appendChild(block)

    let p = document.createElement('p')
    p.className = 'mb-0'
    p.innerText = quote.quote
    block.appendChild(p)

    let footer = document.createElement('footer')
    footer.className = "blockquote-footer"
    footer.innerText = quote.author
    block.appendChild(footer)

    let space = document.createElement('br')
    block.appendChild(space)

    let likeBttn = document.createElement('button')
    likeBttn.className = 'btn-success'
    likeBttn.innerHTML = `Likes: <span>${areLikes(quote)}</span>`
    likeBttn.dataset.id = quote.id
    block.appendChild(likeBttn)

    likeBttn.addEventListener('click', likeQuote)

    let delBttn = document.createElement('button')
    delBttn.className = 'btn-danger'
    delBttn.innerText = "Delete"
    delBttn.dataset.id = quote.id
    block.appendChild(delBttn)

    delBttn.addEventListener('click', deleteQuote)

    let editBttn = document.createElement('button')
    editBttn.innerText = "Edit"
    editBttn.dataset.id = quote.id
    editBttn.className = "btn-edit"
    block.appendChild(editBttn)

    editBttn.addEventListener('click', editQuote)
}
//end of displaying quotes

/////editQuote

function editQuote(e){
    console.log("hit edit")
    debugger
  let newForm = document.createElement('form')
  newForm.innerHTML = editForm(e)
    e.target.parentElement.appendChild(newForm)
    let id = e.target.dataset.id
    let p = e.target.parentElement.querySelector('p')
    let footer = e.target.parentElement.querySelector('footer')

    newForm.addEventListener('submit', (e) => manageEdit(e, id, p, footer, newForm))
}

function manageEdit(e, id, p, footer, newForm){
    e.preventDefault()
    console.log('hit edit submit')

    let newQuote = document.querySelector('#edit-quote').value
    let newAuthor = document.querySelector('#edit-author').value

    let data = {quote: newQuote, author: newAuthor}
    let configData = {
        method: 'PATCH',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
    }   

    fetch(`http://localhost:3000/quotes/${id}`, configData).then(resp => resp.json()).then(data => {
        console.log(data);
        p.innerText = data.quote
        footer.innerText = data.author
        newForm.remove()
    })

}



function editForm(e){
    return`
    <label for="edit-quote">Edit Quote</label>
    <input type="text" class="form-control" id="edit-quote" value="${e.target.parentElement.querySelector('p').innerText}" ></input><br>
    <label for="edit-author">Edit Author</label>
    <input type="text" class="form-control" id="edit-author" value="${e.target.parentElement.querySelector('footer').innerText}"></input>
    <input type="submit" class="btn btn-primary" id="edit-submit"></input>
    `
}

/////like quote

function likeQuote(e){
    console.log('hit like')
    data = {quoteId: parseInt(e.target.dataset.id), createdAt: Date.parse(new Date())}

    configObj = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch('http://localhost:3000/likes', configObj).then(resp => resp.json()).then(data => {console.log(data); 
    let newNum = parseInt(e.target.parentElement.querySelector('span').innerText) + 1;
    debugger
    e.target.parentElement.querySelector('span').innerText = newNum})
    debugger
}

////delete quote
function deleteQuote(e){
    console.log('hit delete')
    let configObj = {
        method: 'DELETE',
        headers: {
            "Content-Type": 'application/json'
        }
    }
    fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, configObj).then(resp => resp.json()).then(data => {console.log(data); e.target.parentElement.parentElement.remove()})
 
}

//add quote upon submission of form

function addQuote(e){
    e.preventDefault()
    console.log('prevented')

    let newQuote = document.querySelector('#new-quote')
    let newAuthor = document.querySelector('#author')

    let data = {quote: newQuote.value, author: newAuthor.value}

    configObj = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch('http://localhost:3000/quotes', configObj).then(resp => resp.json()).then(data => displayQuote(data))

    newQuote.value = ''
    newAuthor.value= ''

}

function areLikes(quote){
    if (quote.likes) {
       return quote.likes.length
    } else {
        return 0
    }
}