document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.getElementById("quote-list")
  const addQuoteForm = document.getElementById("new-quote-form")
  const sortButton = document.createElement("button")
  sortButton.innerText = "Sort by Author"
  document.querySelector("h1").after(sortButton)
  let byId = true

  sortButton.addEventListener("click", () => {byId = !byId; getQuotes()})

  // failed to use built-in API query for sort=author
  // sortButton.addEventListener("click", () => getSortedQuotes())
  // function getSortedQuotes() {
  //   while (quoteList.firstChild) {quoteList.removeChild(quoteList.firstChild)}
  //   fetch("http://localhost:3000/quotes?_embed=likes?_sort=author")  -- combine embed and sort??
  //     .then(resp => resp.json())
  //     .then(quotes => renderQuotes(quotes))
  // }

  function getQuotes() {
    while (quoteList.firstChild) {quoteList.removeChild(quoteList.firstChild)}
    fetch("http://localhost:3000/quotes?_embed=likes")
      .then(resp => resp.json())
      .then(quotes => renderQuotes(quotes))
    }

  function renderQuotes(quotes){
    if (byId) {quotes.forEach(quote => renderQuote(quote))}
    else {
      function compare( a, b ) {
        if ( a.author < b.author ){
          return -1;
        }
        if ( a.author > b.author ){
          return 1;
        }
        return 0;
      }
    quotes.sort(compare).forEach(quote => renderQuote(quote));
  }
}

  function renderQuote(quote){
    const newLi = document.createElement("li")
    const newBlock = document.createElement("blockquote")
    const newP = document.createElement("p")
    const newFooter = document.createElement("footer")
    const newBr = document.createElement("br")
    const newLikeButton = document.createElement("button")
    const newDeleteButton = document.createElement("button")
    const newEditButton = document.createElement("button")
    const newEditForm = document.createElement("form")
    const inputField = document.createElement("textarea")
    const inputSubmit = document.createElement("input")

    const likeSum = quote.likes.length

    newP.innerText = quote.quote
    newFooter.innerText = quote.author
    newLikeButton.innerHTML = `Likes: <span>${likeSum}</span>`
    newDeleteButton.innerText = "Delete"
    newEditButton.innerText = "Edit"
    newEditForm.style.display = "none"
    inputField.name = "newQuoteText"
    inputField.value = quote.quote
    inputSubmit.type = "submit"
    inputSubmit.value = "Save"

    newLi.className = `quote-card cardId-${quote.id}`
    newLi.id = `cardId-${quote.id}`
    newLi.dataset.id = `${quote.id}`
    newBlock.className = "blockquote"
    newP.className = "mb-0"
    newFooter.className = "blockquote-footer"
    newLikeButton.className = "btn-success"
    newDeleteButton.className = "btn-danger"

    quoteList.appendChild(newLi)
    newLi.appendChild(newBlock)
    newBlock.appendChild(newP)
    newBlock.appendChild(newEditForm)
    newEditForm.appendChild(inputField)
    newEditForm.appendChild(inputSubmit)
    newBlock.appendChild(newFooter)
    newBlock.appendChild(newBr)
    newBlock.appendChild(newLikeButton)
    newBlock.appendChild(newDeleteButton)
    newBlock.appendChild(newEditButton)

    newLikeButton.addEventListener("click", e => likeQuote(e, newLikeButton))
    newDeleteButton.addEventListener("click", e => deleteQuote(e, newLi))
    newEditButton.addEventListener("click", e => {newEditForm.style.display = "block"})
    newEditForm.addEventListener("submit", e => updateQuote(e, newLi))

    function likeQuote(e){
      toLikeId = Number(newLi.id.split("-")[1])
      currentLikeCount = Number(newLikeButton.querySelector("span").innerText)
      const likeData = {
        quoteId: toLikeId,
        createdAt: Math.floor(new Date().getTime()/1000.0)
      }
      fetch(`http://localhost:3000/likes/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(likeData)
      })
        .then(resp => resp.json())
        .then(data => newLikeButton.innerHTML = `Likes: <span>${currentLikeCount + 1}</span>`)
    }

    function deleteQuote(e){
      toDeleteId = newLi.id.split("-")[1]
      fetch(`http://localhost:3000/quotes/${toDeleteId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
      })
        .then(resp => resp.json())
        .then(json => newLi.remove())
    }

    function updateQuote(e, newLi){
      e.preventDefault()
      toEditId = Number(newLi.id.split("-")[1])
      const newText = e.target[0].value
      fetch(`http://localhost:3000/quotes/${toEditId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"quote": `${newText}`})
      })
        .then(resp => resp.json())
        .then(data => executeQuoteUpdate(e, newLi, newText))
    }

    function executeQuoteUpdate(e, newLi, newText){
      newLi.querySelector("p").innerText = `${newText}`
      newLi.querySelector("form").style.display = "none"
    }
  }

  addQuoteForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const data = {
      quote: e.target[0].value,
      author: e.target[1].value
    }
    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(json => renderQuote(data))
    })

  getQuotes()
})
