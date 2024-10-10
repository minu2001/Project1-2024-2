
GOOGLE_API_KEY = "AIzaSyDQErD-eoAbeaTWV62yiBVqbHiU9GOV8P0"
CV_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + GOOGLE_API_KEY;
function processFile(event){
    content = event.target.result 
    imagestring = content.replace('data:image/jpeg;base64,', '')
    document.getElementById("gimage").src = content
}

function uploadFiles(files){
    file = files[0]
    reader = new FileReader()
    reader.onloadend = processFile
    reader.readAsDataURL(file)
}

function analyze(){
    data ={
        requests: [{
            image:{
                content: imagestring
            },
            features:[{
                type:"FACE_DETECTION",
                maxResults: 100
            }]
        }]
    }

    $.ajax({
        type:"POST",
        url:'https://vision.googleapis.com/v1/images:annotate?key=' + GOOGLE_API_KEY,
        headers:{
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8"
    }).done( function(response){
        console.log(response)

    }).fail(function(error){
        console.log(error)

    })
}