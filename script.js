// ========================
// HTML要素を取得
// ========================
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");

const startBtn = document.getElementById("start-btn");
const micBtn = document.getElementById("mic-btn");

const playerHandText = document.getElementById("player-hand");
const enemyHandText = document.getElementById("enemy-hand");
const resultText = document.getElementById("result");
const listeningStatus = document.getElementById("listening-status");

// カウンター
const countWinText = document.getElementById("count-win");
const countLoseText = document.getElementById("count-lose");
const countDrawText = document.getElementById("count-draw");
const countTotalText = document.getElementById("count-total");

// 豆知識
const prefInfoBox = document.getElementById("pref-info");
const prefInfoTitle = document.getElementById("info-title");
const prefInfoText = document.getElementById("info-text");

// ターゲット県名
const targetPrefText = document.getElementById("target-pref");

// ========================
// 画面切り替え
// ========================
startBtn.addEventListener("click", () => {
    titleScreen.classList.remove("active");
    gameScreen.classList.add("active");
    pickKinkiTarget();
});

// ========================
// じゃんけん
// ========================
const hands = ["グー", "チョキ", "パー"];

function getEnemyHand() {
    return hands[Math.floor(Math.random() * 3)];
}

function judge(player, enemy) {
    if (player === enemy) return "draw";
    if (
        (player === "グー" && enemy === "チョキ") ||
        (player === "チョキ" && enemy === "パー") ||
        (player === "パー" && enemy === "グー")
    ) return "win";
    return "lose";
}

// ========================
// カウンター
// ========================
let countWin = 0;
let countLose = 0;
let countDraw = 0;
let countTotal = 0;

// ========================
// 近畿地方
// ========================
const kinkiPrefs = {
    shiga: "滋賀県",
    kyoto: "京都府",
    osaka: "大阪府",
    hyogo: "兵庫県",
    nara: "奈良県",
    wakayama: "和歌山県",
    mie: "三重県"
};

const kinkiFacts = {
    shiga: "滋賀県は日本最大の湖『琵琶湖』がある！（大津市）",
    kyoto: "京都は金閣寺・清水寺など世界的観光地が多い！（京都市）",
    osaka: "大阪はUSJが有名！たこ焼きの本場！（大阪市）",
    hyogo: "兵庫には世界最長の吊橋『明石海峡大橋』がある！（神戸市）",
    nara: "奈良は大仏と鹿で有名！歴史がいっぱい！（奈良市）",
    wakayama: "和歌山にはパンダがいた、、、アドベンチャーワールドがある！（和歌山市）",
    mie: "三重県には伊勢神宮があり、志摩スペイン村も人気だよ！"
};

const kinkiIds = Object.keys(kinkiPrefs);
let currentKinki = null;

function pickKinkiTarget() {
    currentKinki = kinkiIds[Math.floor(Math.random() * kinkiIds.length)];
    targetPrefText.textContent = kinkiPrefs[currentKinki];
}

function showPrefInfo(prefId) {
    prefInfoTitle.textContent = kinkiPrefs[prefId];
    prefInfoText.textContent = kinkiFacts[prefId];
    prefInfoBox.style.display = "block";
}

// ========================
// 音声認識
// ========================
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "ja-JP";

micBtn.addEventListener("click", () => {
    listeningStatus.style.display = "inline-block";
    recognition.start();
});

recognition.onresult = (event) => {
    listeningStatus.style.display = "none";

    const text = event.results[0][0].transcript;

    const playerHand = toHand(text);
    playerHandText.textContent = playerHand;

    const enemy = getEnemyHand();
    enemyHandText.textContent = enemy;

    const result = judge(playerHand, enemy);

    resultText.className = "result-badge";

    // 勝敗処理
    if (result === "win") {
        resultText.textContent = "勝ち！";
        resultText.classList.add("result-win");
        countWin++;
        document.getElementById(currentKinki).style.fill = "blue";
        showPrefInfo(currentKinki);
    }
    else if (result === "lose") {
        resultText.textContent = "負け…";
        resultText.classList.add("result-lose");
        countLose++;
        document.getElementById(currentKinki).style.fill = "red";
        showPrefInfo(currentKinki);
    }
    else {
        resultText.textContent = "あいこ";
        resultText.classList.add("result-draw");
        countDraw++;
        // ★ あいこのときは豆知識無し＆ターゲット変更なし
        countTotal++;
        countWinText.textContent = countWin;
        countLoseText.textContent = countLose;
        countDrawText.textContent = countDraw;
        countTotalText.textContent = countTotal;
        return;
    }

    // 総プレイ数
    countTotal++;

    // カウンター更新
    countWinText.textContent = countWin;
    countLoseText.textContent = countLose;
    countDrawText.textContent = countDraw;
    countTotalText.textContent = countTotal;

    // 次の県へ
    pickKinkiTarget();
};

// 音声から手に変換
function toHand(text) {
    if (text.includes("グー") || text.includes("ぐー")) return "グー";
    if (text.includes("チョキ") || text.includes("ちょき")) return "チョキ";
    if (text.includes("パー") || text.includes("ぱー")) return "パー";
    return "グー";
}
