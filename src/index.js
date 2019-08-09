document.addEventListener('DOMContentLoaded', async () => {
  quotes = await getQuotes();
  renderQuotes(quotes);
});

async function getQuotes() {
  // fetches the quotes from the db
  const res = await fetch('http://localhost:3000/quotes?_embed=likes');
  return await res.json();
}

function renderQuotes(quotes) {
  // appends a quoteCard to the dom for every quote in the quotes array
  quoteConatiner = document.querySelector('#quote-list');
  quotes.forEach(quote => quoteConatiner.appendChild(createQuoteCard(quote)));
}

function createQuoteCard(quote) {
  // returns a single quote div
  quoteCard = document.createElement('div');
  quoteCard.dataset.id = quote.id;
  quoteCard.innerHTML = `
    <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${
          quote.likes.length
        }</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li>
  `;
  quoteCard.querySelector('.btn-success').dataset.id = quote.id;
  quoteCard.querySelector('.btn-success').addEventListener('click', likeQuote);
  quoteCard.querySelector('.btn-danger').dataset.id = quote.id;
  quoteCard.querySelector('.btn-danger').addEventListener('click', deleteQuote);
  return quoteCard;
}

async function likeQuote(e) {
  await fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ quoteId: parseInt(e.target.dataset.id, 10) }),
  });
  debugger;
  // this does not function is you click the actual number on the button
  e.currentTarget.children[0].innerText =
    parseInt(e.currentTarget.children[0].innerText, 10) + 1;
}

async function deleteQuote(e) {
  // send delete request to the db
  quoteId = e.target.dataset.id;
  await fetch(`http://localhost:3000/likes/${quoteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // remove the quote from the dom
  document.querySelector(`div[data-id="${quoteId}"]`).remove();
}
