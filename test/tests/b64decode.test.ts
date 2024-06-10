import { decodeUserJwt } from "../../src/utils/decodeUserJwt";

// text examples from https://github.com/noct/cutf/blob/master/bin/quickbrown.txt
describe("Test UTF-8 characters in different languages", () => {
  beforeAll(async () => {
    window.TextEncoder = require("util").TextEncoder;
    window.TextDecoder = require("util").TextDecoder;
  });
  test("Danish", () => {
    const originalValue = `{"id":"Quizdeltagerne spiste jordbær med fløde, mens cirkusklovnen Wolther spillede på xylofon."}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiUXVpemRlbHRhZ2VybmUgc3Bpc3RlIGpvcmRiw6ZyIG1lZCBmbMO4ZGUsIG1lbnMgY2lya3Vza2xvdm5lbiBXb2x0aGVyIHNwaWxsZWRlIHDDpSB4eWxvZm9uLiJ9fQ.HEq2Hh0bpWs-tzeXVKS_Q8hiohB3oecRsEaANXOirj0";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("German", () => {
    const originalValue = `{"id":"Falsches Üben von Xylophonmusik quält jeden größeren Zwerg Zwölf Boxkämpfer jagten Eva quer über den Sylter Deich Heizölrückstoßabdämpfung"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiRmFsc2NoZXMgw5xiZW4gdm9uIFh5bG9waG9ubXVzaWsgcXXDpGx0IGplZGVuIGdyw7bDn2VyZW4gWndlcmcgWnfDtmxmIEJveGvDpG1wZmVyIGphZ3RlbiBFdmEgcXVlciDDvGJlciBkZW4gU3lsdGVyIERlaWNoIEhlaXrDtmxyw7xja3N0b8OfYWJkw6RtcGZ1bmcifX0.3ePpLe2nruSGyssGnf3tUlx7pIHGPjYGtlUpCgBG5Vw";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("English", () => {
    const originalValue = `{"id":"The quick brown fox jumps over the lazy dog"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiVGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZyJ9fQ.KJLEFZc5fQRSuVqP8B4chrU6C7wh3mIqy1E5zDzdtXA";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Spanish", () => {
    const originalValue = `{"id":"El pingüino Wenceslao hizo kilómetros bajo exhaustiva lluvia y frío, añoraba a su querido cachorro."}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiRWwgcGluZ8O8aW5vIFdlbmNlc2xhbyBoaXpvIGtpbMOzbWV0cm9zIGJham8gZXhoYXVzdGl2YSBsbHV2aWEgeSBmcsOtbywgYcOxb3JhYmEgYSBzdSBxdWVyaWRvIGNhY2hvcnJvLiJ9fQ.OZHzsmc0nsCd0ckWxIryTk3TsBN9xKxP3HMhCiqGTE4";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("French", () => {
    const originalValue = `{"id":"Portez ce vieux whisky au juge blond qui fume sur son île intérieure, à côté de l'alcôve ovoïde, où les bûches se consument dans l'âtre, ce qui lui permet de penser à la cænogenèse de l'être dont il est question dans la cause ambiguë entendue à Moÿ, dans un capharnaüm qui, pense-t-il, diminue çà et là la qualité de son œuvre. l'île exiguë Où l'obèse jury mûr Fête l'haï volapük, Âne ex aéquo au whist, Ôtez ce vœu déçu. Le cœur déçu mais l'âme plutôt naïve, Louÿs rêva de crapaüter en canoë au delà des îles, près du mälström où brûlent les novæ."}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiUG9ydGV6IGNlIHZpZXV4IHdoaXNreSBhdSBqdWdlIGJsb25kIHF1aSBmdW1lIHN1ciBzb24gw65sZSBpbnTDqXJpZXVyZSwgw6AgY8O0dMOpIGRlIGwnYWxjw7R2ZSBvdm_Dr2RlLCBvw7kgbGVzIGLDu2NoZXMgc2UgY29uc3VtZW50IGRhbnMgbCfDonRyZSwgY2UgcXVpIGx1aSBwZXJtZXQgZGUgcGVuc2VyIMOgIGxhIGPDpm5vZ2Vuw6hzZSBkZSBsJ8OqdHJlIGRvbnQgaWwgZXN0IHF1ZXN0aW9uIGRhbnMgbGEgY2F1c2UgYW1iaWd1w6sgZW50ZW5kdWUgw6AgTW_DvywgZGFucyB1biBjYXBoYXJuYcO8bSBxdWksIHBlbnNlLXQtaWwsIGRpbWludWUgw6fDoCBldCBsw6AgbGEgcXVhbGl0w6kgZGUgc29uIMWTdXZyZS4gbCfDrmxlIGV4aWd1w6sgT8O5IGwnb2LDqHNlIGp1cnkgbcO7ciBGw6p0ZSBsJ2hhw68gdm9sYXDDvGssIMOCbmUgZXggYcOpcXVvIGF1IHdoaXN0LCDDlHRleiBjZSB2xZN1IGTDqcOndS4gTGUgY8WTdXIgZMOpw6d1IG1haXMgbCfDom1lIHBsdXTDtHQgbmHDr3ZlLCBMb3XDv3MgcsOqdmEgZGUgY3JhcGHDvHRlciBlbiBjYW5vw6sgYXUgZGVsw6AgZGVzIMOubGVzLCBwcsOocyBkdSBtw6Rsc3Ryw7ZtIG_DuSBicsO7bGVudCBsZXMgbm92w6YuIn19.bGShzcpNSVNypxoLwjVaKc4e6cPKhTne9pOsGOQPteM";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Irish Gaelic", () => {
    const originalValue = `{"id":"D'fhuascail Íosa, Úrmhac na hÓighe Beannaithe, pór Éava agus Ádhaimh"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiRCdmaHVhc2NhaWwgw41vc2EsIMOacm1oYWMgbmEgaMOTaWdoZSBCZWFubmFpdGhlLCBww7NyIMOJYXZhIGFndXMgw4FkaGFpbWgifX0.mKkickrVblv3onj5PgCLWojVtMypq_rNAE13cVKZxRQ";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Hungarian", () => {
    const originalValue = `{"id":"Árvíztűrő tükörfúrógép"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiw4FydsOtenTFsXLFkSB0w7xrw7ZyZsO6csOzZ8OpcCJ9fQ.cMlbr1IRnDs24I9IUJ9fKIikFeq23CtorGuFeyV90ZU";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Icelandic", () => {
    const originalValue = `{"id":"Kæmi ný öxi hér ykist þjófum nú bæði víl og ádrepa Sævör grét áðan því úlpan var ónýt"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiS8OmbWkgbsO9IMO2eGkgaMOpciB5a2lzdCDDvmrDs2Z1bSBuw7ogYsOmw7BpIHbDrWwgb2cgw6FkcmVwYSBTw6Z2w7ZyIGdyw6l0IMOhw7BhbiDDvnbDrSDDumxwYW4gdmFyIMOzbsO9dCJ9fQ.1jdCAdYM1_NSAyGzPYdvtOXj_2cva5KO3SzWVCqA64s";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Japanese (Hiragana)", () => {
    const originalValue = `{"id":"いろはにほへとちりぬるを わかよたれそつねならむ うゐのおくやまけふこえて あさきゆめみしゑひもせす"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoi44GE44KN44Gv44Gr44G744G444Go44Gh44KK44Gs44KL44KSIOOCj-OBi-OCiOOBn-OCjOOBneOBpOOBreOBquOCieOCgCDjgYbjgpDjga7jgYrjgY_jgoTjgb7jgZHjgbXjgZPjgYjjgaYg44GC44GV44GN44KG44KB44G_44GX44KR44Gy44KC44Gb44GZIn19.oUyFJiqNvc7XtrlZ6l0spk0AfQ9lrDM5JEz5PdmXDjs";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Japanese (Katakana)", () => {
    const originalValue = `{"id":"イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム ウヰノオクヤマ ケフコエテ アサキユメミシ ヱヒモセスン"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoi44Kk44Ot44OP44OL44Ob44OY44OIIOODgeODquODjOODq-ODsiDjg6_jgqvjg6jjgr_jg6zjgr0g44OE44ON44OK44Op44OgIOOCpuODsOODjuOCquOCr-ODpOODniDjgrHjg5XjgrPjgqjjg4Yg44Ki44K144Kt44Om44Oh44Of44K3IOODseODkuODouOCu-OCueODsyJ9fQ.dbLgP3wlXPP0Qgu3ptP9qPzaM1scC3Nsi-fwzH6q5oM";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Hebrew", () => {
    const originalValue = `{"id":"דג סקרן שט בים מאוכזב ולפתע מצא לו חברה איך הקליטה"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoi15PXkiDXoden16jXnyDXqdeYINeR15nXnSDXnteQ15XXm9eW15Eg15XXnNek16rXoiDXntem15Ag15zXlSDXl9eR16jXlCDXkNeZ15og15TXp9ec15nXmNeUIn19.wg_lVkcB-1rPDtMeQvSbzBDiIaw8H5g_3FQKmO1HDSI";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Polish", () => {
    const originalValue = `{"id":"Pchnąć w tę łódź jeża lub ośm skrzyń fig"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiUGNobsSFxIcgdyB0xJkgxYLDs2TFuiBqZcW8YSBsdWIgb8WbbSBza3J6ecWEIGZpZyJ9fQ.KnplzSmUNm41ZQRaW9tWCWjDEgRoc8tJM-WVlHgf2lo";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Russian", () => {
    const originalValue = `{"id":"В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoi0JIg0YfQsNGJ0LDRhSDRjtCz0LAg0LbQuNC7INCx0Ysg0YbQuNGC0YDRg9GBPyDQlNCwLCDQvdC-INGE0LDQu9GM0YjQuNCy0YvQuSDRjdC60LfQtdC80L_Qu9GP0YAhIn19.448H33Cln9kYwpAlSNjYM1JIGBNpi0bXXNTJsJX8N1g";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
  test("Thai", () => {
    const originalValue = `{"id":"เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน จงฝ่าฟันพัฒนาวิชาการ อย่าล้างผลาญฤๅเข่นฆ่าบีฑาใคร ไม่ถือโทษโกรธแช่งซัดฮึดฮัดด่า หัดอภัยเหมือนกีฬาอัชฌาสัย ปฏิบัติประพฤติกฎกำหนดใจ พูดจาให้จ๊ะๆ จ๋าๆ น่าฟังเอย ฯ"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoi4LmA4Lib4LmH4LiZ4Lih4LiZ4Li44Lip4Lii4LmM4Liq4Li44LiU4Lib4Lij4Liw4LmA4Liq4Lij4Li04LiQ4LmA4Lil4Li04Lio4LiE4Li44LiT4LiE4LmI4LiyIOC4geC4p-C5iOC4suC4muC4o-C4o-C4lOC4suC4neC4ueC4h-C4quC4seC4leC4p-C5jOC5gOC4lOC4o-C4seC4iOC4ieC4suC4mSDguIjguIfguJ3guYjguLLguJ_guLHguJnguJ7guLHguJLguJnguLLguKfguLTguIrguLLguIHguLLguKMg4Lit4Lii4LmI4Liy4Lil4LmJ4Liy4LiH4Lic4Lil4Liy4LiN4Lik4LmF4LmA4LiC4LmI4LiZ4LiG4LmI4Liy4Lia4Li14LiR4Liy4LmD4LiE4LijIOC5hOC4oeC5iOC4luC4t-C4reC5guC4l-C4qeC5guC4geC4o-C4mOC5geC4iuC5iOC4h-C4i-C4seC4lOC4ruC4tuC4lOC4ruC4seC4lOC4lOC5iOC4siDguKvguLHguJTguK3guKDguLHguKLguYDguKvguKHguLfguK3guJnguIHguLXguKzguLLguK3guLHguIrguIzguLLguKrguLHguKIg4Lib4LiP4Li04Lia4Lix4LiV4Li04Lib4Lij4Liw4Lie4Lik4LiV4Li04LiB4LiO4LiB4Liz4Lir4LiZ4LiU4LmD4LiIIOC4nuC4ueC4lOC4iOC4suC5g-C4q-C5ieC4iOC5iuC4sOC5hiDguIjguYvguLLguYYg4LiZ4LmI4Liy4Lif4Lix4LiH4LmA4Lit4LiiIOC4ryJ9fQ.R8b5qaGnfI8xG9Rg0klx2A-QYeW78UNGCGae_1jq1r0";
    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });

  test("Chinese (Simplified)", () => {
    const originalValue = `{"id":"天地玄黃，宇宙洪荒 蓋此身髮，四大五常 都邑華夏，東西二京 治本於農，務茲稼穡 耽讀玩市，寓目囊箱 布射僚丸，嵇琴阮嘯 日月盈昃，辰宿列張 恭惟鞠養，豈敢毀傷 背邙面洛，浮渭據涇 俶載南畝，我藝黍稷 易輶攸畏，屬耳垣牆 恬筆倫紙，鈞巧任釣"}`;

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoi5aSp5Zyw546E6buD77yM5a6H5a6Z5rSq6I2SIOiTi-atpOi6q-mrru-8jOWbm-Wkp-S6lOW4uCDpg73pgpHoj6_lpI_vvIzmnbHopb_kuozkuqwg5rK75pys5pa86L6y77yM5YuZ6Iyy56i856mhIOiAveiugOeOqeW4gu-8jOWvk-ebruWbiueusSDluIPlsITlg5rkuLjvvIzltYfnkLTpmK7lmK8g5pel5pyI55uI5piD77yM6L6w5a6_5YiX5by1IOaBreaDn-meoOmkiu-8jOixiOaVouavgOWCtyDog4zpgpnpnaLmtJvvvIzmta7muK3mk5rmtocg5L-26LyJ5Y2X55Wd77yM5oiR6Jed6buN56i3IOaYk-i8tuaUuOeVj--8jOWxrOiAs-Weo-eJhiDmgaznrYblgKvntJnvvIzpiJ7lt6fku7vph6MifX0.iC4ulLSfXmuVmbbnwYpxiRO-jBN5sj-lsUpBodwrdg8";

    const decoded = decodeUserJwt(token);

    expect(JSON.stringify(decoded)).toBe(originalValue);
  });
});
