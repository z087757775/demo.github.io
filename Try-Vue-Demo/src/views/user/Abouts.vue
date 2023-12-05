<template>
  <div>
    <div class="head">
      <div class="about-us">
        <p>關於我們</p>
      </div>
      <!-- 左圖片 右文字 -->
      <div class="image-text-container">
        <div class="image">
          <img class="img-left" src="/src/photo/about/abouts1.jpeg" alt="Image Description" />
        </div>
        <div class="text">
          <p class="text-head">起源</p>
          <div class="text-label">
            <p>
              我們是來自高雄某大學生，在高中畢業後我們一些要好的朋友，一起考上同一間大學，大家一直很想要到中廚房工作，但當時大學學校合作的飯店只有烘焙房在缺人手。
            </p>
          </div>
        </div>
      </div>
      <!-- 左文字 右圖片 -->
      <div class="text-image-container">
        <div class="image">
          <img class="img-right" src="/src/photo/about/abouts2.jpeg" alt="Image Description" />
        </div>
        <div class="text-left">
          <p class="text-head">緣分</p>
          <div class="text-label">
            <p>
              我們沒能到自己想要的環境，到了一個我們沒有想過的地方，但是我們很喜歡這裡，我們一起學習，一起進步，或許這就是緣分，讓我們一起學習烘焙這一塊，有天我們一同放假，到了台南我們看到了一間很有特色的店，我們就進去了，我們看到了很多很特別的烘焙。
            </p>
            <p style="white-space: nowrap; margin-top: 10px">
              我們就想說，我們也要做出這樣的烘焙，我們就開始了我們的烘焙之旅。
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="footer">
      <p class="footer-p">機會</p>
    </div>
    <div class="content-footer">
      <p>
        在一個偶然的機會，我們這些好朋友坐在一家咖啡廳，討論著我們一起去過的烘焙店，突然有一位朋友說：「我們一起創業吧。」
        我們每個人內心都充滿了不安，但也混雜著興奮的情感，創業對每個人來說都是一個巨大的挑戰，但我們充滿了激情和決心。
        坐在那家咖啡廳的桌前，我們開始討論各自的技能和熱情。有的人擅長麵包的烘焙，有的人對蛋糕設計有獨到見解，我們意識到，我們擁有創造出獨特、美味的烘焙產品所需的一切。
        在接下來的幾個月裡，我們進行了深入的市場調研，尋找最適合我們初創企業的地點，並精心制定了經營計劃。
        我們努力學習烘焙技術，提高自己的技能，並花時間嘗試各種食譜和原材料組合。我們還建立了自己的品牌，設計了吸引人的標誌和包裝，以吸引客戶的目光。
      </p>
    </div>

    <!-- endding -->

    <div class="image-text-container">
      <div class="image">
        <img class="img-endding" src="/src/photo/about/abouts3.jpeg" alt="Image Description" />
      </div>
      <div class="text">
        <p class="text-head">尾聲</p>
        <div class="text-label">
          <p>
            起初，我們面臨了不少困難，包括籌資、市場競爭和經營管理等方面的挑戰。但我們的團隊緊密合作，克服了這些困難。我們利用社交媒體和口碑傳播，逐漸吸引了越來越多的顧客。我們不斷改進和擴展我們的產品線，以滿足客戶需求，不斷提高質量，並注重客戶滿意度，成為了社區中備受歡迎的去處。
          </p>

          <p class="endding-content">
            機會總是潛伏在生活的各個角落，只要你充滿勇氣和決心，就能夠抓住並創造屬於自己的夢想。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.head {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
}

.about-us {
  position: relative;
  display: inline-block;
  padding: 0 60px;
  margin-bottom: 40px;
  font-size: 36px;
}

.about-us::before,
.about-us::after {
  content: '';
  position: absolute;
  width: calc(36% - 50px);
  height: 3px;
  background: #ccc;
  top: 50%;
  transform: translateY(-70%);
}

.about-us::before {
  left: 0;
}

.about-us::after {
  right: 0;
}
.image-text-container {
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.image {
  flex: 1;
  padding: 10px;
}

.img-left {
  max-width: 100%;
  height: auto;
  margin-left: 40px;
}

.text {
  flex: 2;
  padding: 20px 0;
  position: relative;
  font-size: 24px;
  margin: 40px;
}

.text-head {
  text-align: center;
  font-size: 24px;
  padding-right: 25%;
}
.text::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  transform: translateX(-30%);
  width: 40%;
  height: 2px;
  text-align: center;
  background: #ccc;
  margin: 10px 0;
}
.text-label {
  position: absolute;
  width: 40%;
  top: 100%;
  left: 30%;
  transform: translateX(-30%);
  font-size: 20px;
  line-height: 1.5;
  word-wrap: break-word;
}

.text-image-container {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: row-reverse;
  margin-right: 23%;
}
/* 右文字 左圖片 */
.img-right {
  max-width: 100%;
  height: auto;
  margin: 50px 80px 0 0;
  padding-top: 40px;
}

.text-left {
  flex: 2;
  padding: 20px 0;
  position: relative;
  font-size: 24px;
  margin: 80px;
}

.text-left::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  transform: translateX(-30%);
  width: 40%;
  height: 2px;
  text-align: center;
  background: #ccc;
  margin: 10px 0;
}

/* footer */
.footer {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 8%;
}

.footer-p {
  width: 100%;
  height: 100%;
  margin: 40px 0;
  font-size: 36px;
  text-align: center;
  border-bottom: 2px solid #ccc;
  line-height: 2;
}

.content-footer {
  width: 53%;
  margin: -20px auto 30px auto;
  line-height: 2;
  font-size: 20px;
}
/* endding */
.endding-content {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  margin: 30px 50px;
  margin-left: -20px;
  white-space: nowrap;
}

.img-endding {
  max-width: 100%;
  height: auto;
  margin-left: 40px;
  padding-top: 40px;
}
</style>
