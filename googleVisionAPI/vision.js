const GOOGLE_API_KEY = "----";
const CV_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + GOOGLE_API_KEY;

let imagestring = ''; 


function processFile(event) {
    const content = event.target.result;
    imagestring = content.replace('data:image/jpeg;base64,', ''); 
    document.getElementById("gimage").src = content; 
}


function uploadFiles(files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = processFile;
    reader.readAsDataURL(file); 
}



function analyze() {
    const data = {
        requests: [{
            image: {
                content: imagestring 
            },
            features: [{
                type: "FACE_DETECTION", 
                maxResults: 100
            }]
        }]
    };

    
    $.ajax({
        type: "POST",
        url: CV_URL,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data), 
        contentType: "application/json; charset=utf-8"
    }).done(function(response) {
        let resultText = ''; 

        if (response.responses[0].faceAnnotations) {
            const faceAnnotations = response.responses[0].faceAnnotations;
            
            faceAnnotations.forEach((face, index) => {
                const joyLikelihood = face.joyLikelihood;
                const sorrowLikelihood = face.sorrowLikelihood;
                const blurredLikelihood = face.blurredLikelihood;

                let emotionStatus = `사진 속 ${index + 1}번째 사람은 : `;

                if (blurredLikelihood === "VERY_LIKELY" || blurredLikelihood === "LIKELY") {
                    emotionStatus += "얼굴이 너무 흐릿합니다.";
                } else if (joyLikelihood === "VERY_LIKELY" || joyLikelihood === "LIKELY") {
                    emotionStatus += "웃는 표정을 짓고 있습니다.";
                } else if (sorrowLikelihood === "VERY_LIKELY" || sorrowLikelihood === "LIKELY") {
                    emotionStatus += "우는 표정을 짓고 있습니다.";
                } else {
                    emotionStatus += "무표정 입니다.";
                }

                
                resultText += emotionStatus + '\n';
            });
        } else {
            resultText = "얼굴이 감지되지 않았습니다.";
        }
        
        
        document.getElementById("resultArea").value = resultText;

    }).fail(function(error) {
        console.log("이미지를 분석할 수 없습니다.");
        document.getElementById("resultArea").value = "Error: 이미지를 분석할 수 없습니다.";
    });
}