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

const menu = document.querySelector("ul.menu");
const programInfoDiv = document.querySelector("#js-schedule");
const loadingGif = document.querySelector("#js-loading");
const ChannelTitle = document.querySelector("#js-title");
const menuIcon = document.querySelector("i");

document.addEventListener("DOMContentLoaded", () => {
  setChannel("svt 1");
});

function toggleMenu() {
  menuOpen = !menuOpen;
  menu.classList.toggle("menu--show", menuOpen);
  menuIcon.classList.toggle("fa-bars", !menuOpen);
  menuIcon.classList.toggle("fa-times", menuOpen);

  changeMenuIconBackgroundColor(menuOpen);
}

function showLoadingGif() {
  loadingGif.classList.remove("hidden");
}

function hideLoadingGif() {
  loadingGif.classList.add("hidden");
}

clearChannelInfo = () => {
  programInfoDiv.innerHTML = "";
};

async function setChannel(channelName) {
  renderChannelTitle(channelName);
  clearChannelInfo();
  showLoadingGif();
  try {
    const programs = await fetchChannelPrograms(channelName);

    allChannelPrograms = programs;
    showAllProgramsButton = true;

    const upcoming = upcomingPrograms(programs);
    renderChannelInfo(upcoming);
  } catch (error) {
    console.error(error);
  } finally {
    hideLoadingGif();
  }
}

async function fetchChannelPrograms(channelName) {
  const url = `./data/${channelName}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status ${response.status}`);
  }

  return response.json();
}

function renderChannelTitle(nameOfChannel) {
  ChannelTitle.innerText = `${nameOfChannel}`;
}

function renderChannelInfo(channelProgramsArray) {
  let programInfoDivContent = "";
  let showPreviousBtn = "";
  if (showAllProgramsButton) {
    showPreviousBtn = `<li class="list-group-item show-previous">Visa tidigare program</li>`;
  }
  programInfoDiv.innerHTML = showPreviousBtn + programInfoDivContent;

  showPreviousBtn = document.querySelector(".show-previous");
  if (showPreviousBtn) {
    showPreviousBtn.addEventListener("click", (event) => {
      showAllProgramsButton = false;
      showAllPrograms(ProgramsInOrder(allChannelPrograms));
    });
  }
  programInfoDiv.appendChild(createProgramList(channelProgramsArray));
}

function showAllPrograms(programs) {
  renderChannelInfo(programs);
}

function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function upcomingPrograms(programs) {
  const currentTime = new Date();
  const minutesSinceMidnighFromNow = minutesSinceMidnight(currentTime);

  const upcomingPrograms = programs.filter((program) => {
    const programDate = new Date(program.start);
    const minutesSinceMidnightFromProgramStart =
      minutesSinceMidnight(programDate);
    return minutesSinceMidnightFromProgramStart >= minutesSinceMidnighFromNow;
  });
  return ProgramsInOrder(upcomingPrograms);
}

function ProgramsInOrder(programs) {
  programs.sort((aProgram, bProgram) => {
    const aDate = new Date(aProgram.start);
    const bDate = new Date(bProgram.start);

    const aMinutes = minutesSinceMidnight(aDate);
    const bMinutes = minutesSinceMidnight(bDate);

    return aMinutes - bMinutes;
  });

  return programs;
}

function createProgramList(programs) {
  const ul = document.createElement("ul");
  ul.classList.add("list-group", "list-group-flush");

  programs.forEach((program) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const start = new Date(program.start);
    const time = formatTime(start);

    li.innerHTML = `
      <strong>${time}</strong>
      <div>${program.name}</div>
    `;

    ul.appendChild(li);
  });

  return ul;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
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
