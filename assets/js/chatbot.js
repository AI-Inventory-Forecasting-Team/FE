let inventoryData = []; // 재고 데이터를 저장하는 배열

function loadExcel() {
    const fileUploader = document.getElementById('fileUploader');
    const file = fileUploader.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        
        // 첫 번째 시트의 데이터를 JSON 형식으로 변환
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        inventoryData = XLSX.utils.sheet_to_json(worksheet);
        console.log(inventoryData); // 콘솔에서 데이터 확인
    };
    
    reader.readAsArrayBuffer(file);
}

function askQuestion() {
    const userInput = document.querySelector('#user-input input').value.trim().toLowerCase(); // 대소문자 구분 없이 처리
    let answer = ""; // 답변 초기화

    if (userInput === "남은재고") {
        // "남은재고" 입력 시 모든 재고 항목 나열
        if (inventoryData.length === 0) {
            answer = "로드된 재고 정보가 없습니다.";
        } else {
            // 모든 재고 항목 나열
            inventoryData.forEach(item => {
                answer += `${item.상품명}, ${item.재고}\n`;
            });
            answer = answer.trim(); // 마지막 줄바꿈 제거
        }
    } else {
        // 다른 질문에 대한 처리
        answer = "재고 정보를 찾을 수 없습니다.";
        inventoryData.forEach(item => {
            if (item.상품명 && item.상품명.includes(userInput)) {
                answer = `${item.상품명}, ${item.재고}`;
            }
        });
    }

    // 사용자의 질문을 화면에 표시
    addMessage(userInput, 'user');

    // 챗봇의 답변을 화면에 표시
    addMessage(answer, 'bot');

    // 입력 필드 초기화
    document.querySelector('#user-input input').value = '';
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messageDiv.classList.add('message', sender);

    // 채팅창의 맨 위에 메시지 추가
    if (chatMessages.firstChild) {
        chatMessages.insertBefore(messageDiv, chatMessages.firstChild);
    } else {
        chatMessages.appendChild(messageDiv); // 만약 첫 메시지인 경우 그냥 추가
    }

    // 채팅창을 맨 위로 스크롤하여 최신 메시지 표시
    chatMessages.scrollTop = 0;
}


document.querySelector('#user-input button').addEventListener('click', askQuestion);
// 엔터 키 입력 시에도 질문을 제출할 수 있게 추가
document.querySelector('#user-input input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        askQuestion();
    }
});



