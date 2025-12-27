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

function toggleMenu() {
  console.log("button clicked");
  revealMenu();
  changeMenuIcon();
  changeMenuIconBackgroundColor();
}

const loadingGif = document.querySelector("#js-loading");

function showLoadingGif() {
  loadingGif.classList.remove("hidden");
}

function hideLoadingGif() {
  loadingGif.classList.add("hidden");
}

async function setChannel(channelName) {
  const url = `./data/${channelName}.json`;
  showLoadingGif();
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
    renderChannelTitle(channelName);
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
  let ProgramInfoDiv = document.querySelector("#js-schedule");
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

function revealMenu() {
  let UlMenuCssRule = document.styleSheets[2].cssRules[8].style;
  let UlMenuPosition = UlMenuCssRule.setProperty("left", "0px");
}

function changeMenuIcon() {
  let menuIcon = document.querySelector("i");
  menuIcon.classList.remove("fas", "fa-bars");
  const crossIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-x" viewBox="3 2.9 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>`;
  let iconDiv = document.querySelector("i");
  iconDiv.innerHTML = crossIcon;
}

function changeMenuIconBackgroundColor() {
  let MenuIconCssRule = document.styleSheets[2].cssRules[6].style;
  let MenuIconBackgroundcolor = MenuIconCssRule.setProperty(
    "background-color",
    "azure"
  );
  let MenuIconBorderRadius = MenuIconCssRule.setProperty(
    "border-radius",
    "10px"
  );
}
