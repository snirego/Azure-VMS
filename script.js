// Get references to the file input elements and the video player
const videoUploadInput = document.getElementById('video-upload');
const jsonUploadInput = document.getElementById('json-upload');
const player = document.getElementById('player');
const visualizations = document.getElementById('visualizations');
const transcriptPlaceholder = document.getElementById('transcript-placeholder');
const famousPeoplePlaceholder = document.getElementById('famousPeople-placeholder');
const labelsPlaceholder = document.getElementById('labels-placeholder');

var jsonFile = {};
var jsonData = {};
var listOfTranscriptWithTimestamps = [];
var listOfLabelsWithTimestamps = [];
var listOfLabels = [];

// ----------------------------------------------< BLOB JSON START >-----------------------------------------------
async function getBlob(accountName, containerName, blobName) {
    // Replace {accountName} and {containerName} with your Azure Storage account name and container name, respectively
    const storageUrl = `https://videoindexerstaccoun.blob.core.windows.net/insights-json/${blobName}`;

    // Set the SAS token to allow you to access the blob.
    // Replace {sasToken} with a valid SAS token for the blob.
    const sasToken = '?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2022-12-21T17:40:48Z&st=2022-12-21T09:40:48Z&spr=https&sig=p9%2Fg7qL2iaIpBSBOMqdJgN%2FWeWeqYqFA2ib8BoOYYNo%3D';

    // Send the GET request to the Azure Storage API to retrieve the blob
    const response = await fetch(storageUrl + sasToken);

    // If the request was successful, return the blob data
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(`Failed to retrieve blob: ${response.statusText}`);
    }
}


// ----------------------------------------------< BLOB JSON END >-----------------------------------------------


videoUploadInput.addEventListener('change', function (event) {
    // This function will be executed when a file is uploaded to the 'video-upload' input element
    const videoFile = event.target.files[0];

    // Load the video file into the player
    player.src = URL.createObjectURL(videoFile);

    // Automatically play the video when it is loaded
    player.onloadedmetadata = () => {
        player.play();
    };

    // Call function(videoName) to get the JSON file from the video file
    getBlob('videoindexerstaccoun', 'insights-json', videoFile.name + '_insights.json')
        .then(blob => {
            // The blob data is now stored in the "blob" variable
            console.log(blob);
        })
        .catch(error => {
            // An error occurred while trying to retrieve the blob
        });

});


// jsonUploadInput.addEventListener('change', function(event) {
//     // This function will be executed when a file is uploaded to the 'json-upload' input element
//     const jsonFile = event.target.files[0];

//     // Create a new FileReader
//     const reader = new FileReader();

//     // Add an event listener to the FileReader's 'load' event
//     reader.addEventListener('load', () => {
//     // The 'load' event is triggered when the file has been read successfully
//     // The file's contents can be accessed through the 'result' property of the FileReader object
//     jsonData = JSON.parse(reader.result);

//     console.log(jsonData);


//     // Transcript JSON data
//     var listOfTranscript = jsonData.videos[0].insights.transcript;

//     for (var i = 0; i < listOfTranscript.length; i++) 
//     {
//         // sentence text
//         var text = listOfTranscript[i].text;
//         var start = listOfTranscript[i].instances[0].start;
//         var end = listOfTranscript[i].instances[0].end;        

//         // Convert the timestamp string to a number of seconds
//         var startTimestampSeconds = parseInt(start.split(":")[0]) * 3600 +
//         parseInt(start.split(":")[1]) * 60 +
//         parseInt(start.split(":")[2].split(".")[0]) +
//         parseInt(start.split(":")[2].split(".")[1]) / 100;

//         var endTimestampSeconds = parseInt(end.split(":")[0]) * 3600 +
//         parseInt(end.split(":")[1]) * 60 +
//         parseInt(end.split(":")[2].split(".")[0]) +
//         parseInt(end.split(":")[2].split(".")[1]) / 100;

//         // console.log(text, startTimestampSeconds, endTimestampSeconds);

//         listOfTranscriptWithTimestamps.push([text, startTimestampSeconds, endTimestampSeconds]);
//     }
//     console.log(listOfTranscriptWithTimestamps)



//     // Labels JSON data
//     listOfLabels = jsonData.videos[0].insights.labels;

//     for (var i = 0; i < listOfLabels.length; i++)
//     {
//         var label = listOfLabels[i].name;
//         listOfLabelsWithTimestamps[i] = [];

//         for (var j = 0; j < listOfLabels[i].instances.length; j++)
//         {
//             var start = listOfLabels[i].instances[j].start;
//             var end = listOfLabels[i].instances[j].end;

//             // Convert the timestamp string to a number of seconds
//             var startTimestampSeconds = parseInt(start.split(":")[0]) * 3600 +
//             parseInt(start.split(":")[1]) * 60 +
//             parseInt(start.split(":")[2].split(".")[0]) +
//             parseInt(start.split(":")[2].split(".")[1]) / 100;

//             var endTimestampSeconds = parseInt(end.split(":")[0]) * 3600 +
//             parseInt(end.split(":")[1]) * 60 +
//             parseInt(end.split(":")[2].split(".")[0]) +
//             parseInt(end.split(":")[2].split(".")[1]) / 100;

//             console.log(label, startTimestampSeconds, endTimestampSeconds);
//             listOfLabelsWithTimestamps[i][j] = [startTimestampSeconds, endTimestampSeconds];
//         }
//     }
//     console.log(listOfLabelsWithTimestamps)
//   });

//   // Start reading the file
//   reader.readAsText(jsonFile);
//   });


// ----------------------------------------------< FUNCTIONS >-----------------------------------------------

// Add an event listener to famous people button to display the data from the JSON file in the browser
document.getElementById('famousPeople').addEventListener('click', () => {
    // Make all other placeholders invisible
    famousPeoplePlaceholder.style.display = 'block';
    transcriptPlaceholder.style.display = 'none';
    labelsPlaceholder.style.display = 'none';

    var listOfFamousPeople = jsonData.summarizedInsights.namedPeople;


    console.log(famousPeoplePlaceholder.childElementCount)

    if (famousPeoplePlaceholder.childElementCount > 0) {
        // Delete all child nodes
        while (famousPeoplePlaceholder.firstChild !== null) {
            famousPeoplePlaceholder.removeChild(famousPeoplePlaceholder.firstChild);
        }
    }

    for (var i = 0; i < listOfFamousPeople.length; i++) {
        var textDiv = document.createElement('div');
        var linkDiv = document.createElement('a');
        var linkText = document.createTextNode(linkDiv.href = listOfFamousPeople[i].referenceUrl);

        linkDiv.appendChild(linkText);

        famousPeoplePlaceholder.appendChild(textDiv);
        famousPeoplePlaceholder.appendChild(linkDiv);

        textDiv.innerText = "Celebrity Name: " + listOfFamousPeople[i].name;

        // open link in new tab
        linkDiv.target = "_blank";
    }
});

// Add an event listener to the transcript button to display the data from the JSON file in the browser
document.getElementById('transcript').addEventListener('click', () => {
    // Make all other placeholders invisible
    famousPeoplePlaceholder.style.display = 'none';
    transcriptPlaceholder.style.display = 'block';
    labelsPlaceholder.style.display = 'none';
});

// Get the current time of the video player
player.addEventListener('timeupdate', () => {
    var currentTime = player.currentTime;
    // console.log(currentTime);

    for (var i = 0; i < listOfTranscriptWithTimestamps.length; i++) {
        if (currentTime >= listOfTranscriptWithTimestamps[i][1] && currentTime <= listOfTranscriptWithTimestamps[i][2]) {
            // console.log(listOfTranscriptWithTimestamps[i][0]);
            transcriptPlaceholder.innerText = listOfTranscriptWithTimestamps[i][0];
        }
    }

    for (var i = 0; i < listOfLabelsWithTimestamps.length; i++) {
        for (var j = 0; j < listOfLabelsWithTimestamps[i].length; j++) {
            if (currentTime >= listOfLabelsWithTimestamps[i][j][0] && currentTime <= listOfLabelsWithTimestamps[i][j][1]) {
                for (var k = 0; k < labelsPlaceholder.childElementCount; k++) {
                    if (labelsPlaceholder.children[k].innerText === listOfLabels[i].name) {
                        labelsPlaceholder.children[k].style.backgroundColor = 'blue';
                        labelsPlaceholder.children[k].style.color = 'white';
                    }
                    else {
                        labelsPlaceholder.children[k].style.backgroundColor = 'white';
                        labelsPlaceholder.children[k].style.color = 'black';
                    }
                }
            }
        }
    }
});

// Add an event listener to the emotion button to display the data from the JSON file in the browser
document.getElementById('labels').addEventListener('click', () => {
    // Make all other placeholders invisible
    famousPeoplePlaceholder.style.display = 'none';
    transcriptPlaceholder.style.display = 'none';
    labelsPlaceholder.style.display = 'block';



    if (labelsPlaceholder.childElementCount > 0) {
        // Delete all child nodes
        while (labelsPlaceholder.firstChild !== null) {
            labelsPlaceholder.removeChild(labelsPlaceholder.firstChild);
        }
    }

    for (var i = 0; i < listOfLabels.length; i++) {
        var textDiv = document.createElement('div');

        labelsPlaceholder.appendChild(textDiv);

        textDiv.innerText = listOfLabels[i].name;
    }
});








