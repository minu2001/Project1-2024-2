// Google API 키와 Vision API URL
const GOOGLE_API_KEY = "----";
const CV_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + GOOGLE_API_KEY;

let imagestring = ''; // base64 이미지 문자열을 저장할 변수

// 파일 업로드 후 파일을 처리하는 함수
function processFile(event) {
    const content = event.target.result;
    imagestring = content.replace('data:image/jpeg;base64,', ''); // base64 접두어를 제거
    document.getElementById("gimage").src = content; // 업로드된 이미지를 표시
}

// 파일 업로드를 처리하는 함수
function uploadFiles(files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = processFile;
    reader.readAsDataURL(file); // 이미지 파일을 base64 형식으로 변환
}

function typeEffect(element, text, speed = 50) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.value += text.charAt(index);
            index++;
            setTimeout(type, speed); // `speed` 밀리초 후에 이 함수를 다시 호출
        }
    }

    element.value = ""; // 타이핑이 시작되기 전에 textarea를 비움
    type(); // 타이핑 시작
}

// Google Vision API를 사용하여 이미지를 분석하는 함수
function analyze() {
    const data = {
        requests: [{
            image: {
                content: imagestring // base64로 인코딩된 이미지 문자열
            },
            features: [{
                type: "FACE_DETECTION", // 얼굴 감지를 요청
                maxResults: 100
            }]
        }]
    };

    // Google Vision API에 요청을 보냄
    $.ajax({
        type: "POST",
        url: CV_URL,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data), // 데이터를 JSON 형식으로 전송
        contentType: "application/json; charset=utf-8"
    }).done(function(response) {
        let resultText = ''; // 결과 텍스트를 초기화

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

                // 각 얼굴의 감정 상태를 resultText에 추가
                resultText += emotionStatus + '\n';
            });
        } else {
            resultText = "얼굴이 감지되지 않았습니다.";
        }
        
        // 결과를 textarea에 표시
        document.getElementById("resultArea").value = resultText;

    }).fail(function(error) {
        console.log("이미지를 분석할 수 없습니다.");
        document.getElementById("resultArea").value = "Error: 이미지를 분석할 수 없습니다.";
    });
}
