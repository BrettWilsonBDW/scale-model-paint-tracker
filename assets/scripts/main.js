let jsonData = {}; 

async function fetchData() {
  try {
    const response = await fetch('assets\\jsons\\humbrolPiants.json');
    const newData = await response.json();
    
    // Merge new data into existing jsonData without losing current values
    for (const key in newData) {
      if (!jsonData[key]) {
        jsonData[key] = newData[key];
      }
    }
    
    loadStoredData(); // Load previously stored data
    displayAllPaints();
    displayUserPaints();
    displayModelPaints();
    processData();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Load stored data from Local Storage
function loadStoredData() {
  const storedData = localStorage.getItem('paintData');
  if (storedData) {
    jsonData = JSON.parse(storedData);
  }
}

// Save data to Local Storage
function saveDataToStorage() {
  localStorage.setItem('paintData', JSON.stringify(jsonData));
}


function addPaintsToHave() {
  const inputAddPaint = document.getElementById("inputAddPaint");
  const submitButton = document.getElementById("submitButton");


  submitButton.addEventListener("click", function() {
    const inputValue = inputAddPaint.value;

    for (const key in jsonData) {
      const cleanedName = jsonData[key].name.replace(/\s/g, "");
      const cleanedInputValue = inputValue.replace(/\s/g, "");
      if (cleanedName.toLowerCase() === cleanedInputValue.toLowerCase()) {
        jsonData[key].have = true;
        break;
      }
    }

    try {
      jsonData[inputValue]["have"] = true;
      throw new Error("Something went wrong BOB");
    } catch (error) {
      // Swallow the error and do nothing
    }

    saveDataToStorage(); // Save updated data
    displayUserPaints();
    displayAllPaints();
    displayModelPaints()
    displayNeededPaintsOnly()
  });
}


function removePiantsFromHave() {
  const inputAddPaint = document.getElementById("inputRemovePaint");
  const submitButton = document.getElementById("submitButtonFalse");

  submitButton.addEventListener("click", function() {
    const inputValue = inputAddPaint.value;

    for (const key in jsonData) {
      const cleanedName = jsonData[key].name.replace(/\s/g, "");
      const cleanedInputValue = inputValue.replace(/\s/g, "");
      if (cleanedName.toLowerCase() === cleanedInputValue.toLowerCase()) {
        jsonData[key].have = true;
        break;
      }
    }

    try {
      jsonData[inputValue]["have"] = false;
      throw new Error("Something went wrong");
    } catch (error) {
      // Swallow the error and do nothing
    }

    saveDataToStorage(); // Save updated data
    displayUserPaints();
    displayAllPaints();
    displayModelPaints()
    displayNeededPaintsOnly()
  });
}

function displayAllPaints() {
  const outputDiv = document.getElementById("itemOutputAll");
  outputDiv.innerHTML = "";

for (const key in jsonData) {
  const value = jsonData[key];
  const itemElement = document.createElement("p");
  itemElement.style.display = "flex";
  itemElement.style.justifyContent = "flex-start";
  itemElement.style.alignItems = "center";

  if (value["have"] === true) {
    itemElement.innerHTML = `<span style="border: 0.5px solid black; background-color: ${value["hex"]}; width: 25px; height: 25px; display: inline-block;">&nbsp;</span>&nbsp;<span>${value["id"]}</span>&nbsp;<span>${value["name"]}</span>&nbsp;<span style="color: green;">HAVE</span>`;
  } else {
    itemElement.innerHTML = `<span style="border: 0.5px solid black; background-color: ${value["hex"]}; width: 25px; height: 25px; display: inline-block;">&nbsp;</span>&nbsp;<span>${value["id"]}</span>&nbsp;<span>${value["name"]}</span>&nbsp;<span style="color: red;">&nbsp;NEED</span>`;
  }
  outputDiv.appendChild(itemElement);
  }
}

function displayUserPaints() {
  const outputDiv = document.getElementById("itemOutputUserPaints");
  outputDiv.innerHTML = "";

  for (const key in jsonData) {
    const value = jsonData[key];
    if (jsonData[key]["have"] === true) {
      const itemElement = document.createElement("p");
      itemElement.innerHTML = `${value["id"]} : ${value["name"]}<br>`;
      outputDiv.appendChild(itemElement);
    }
  }
}

function displayModelPaints() {
  const outputDiv = document.getElementById("itemOutputModelsNeed");
  outputDiv.innerHTML = "";

  const removeButton = document.getElementById("removeButtonModel");
  removeButton.addEventListener("click", function() {
    outputDiv.innerHTML = "";
    for (const key in jsonData) {
      const value = jsonData[key];
      value["need"] = false
      value["get"] = false
    }
    saveDataToStorage(); // Save updated data
    displayNeededPaintsOnly()
  });

    for (const key in jsonData) {
    const value = jsonData[key];
    if (jsonData[key]["need"] === true) {
      const itemElement = document.createElement("p");
      // itemElement.innerHTML = `<br>${value["id"]} : ${value["name"]}<br>`;
      if (value["have"] === value["need"]) {
        itemElement.innerHTML = `${value["id"]} : ${value["name"]} : <span style="color: green;">HAVE</span>`;
        jsonData[key]["get"] = false
      }
      else{
        itemElement.innerHTML = `${value["id"]} : ${value["name"]} : <span style="color: red;">NEED</span>`;
        jsonData[key]["get"] = true
      }
      outputDiv.appendChild(itemElement);
    }
  }
}

function comparPaintData() {
  const inputAddPaint = document.getElementById("inputFieldModel");
  const submitButton = document.getElementById("submitButtonModel");  const removeButton = document.getElementById("submitButtonModel");

  submitButton.addEventListener("click", function() {
    const inputValue = inputAddPaint.value;

    for (const key in jsonData) {
      const cleanedName = jsonData[key].name.replace(/\s/g, "");
      const cleanedInputValue = inputValue.replace(/\s/g, "");
      if (cleanedName.toLowerCase() === cleanedInputValue.toLowerCase()) {
        jsonData[key].need = true;
        break;
      }
    }

    try {
      jsonData[inputValue]["need"] = true;
      throw new Error("Something went wrong");
    } catch (error) {
      // Swallow the error and do nothing
    }

    saveDataToStorage(); // Save updated data
    displayModelPaints();
    displayNeededPaintsOnly()
  });
}

function displayNeededPaintsOnly() {
  const outputDiv = document.getElementById("itemOutputModelsNeedOnly");
  outputDiv.innerHTML = "";

  for (const key in jsonData) {
    const value = jsonData[key];
    if (jsonData[key]["get"] === true) {
      const itemElement = document.createElement("p");
      itemElement.innerHTML = `${value["id"]} : ${value["name"]} : <span style="color: red;">NEED</span>`;
      outputDiv.appendChild(itemElement);
    }
  }
}


function processData() {
  saveDataToStorage(); // Save updated data
  addPaintsToHave();
  removePiantsFromHave();
  comparPaintData();
}


// Add the download code
document.getElementById("downloadButton").addEventListener("click", function() {
  const jsonDataString = JSON.stringify(jsonData);
  const blob = new Blob([jsonDataString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = "paintData.json";
  a.click();
  
  URL.revokeObjectURL(url);
});

// Add the upload code
document.getElementById("uploadButton").addEventListener("click", function() {
  const uploadInput = document.getElementById("uploadInput");
  const file = uploadInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      try {
        const uploadedData = JSON.parse(event.target.result);
        if (uploadedData && typeof uploadedData === "object") {
          jsonData = uploadedData;
          saveDataToStorage();
          displayAllPaints();
          displayUserPaints();
          displayModelPaints();
          displayNeededPaintsOnly();
        } else {
          console.error("Invalid JSON data");
        }
      } catch (error) {
        console.error("Error reading JSON file:", error);
      }
    };

    reader.readAsText(file);
  }
});

// Function to clear local storage and reset jsonData
function clearLocalStorageAndData() {
  localStorage.removeItem('paintData'); // Remove the stored data
  jsonData = {}; // Reset jsonData
  displayAllPaints();
  displayUserPaints();
  displayModelPaints();
  displayNeededPaintsOnly();
  location.reload();
}

// Call the function when needed, for example, as part of a button click event
document.getElementById("removeAllKillAll").addEventListener("click", clearLocalStorageAndData);
document.getElementById("removeAllKillAll").addEventListener("touchstart", clearLocalStorageAndData);

fetchData();


document.getElementById("printButton").addEventListener("click", function() {
  window.print();
});
