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

function toggleMenu() {
  console.log("button clicked");
  revealMenu();
  changeMenuIcon();
  changeMenuIconBackgroundColor();
}
async function setChannel(channelName) {
  const url = `./data/${channelName}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const channelProgramsArray = await response.json();
    allChannelPrograms = channelProgramsArray;

    const upcomingChannelPrograms = upcomingPrograms(channelProgramsArray);
    renderChannelInfo(upcomingChannelPrograms);
    renderChannelTitle(channelName);
    formatTime(upcomingChannelPrograms);

    // showProgramInfo(channelName);
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

// function (nameOfChannel) {
//   ArrayWithRemovedDescription = channelProgramsArray.map((name, start) =>
//     renderChannelInfo()
//   );
// }

function renderChannelInfo(channelProgramsArray) {
  let ProgramInfoDiv = document.querySelector("#js-schedule");
  let showPreviousBtn = `<ul class="list-group list-group-flush">
          <li class="list-group-item show-previous">Visa tidigare program</li>`;

  ProgramInfoDiv.innerHTML = showPreviousBtn;
  showPreviousBtn = document.querySelector(".show-previous");
  showPreviousBtn.addEventListener("click", (event) => {
    console.log("visar alla program");
    showAllPrograms(allChannelPrograms);
  });
  ProgramInfoDiv.appendChild(createProgramList(channelProgramsArray));
}

function showAllPrograms(programs) {
  renderChannelInfo(programs);
}

let testArray = [
  {
    name: "VM-vintern: Magasin",
    start: "2021-02-10T22:30:00+01:00",
    description:
      "Höjdpunkter, nyheter och intervjuer från skidskytte-VM i Pokljuka, Slovenien och alpina VM i Cortina, Italien. Programledare: André Pops.",
  },
  {
    name: "Komma ut",
    start: "2021-02-10T23:00:00+01:00",
    description:
      "Sigrid. Sigrid ska ta med sin flickvän på släktmiddag för första gången. Eftersom inte alla i släkten vet att hon är homosexuell har hon bestämt sig för att först berätta för sin faster och farbror. Sigrid får också träffa två kända idrottskvinnor som är gifta med varandra och har barn. Del 5 av 7. UR.",
  },
  {
    name: "Rapport",
    start: "2021-02-10T22:25:00+01:00",
    description: "Nyheter från Sverige och världen.",
  },
  {
    name: "Sverige idag",
    start: "2021-02-11T04:45:00+01:00",
    description: "Nyheter från hela Sverige - direkt från Umeå.",
  },
];

let formattedChannelProgramsArray = [];
function formatTime(channelProgramsArray) {
  // let timeFormat = new Intl.DateTimeFormat("sv-SE", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  formattedChannelProgramsArray = channelProgramsArray.map((program) => {
    program.start = new Intl.DateTimeFormat("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });
  console.log(formattedChannelProgramsArray);
  return formattedChannelProgramsArray;
}

// channelProgramsArray.forEach(program) => {
//   let date = new Date(dateString);
//   console.log(timeFormat.format(date));
// }

upcomingPrograms(testArray);
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
  return upcomingProgramsInOrder(upcomingPrograms);
}

function upcomingProgramsInOrder(programs) {
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
    li.innerHTML = ` <strong>${program.start}</strong>
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
// console.log(
//   new Intl.DateTimeFormat("sw-SW", {
//     dateStyle: "full",
//     timeStyle: "long",
//     timeZone: "Australia/Sydney",
//   }).format(date)
// );

// const date = new Date("2021-02-10T22:30:00+01:00");
// console.log("2021-02-10T22:30:00+01:00".split("T")[1].split(":")[0]);
