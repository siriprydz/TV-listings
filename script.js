//--------LÅT STÅ-----------
// Definiera fasta "konstanter" för olika typer av animering av menyn
ANIMATION = {
  NONE: "none", // Ingen animation
  TIMER: "timer", // setInterval-baserad animation
  ALTERNATIVE: "alternative", // ytterligare alternativ
};

// Ändra värdet för att styra vilken meny-animation som ska användas
window.MENU_ANIMATION_MODE ??= ANIMATION.NONE; // ANIMATION.TIMER (Default) = ingen animation (G-nivå), ANIMATION.TIMER // (VG-nivå), ANIMATION.ALTERNATIVE // ytterligare ett alternativ (VG-nivå);

/*
 Användningsexempel för animationer beroende på inställning
*/
if (window.MENU_ANIMATION_MODE === ANIMATION.NONE) {
  console.log("Ingen meny-animation används");
} else if (window.MENU_ANIMATION_MODE === ANIMATION.TIMER) {
  console.log("Meny-animation med timer används");
} else if (window.MENU_ANIMATION_MODE === ANIMATION.ALTERNATIVE) {
  console.log("Meny-animation med alternativ metod används");
}
//--------------------------

// Menu functionality
function main() {}

let allChannelPrograms = [];
let showAllProgramsButton = true;
let menuOpen = false;
const menu = document.querySelector("ul.menu"); // menyn / the menu
let ProgramInfoDiv = document.querySelector("#js-schedule");
const loadingGif = document.querySelector("#js-loading");

document.addEventListener("DOMContentLoaded", () => {
  setChannel("svt 1");
});

function toggleMenu() {
  menuOpen = !menuOpen;
  menu.classList.toggle("menu--show", menuOpen);

  console.log("button clicked");
  changeMenuIcon(menuOpen);
  changeMenuIconBackgroundColor(menuOpen);
}

function showLoadingGif() {
  loadingGif.classList.remove("hidden");
}

function hideLoadingGif() {
  loadingGif.classList.add("hidden");
}

clearChannelInfo = () => {
  ProgramInfoDiv = document.querySelector("#js-schedule");
  ProgramInfoDiv.innerHTML = "";
};

async function setChannel(channelName) {
  renderChannelTitle(channelName);
  clearChannelInfo();
  showLoadingGif();
  const url = `./data/${channelName}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const channelProgramsArray = await response.json();
    hideLoadingGif();
    showAllProgramsButton = true;
    allChannelPrograms = channelProgramsArray;

    const upcomingChannelPrograms = upcomingPrograms(channelProgramsArray);
    renderChannelInfo(upcomingChannelPrograms);
    formatTime(upcomingChannelPrograms);
  } catch (error) {
    console.error(error.message);
  }
}

function renderChannelTitle(nameOfChannel) {
  let ChannelTitle = document.querySelector("#js-title");
  console.log(ChannelTitle);
  ChannelTitle.innerText = `${nameOfChannel}`;
  console.log(ChannelTitle);
}

function renderChannelInfo(channelProgramsArray) {
  let ProgramInfoDivContent = "";
  let showPreviousBtn = "";
  if (showAllProgramsButton) {
    showPreviousBtn = `<li class="list-group-item show-previous">Visa tidigare program</li>`;
  }
  ProgramInfoDiv.innerHTML = showPreviousBtn + ProgramInfoDivContent;

  showPreviousBtn = document.querySelector(".show-previous");
  if (showPreviousBtn) {
    showPreviousBtn.addEventListener("click", (event) => {
      showAllProgramsButton = false;
      console.log("visar alla program");
      console.log(allChannelPrograms);
      showAllPrograms(ProgramsInOrder(allChannelPrograms));
    });
  }
  ProgramInfoDiv.appendChild(createProgramList(channelProgramsArray));
}

function showAllPrograms(programs) {
  renderChannelInfo(programs);
}

function upcomingPrograms(programs) {
  const currentTime = new Date();
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes(); //Minutes since midight

  const upcomingPrograms = programs.filter((program) => {
    const programDate = new Date(program.start);
    const programMinutes =
      programDate.getHours() * 60 + programDate.getMinutes();
    return programMinutes >= nowMinutes;
  });
  console.log(upcomingPrograms);
  return ProgramsInOrder(upcomingPrograms);
}

function ProgramsInOrder(programs) {
  programs.sort((aProgram, bProgram) => {
    const aDate = new Date(aProgram.start);
    const bDate = new Date(bProgram.start);

    const aMinutes = aDate.getHours() * 60 + aDate.getMinutes();
    const bMinutes = bDate.getHours() * 60 + bDate.getMinutes();

    return aMinutes - bMinutes;
  });

  return programs;
}

function createProgramList(programs) {
  let ul = document.createElement("ul");
  ul.classList.add("list-group", "list-group-flush");
  programs.forEach((program) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item");

    const date = new Date(program.start);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const stringHours = hours < 10 ? "0" + hours : hours;
    const stringMinutes = minutes < 10 ? "0" + minutes : minutes;
    const timeString = stringHours + ":" + stringMinutes;

    li.innerHTML = ` <strong>${timeString}</strong>
    <div>${program.name}</div>`;
    ul.appendChild(li);
  });
  return ul;
}

function changeMenuIcon(isOpen) {
  let menuIcon = document.querySelector("i");

  if (isOpen) {
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");
  } else {
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");
  }
}

function changeMenuIconBackgroundColor(isOpen) {
  if (isOpen) {
    let MenuIconCssRule = document.styleSheets[2].cssRules[6].style;
    let MenuIconBackgroundcolor = MenuIconCssRule.setProperty(
      "background-color",
      "azure"
    );
    let MenuIconBorderRadius = MenuIconCssRule.setProperty(
      "border-radius",
      "10px"
    );
  } else {
    let MenuIconCssRule = document.styleSheets[2].cssRules[6].style;
    let MenuIconBackgroundcolor = MenuIconCssRule.setProperty(
      "background-color",
      "transparent"
    );
    let MenuIconBorderRadius = MenuIconCssRule.setProperty(
      "border-radius",
      "0px"
    );
  }
}
