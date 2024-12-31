const dispGrid = document.querySelector('.display-style span:nth-of-type(1)');
const dispList = document.querySelector('.display-style span:nth-of-type(2)');
const searchBar = document.getElementById('searchBar');
const btnSearch = document.getElementById('btnSearch');
const pokemonBox = document.getElementById('pokemonBox');
const imgSelectedPokemon = document.getElementById('imgSelectedPokemon');
const pokemonInfoBox = document.getElementById('pokemonInfoBox');
const infoCard = document.getElementById('infoCard');
const defaultPhrase = document.getElementById('defaultPhrase');
const pokemonInfos = document.getElementById('pokemonInfos');

const pokemonsArr = [];
let pokeCount;

document.addEventListener('load', init());

function init() {
  getAllPokemonCount();
  pokemonBox.innerHTML = '';
}

async function getAllPokemonCount() {
  try {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=10000'
    );
    const data = await response.json();
    pokeCount = data.results.length;
    getAllPokemon();
  } catch (error) {
    console.log(error);
  }
}

async function getAllPokemon() {
  for (let i = 0; i < pokeCount; i++) {
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon/' + (i + 1)
      );
      const data = await response.json();
      pokemonsArr.push(data);
      showPokemon(data);
    } catch (error) {
      console.log(error);
    }
  }
}

async function showPokemon(pokemon) {
  // console.log(pokemon);

  const newCol = document.createElement('div');
  newCol.classList.add('col-4', 'd-flex', 'justify-content-center');

  const newCard = document.createElement('div');
  newCard.classList.add('card', 'position-relative');
  newCard.setAttribute(
    'onclick',
    `showInfoAbout(${pokemon.id}, "${pokemon.species.url}")`
  );

  const newImg = document.createElement('img');
  newImg.classList.add('pokeSprite');
  newImg.src = pokemon.sprites.other.home.front_default;
  newImg.alt = pokemon.name;

  const newBody = document.createElement('div');
  newBody.classList.add('card-body', 'text-center', 'mt-3');

  const newNumber = document.createElement('p');
  newNumber.classList.add('card-text', 'my-1');
  newNumber.innerText = `N° ${pokemon.id}`;

  const newTitle = document.createElement('h5');
  newTitle.classList.add('card-title');
  newTitle.innerText = pokemon.name;

  const newTypeBox = document.createElement('div');
  newTypeBox.classList.add('type');
  for (let i = 0; i < pokemon.types.length; i++) {
    const newType = document.createElement('span');
    newType.innerText = pokemon.types[i].type.name;
    newType.classList.add(
      `type-${pokemon.types[i].type.name}`,
      'd-inline-block',
      'rounded-2',
      'px-2',
      'py-1',
      'm-1'
    );
    newTypeBox.appendChild(newType);
  }

  newCard.appendChild(newImg);
  newBody.appendChild(newNumber);
  newBody.appendChild(newTitle);
  newBody.appendChild(newTypeBox);
  newCard.appendChild(newBody);
  newCol.appendChild(newCard);
  pokemonBox.appendChild(newCol);
}

function showInfoAbout(num, url) {
  const species = getSpecies(url);
  infoCard.style.animation = 'slide 2s linear forwards';

  const pokemon = pokemonsArr[num - 1];
  console.log(pokemon);

  setTimeout(() => {
    if (pokemon.sprites.other.showdown.front_default) {
      imgSelectedPokemon.src = pokemon.sprites.other.showdown.front_default;
    } else {
      imgSelectedPokemon.src = pokemon.sprites.other.home.front_default;
    }
    imgSelectedPokemon.classList.remove('w-50');
    imgSelectedPokemon.style.height = '100px';

    defaultPhrase.setAttribute('hidden', 'true');
    pokemonInfos.classList.remove('d-none');
  }, 1000);

  setTimeout(() => {
    infoCard.style.animation = '';
  }, 2000);
}

async function getSpecies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
