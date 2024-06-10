import { _pushCookie, b64decode, b64encode } from "../../src/utils/cookieUtils";
import { decodeUserJwt } from "../../src/utils/decodeUserJwt";

function checkLanguage(originalValue) {
  const encoded = b64encode(originalValue);

  const decoded = b64decode(encoded);

  expect(JSON.parse(decoded)).toEqual(JSON.parse(originalValue));
}

// text examples from https://github.com/noct/cutf/blob/master/bin/quickbrown.txt
describe("Test encoding UTF-8 characters in different languages", () => {
  beforeAll(async () => {
    window.TextEncoder = require("util").TextEncoder;
    window.TextDecoder = require("util").TextDecoder;
  });
  test("Danish", () => {
    const originalValue = `{"id":"Quizdeltagerne spiste jordbær med fløde, mens cirkusklovnen Wolther spillede på xylofon."}`;

    checkLanguage(originalValue);
  });
  test("German", () => {
    const originalValue = `{"id":"Falsches Üben von Xylophonmusik quält jeden größeren Zwerg Zwölf Boxkämpfer jagten Eva quer über den Sylter Deich Heizölrückstoßabdämpfung"}`;

    checkLanguage(originalValue);
  });
  test("English", () => {
    const originalValue = `{"id":"The quick brown fox jumps over the lazy dog"}`;

    checkLanguage(originalValue);
  });
  test("Spanish", () => {
    const originalValue = `{"id":"El pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío, añoraba a su querido cachorro."}`;
  });
  test("French", () => {
    const originalValue = `{"id":"Portez ce vieux whisky au juge blond qui fume sur son île intérieure, à côté de l'alcôve ovoïde, où les bûches se consument dans l'âtre, ce qui lui permet de penser à la cænogenèse de l'être dont il est question dans la cause ambiguë entendue à Moÿ, dans un capharnaüm qui, pense-t-il, diminue çà et là la qualité de son œuvre. l'île exiguë Où l'obèse jury mûr Fête l'haï volapük, Âne ex aéquo au whist, Ôtez ce vœu déçu. Le cœur déçu mais l'âme plutôt naïve, Louÿs rêva de crapaüter en canoë au delà des îles, près du mälström où brûlent les novæ."}`;

    checkLanguage(originalValue);
  });
  test("Irish Gaelic", () => {
    const originalValue = `{"id":"D'fhuascail Íosa, Úrmhac na hÓighe Beannaithe, pór Éava agus Ádhaimh"}`;

    checkLanguage(originalValue);
  });
  test("Hungarian", () => {
    const originalValue = `{"id":"Árvíztűrő tükörfúrógép"}`;

    checkLanguage(originalValue);
  });
  test("Icelandic", () => {
    const originalValue = `{"id":"Kæmi ný öxi hér ykist þjófum nú bæði víl og ádrepa Sævör grét áðan því úlpan var ónýt"}`;

    checkLanguage(originalValue);
  });
  test("Japanese (Hiragana)", () => {
    const originalValue = `{"id":"いろはにほへとちりぬるを わかよたれそつねならむ うゐのおくやまけふこえて あさきゆめみしゑひもせす"}`;

    checkLanguage(originalValue);
  });
  test("Japanese (Katakana)", () => {
    const originalValue = `{"id":"イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム ウヰノオクヤマ ケフコエテ アサキユメミシ ヱヒモセスン"}`;
    checkLanguage(originalValue);
  });
  test("Hebrew", () => {
    const originalValue = `{"id":"דג סקרן שט בים מאוכזב ולפתע מצא לו חברה איך הקליטה"}`;

    checkLanguage(originalValue);
  });
  test("Polish", () => {
    const originalValue = `{"id":"Pchnąć w tę łódź jeża lub ośm skrzyń fig"}`;

    checkLanguage(originalValue);
  });
  test("Russian", () => {
    const originalValue = `{"id":"В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!"}`;

    checkLanguage(originalValue);
  });
  test("Thai", () => {
    const originalValue = `{"id":"เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน จงฝ่าฟันพัฒนาวิชาการ อย่าล้างผลาญฤๅเข่นฆ่าบีฑาใคร ไม่ถือโทษโกรธแช่งซัดฮึดฮัดด่า หัดอภัยเหมือนกีฬาอัชฌาสัย ปฏิบัติประพฤติกฎกำหนดใจ พูดจาให้จ๊ะๆ จ๋าๆ น่าฟังเอย ฯ"}`;

    checkLanguage(originalValue);
  });

  test("Chinese (Simplified)", () => {
    const originalValue = `{"id":"天地玄黃，宇宙洪荒 蓋此身髮，四大五常 都邑華夏，東西二京 治本於農，務茲稼穡 耽讀玩市，寓目囊箱 布射僚丸，嵇琴阮嘯 日月盈昃，辰宿列張 恭惟鞠養，豈敢毀傷 背邙面洛，浮渭據涇 俶載南畝，我藝黍稷 易輶攸畏，屬耳垣牆 恬筆倫紙，鈞巧任釣"}`;

    checkLanguage(originalValue);
  });
});
