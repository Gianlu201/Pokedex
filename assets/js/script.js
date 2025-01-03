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
const selectedPokemonName = document.getElementById('selectedPokemonName');
const selectedPokemonNumer = document.getElementById('selectedPokemonNumer');
const selectedPokemonTypeBox = document.getElementById(
  'selectedPokemonTypeBox'
);
const selectedPokemonDescription = document.getElementById(
  'selectedPokemonDescription'
);
const selectedPokemonHeight = document.getElementById('selectedPokemonHeight');
const selectedPokemonWeight = document.getElementById('selectedPokemonWeight');
const selectedPokemonAbilityBox = document.getElementById(
  'selectedPokemonAbilityBox'
);
const selectedPokemonEvolutionChain = document.getElementById(
  'selectedPokemonEvolutionChain'
);
const selType = document.getElementById('selType');
const selGen = document.getElementById('selGen');

const pokemonsArr = [];
const pokemonsSpeciesArr = [];
let pokeCount;
let searchedPokemons = [];

document.addEventListener('load', init());

document.addEventListener('scroll', () => {
  if (window.scrollY < 900) {
    document.getElementById('goTop').classList.add('d-none');
  }
  if (window.scrollY > 900) {
    document.getElementById('goTop').classList.remove('d-none');
  }
});

btnSearch.addEventListener('click', () => {
  searchPokemon(true);
  searchBar.blur();
});

searchBar.addEventListener('keyup', (key) => {
  if (key.code != 'Enter') {
    searchPokemon(false);
  } else {
    searchPokemon(true);
    searchBar.blur();
  }
});

function init() {
  getAllPokemonCount();
  pokemonBox.innerHTML = '';
  setTimeout(() => {
    document.getElementById('bigCol').classList.remove('d-none');
    document.getElementById('infoCol').classList.remove('d-none');
    document.getElementById('bigLoader').classList.add('d-none');
  }, 7000);
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
  for (let i = 0; i < Math.min(pokeCount, 1025); i++) {
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon/' + (i + 1)
      );
      const data = await response.json();
      pokemonsArr.push(data);
      getPokemonSpecies(data.species.url);
      if (data.id == 1025) {
        console.log('fine');
      }
      showPokemon(data);
    } catch (error) {
      console.log(error);
    }
  }
}

//------

async function getPokemonSpecies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // getEvolutionChain(data.evolution_chain.url);
    pokemonsSpeciesArr.push(data);
  } catch (error) {
    console.log(error);
  }
}

//------

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
  const index = num - 1;

  const species = pokemonsSpeciesArr[index];
  getEvolutionChain(species.evolution_chain.url);

  infoCard.style.animation = 'slide 4s linear forwards';

  const pokemon = pokemonsArr[index];
  console.log(pokemon);

  setTimeout(() => {
    pokemonInfos.scrollTo(0, 0);

    if (pokemon.sprites.other.showdown.front_default) {
      imgSelectedPokemon.src = pokemon.sprites.other.showdown.front_default;
    } else {
      imgSelectedPokemon.src = pokemon.sprites.other.home.front_default;
    }
    imgSelectedPokemon.classList.remove('w-50');
    imgSelectedPokemon.style.height = '100px';

    defaultPhrase.setAttribute('hidden', 'true');
    pokemonInfos.classList.remove('d-none');

    selectedPokemonName.innerText = pokemon.name;
    selectedPokemonNumer.innerText = `N° ${pokemon.id}`;

    selectedPokemonTypeBox.innerHTML = '';
    for (let i = 0; i < pokemon.types.length; i++) {
      const newType = document.createElement('span');
      newType.classList.add(
        `type-${pokemon.types[i].type.name}`,
        'mx-1',
        'py-1',
        'px-2',
        'rounded-3'
      );
      newType.innerText = pokemon.types[i].type.name;

      selectedPokemonTypeBox.appendChild(newType);
    }

    let next = false;
    species.flavor_text_entries.forEach((element) => {
      if (!next) {
        if (element.language.name == 'en') {
          let phrase = element.flavor_text.split('');

          let index = phrase.indexOf('\n');
          while (index > 0) {
            phrase[index] = ' ';
            index = phrase.indexOf('\n');
          }

          index = phrase.indexOf('\f');
          while (index > 0) {
            phrase[index] = ' ';
            index = phrase.indexOf('\f');
          }

          selectedPokemonDescription.innerText = phrase.join('');

          next = true;
        }
      }
    });

    if (species.color.name != 'white') {
      pokemonInfos.style = `--color: ${species.color.name}`;
    } else {
      pokemonInfos.style = `--color: #cecece`;
    }

    selectedPokemonHeight.innerText = `${pokemon.height / 10}m`;
    selectedPokemonWeight.innerText = `${pokemon.weight / 10}kg`;

    selectedPokemonAbilityBox.innerHTML = '';
    for (let i = 0; i < Math.min(pokemon.abilities.length, 2); i++) {
      const newCol = document.createElement('div');
      newCol.classList.add('col-6');

      const newParagraph = document.createElement('p');
      newParagraph.classList.add('text-center', 'ability');
      newParagraph.innerText = pokemon.abilities[i].ability.name;

      newCol.appendChild(newParagraph);
      selectedPokemonAbilityBox.appendChild(newCol);
    }

    let total = 0;
    pokemon.stats.forEach((element) => {
      total += element.base_stat;
      switch (element.stat.name) {
        case 'hp':
          document.getElementById('selectedPokemonHp').innerText =
            element.base_stat;
          break;
        case 'attack':
          document.getElementById('selectedPokemonAttack').innerText =
            element.base_stat;
          break;
        case 'defense':
          document.getElementById('selectedPokemonDefense').innerText =
            element.base_stat;
          break;
        case 'special-attack':
          document.getElementById('selectedPokemonSpecialAttack').innerText =
            element.base_stat;
          break;
        case 'special-defense':
          document.getElementById('selectedPokemonSpecialDefense').innerText =
            element.base_stat;
          break;
        case 'speed':
          document.getElementById('selectedPokemonSpeed').innerText =
            element.base_stat;
          break;
      }
    });
    document.getElementById('selectedPokemonTotalStats').innerText = total;
  }, 1000);

  setTimeout(() => {
    infoCard.style.animation = '';
  }, 4000);
}

async function getEvolutionChain(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    showEvolutionChain(data);
  } catch (error) {
    console.log(error);
  }
}

async function showEvolutionChain(evolutions) {
  let chain = 1;
  let evolution1 = await getMyPokemon(evolutions.chain.species.url);
  let evolution2;
  let evolution3;
  const evolution1Img = document.createElement('img');
  const evolution2Img = document.createElement('img');
  const evolution3Img = document.createElement('img');
  const evolutionImgs = [evolution1Img, evolution2Img, evolution3Img];
  const lbl1 = document.createElement('span');
  let lbl2 = document.createElement('span');
  const labels = [lbl1, lbl2];

  evolutionImgs.forEach((img) => {
    img.classList.add('d-inline-block', 'evolutionImg');
  });

  labels.forEach((label) => {
    label.classList.add('d-inline-block', 'level');
  });

  evolution1Img.src = evolution1.sprites.front_default;
  evolution1Img.setAttribute(
    'onclick',
    `showInfoAbout(${evolution1.id}, "${evolution1.species.url}")`
  );

  console.log(evolutions.chain.species.name);
  if (evolutions.chain.evolves_to.length > 0) {
    chain++;
    evolution2 = await getMyPokemon(evolutions.chain.evolves_to[0].species.url);
    evolution2Img.src = evolution2.sprites.front_default;
    evolution2Img.setAttribute(
      'onclick',
      `showInfoAbout(${evolution2.id}, "${evolution2.species.url}")`
    );
    if (evolutions.chain.evolves_to[0].evolution_details[0].min_level) {
      lbl1.innerText = `Lv. ${evolutions.chain.evolves_to[0].evolution_details[0].min_level}`;
    } else if (
      evolutions.chain.evolves_to[0].evolution_details[0].trigger.name ==
      'use-item'
    ) {
      lbl1.innerText = `Item`;
      lbl1.setAttribute('data-bs-toggle', 'popover');
      lbl1.setAttribute('data-bs-trigger', 'hover focus');
      lbl1.setAttribute('data-bs-placement', 'bottom');
      lbl1.setAttribute(
        'data-bs-content',
        `${evolutions.chain.evolves_to[0].evolution_details[0].item.name}`
      );
      lbl1.style.cursor = 'pointer';
      console.log(
        evolutions.chain.evolves_to[0].evolution_details[0].item.name
      );
    } else {
      lbl1.innerText = 'Lv. ???';
    }
    console.log(evolutions.chain.evolves_to[0].species.name);
    if (evolutions.chain.evolves_to[0].evolves_to.length > 0) {
      chain++;
      evolution3 = await getMyPokemon(
        evolutions.chain.evolves_to[0].evolves_to[0].species.url
      );
      evolution3Img.src = evolution3.sprites.front_default;
      evolution3Img.setAttribute(
        'onclick',
        `showInfoAbout(${evolution3.id}, "${evolution3.species.url}")`
      );
      if (
        evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0]
          .min_level
      ) {
        lbl2.innerText = `Lv. ${evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level}`;
      } else if (
        evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0]
          .trigger.name == 'use-item'
      ) {
        lbl2.innerText = 'Item';
        lbl2.setAttribute('data-bs-toggle', 'popover');
        lbl2.setAttribute('data-bs-trigger', 'hover');
        lbl2.setAttribute('data-bs-placement', 'bottom');
        lbl2.setAttribute(
          'data-bs-content',
          `${evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0].item.name}`
        );
        lbl2.style.cursor = 'pointer';
      } else {
        lbl2.innerText = 'Lv. ???';
      }
      console.log(evolutions.chain.evolves_to[0].evolves_to[0].species.name);
    }
  }

  selectedPokemonEvolutionChain.innerHTML = '';

  switch (chain) {
    case 1:
      selectedPokemonEvolutionChain.appendChild(evolution1Img);
      break;
    case 2:
      selectedPokemonEvolutionChain.appendChild(evolution1Img);
      selectedPokemonEvolutionChain.appendChild(lbl1);
      selectedPokemonEvolutionChain.appendChild(evolution2Img);
      break;
    case 3:
      selectedPokemonEvolutionChain.appendChild(evolution1Img);
      selectedPokemonEvolutionChain.appendChild(lbl1);
      selectedPokemonEvolutionChain.appendChild(evolution2Img);
      selectedPokemonEvolutionChain.appendChild(lbl2);
      selectedPokemonEvolutionChain.appendChild(evolution3Img);
      break;
  }

  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
}

async function getMyPokemon(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    let myPokemon = await getSinglePokemon(data.varieties[0].pokemon.url);

    return myPokemon;
  } catch (error) {
    console.log(error);
  }
}

async function getSinglePokemon(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

function searchPokemon(clean) {
  searchedPokemons = [];
  for (let i = 0; i < pokemonsArr.length; i++) {
    if (
      pokemonsArr[i].name.indexOf(searchBar.value.trim().toLowerCase()) >= 0
    ) {
      switch (true) {
        case selType.value != '' && selGen.value != '':
          pokemonsArr[i].types.forEach((type) => {
            if (
              type.type.name == selType.value &&
              pokemonsSpeciesArr[i].generation.name == selGen.value
            ) {
              searchedPokemons.push(pokemonsArr[i]);
            }
          });
          break;
        case selType.value != '':
          pokemonsArr[i].types.forEach((type) => {
            if (type.type.name == selType.value) {
              searchedPokemons.push(pokemonsArr[i]);
            }
          });
          break;
        case selGen.value != '':
          if (pokemonsSpeciesArr[i].generation.name == selGen.value) {
            searchedPokemons.push(pokemonsArr[i]);
          }
          break;
        default:
          searchedPokemons.push(pokemonsArr[i]);
          break;
      }
    }
  }
  showSearchedPokemon(searchedPokemons);
  if (clean) {
    searchBar.value = '';
    selType.value = '';
    selGen.value = '';
  }
}

function showSearchedPokemon(pokemons) {
  if (pokemons.length > 0) {
    pokemonBox.innerHTML = '';
    pokemons.forEach((pokemon) => {
      showPokemon(pokemon);
    });
  }
}
