import type { ImageSource } from 'expo-image';

export const recipeCategories = [
  { id: 'breakfast', label: 'Kahvaltı' },
  { id: 'main', label: 'Ana öğün' },
  { id: 'snack', label: 'Atıştırmalık' },
  { id: 'drink', label: 'İçecek' },
] as const;

export type RecipeCategory = (typeof recipeCategories)[number]['id'];

type Recipe = {
  category: RecipeCategory;
  id: string;
  name: string;
  photo: ImageSource | number;
  calories: number;
  proteinGrams: number;
  time: string;
  ingredients: string;
  steps: string[];
};

export const recipes: Recipe[] = [
  {
    id: 'muzlu-yulaf', name: 'Muzlu yulaf kasesi', photo: require('@/assets/images/recipes/1.jpg'),
    category: 'breakfast',
    calories: 400, proteinGrams: 16, time: '5 dk',
    ingredients: '40 g yulaf, 150 g sade yoğurt, 1 küçük muz, 1 yemek kaşığı fıstık ezmesi',
    steps: ['Yulafı ve yoğurdu karıştır.', 'Muzu dilimle ve fıstık ezmesiyle üzerine ekle.'],
  },
  {
    id: 'nohutlu-bulgur', name: 'Nohutlu bulgur salatası', photo: require('@/assets/images/recipes/2.jpg'),
    category: 'main',
    calories: 435, proteinGrams: 15, time: '15 dk',
    ingredients: '120 g haşlanmış nohut, 100 g pişmiş bulgur, domates, salatalık, 1 yemek kaşığı zeytinyağı, limon',
    steps: ['Domatesi ve salatalığı doğra.', 'Nohut ve bulgurla karıştır. Yağ ve limonla tatlandır.'],
  },
  {
    id: 'avokado-yumurta', name: 'Avokadolu yumurta tostu', photo: require('@/assets/images/recipes/3.jpg'),
    category: 'breakfast',
    calories: 370, proteinGrams: 16, time: '12 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 1 yumurta, yarım avokado, limon',
    steps: ['Ekmeği kızart ve yumurtayı haşla.', 'Avokadoyu limonla ez, ekmeğe sür ve yumurtayı ekle.'],
  },
  {
    id: 'cilekli-parfe', name: 'Çilekli yoğurt parfe', photo: require('@/assets/images/recipes/4.jpg'),
    category: 'snack',
    calories: 260, proteinGrams: 10, time: '5 dk',
    ingredients: '170 g sade yoğurt, 100 g çilek, 30 g yulaflı granola',
    steps: ['Çilekleri yıka ve dilimle.', 'Yoğurt, çilek ve granolayı bir bardakta katmanla.'],
  },
  {
    id: 'tavuklu-kinoa', name: 'Tavuklu kinoa kasesi', photo: require('@/assets/images/recipes/5.jpg'),
    category: 'main',
    calories: 460, proteinGrams: 40, time: '25 dk',
    ingredients: '150 g tavuk göğsü, 120 g pişmiş kinoa, salatalık, çeri domates, roka, 2 çay kaşığı zeytinyağı',
    steps: ['Tavuğu yağla tavada tamamen pişir ve dilimle.', 'Kinoayı, doğranmış sebzeleri ve tavuğu kaseye al.'],
  },
  {
    id: 'mercimek-corbasi', name: 'Kırmızı mercimek çorbası', photo: require('@/assets/images/recipes/6.jpg'),
    category: 'main',
    calories: 260, proteinGrams: 15, time: '30 dk',
    ingredients: '55 g kırmızı mercimek, yarım havuç, yarım soğan, 1 çay kaşığı zeytinyağı, 350 ml su, kimyon',
    steps: ['Soğan ve havucu doğrayıp yağda birkaç dakika çevir.', 'Mercimeği ve suyu ekle. Mercimek yumuşayana kadar pişir ve kimyonla tatlandır.'],
  },
  {
    id: 'ton-balikli-fasulye', name: 'Ton balıklı fasulye salatası', photo: require('@/assets/images/recipes/7.jpg'),
    category: 'main',
    calories: 315, proteinGrams: 34, time: '10 dk',
    ingredients: '90 g suda ton balığı, 120 g haşlanmış kuru fasulye, kırmızı biber, maydanoz, 1 çay kaşığı zeytinyağı, limon',
    steps: ['Balığı ve fasulyeyi süz, biberi ve maydanozu doğra.', 'Tüm malzemeleri yağ ve limonla karıştır.'],
  },
  {
    id: 'ispanakli-omlet', name: 'Ispanaklı omlet', photo: require('@/assets/images/recipes/8.jpg'),
    category: 'breakfast',
    calories: 225, proteinGrams: 15, time: '12 dk',
    ingredients: '2 yumurta, 60 g ıspanak, 5 çeri domates, 1 çay kaşığı zeytinyağı, roka',
    steps: ['Ispanağı yağda sotele ve çırpılmış yumurtayı tavaya dök.', 'Yumurta pişince omleti katla ve domates ile roka eşliğinde servis et.'],
  },
  {
    id: 'brokolili-somon', name: 'Fırında somon ve brokoli', photo: require('@/assets/images/recipes/9.jpg'),
    category: 'main',
    calories: 390, proteinGrams: 31, time: '25 dk',
    ingredients: '130 g somon, 180 g brokoli, 1 çay kaşığı zeytinyağı, limon',
    steps: ['Brokoli ve somonu fırın tepsisine al, zeytinyağını gezdir.', '200 °C fırında somon pişip brokoli yumuşayana kadar pişir. Limonla servis et.'],
  },
  {
    id: 'humuslu-durum', name: 'Humuslu sebze dürümü', photo: require('@/assets/images/recipes/10.jpg'),
    category: 'main',
    calories: 335, proteinGrams: 12, time: '25 dk',
    ingredients: '1 tam buğday lavaş, 60 g humus, 100 g patlıcan, 1 kırmızı biber, roka, 1 çay kaşığı zeytinyağı',
    steps: ['Patlıcan ve biberi dilimle ve 200 °C fırında yağla birlikte yumuşayana kadar kızart.', 'Humusu lavaşa sür. Sebzeleri ve rokayı ekle, lavaşı sar.'],
  },
  {
    id: 'yaban-mersinli-yulaf', name: 'Yaban mersinli gecelik yulaf', photo: require('@/assets/images/recipes/11.jpg'),
    category: 'breakfast',
    calories: 325, proteinGrams: 12, time: '5 dk + bekleme',
    ingredients: '45 g yulaf, 150 ml süt, 60 g yaban mersini, 1 çay kaşığı chia',
    steps: ['Yulaf, süt ve chia tohumunu kapaklı kavanozda karıştır.', 'Gece boyunca buzdolabında beklet. Yaban mersinini servis ederken ekle.'],
  },
  {
    id: 'elmali-yogurt', name: 'Elmalı tarçınlı yoğurt', photo: require('@/assets/images/recipes/12.jpg'),
    category: 'snack',
    calories: 265, proteinGrams: 9, time: '5 dk',
    ingredients: '180 g sade yoğurt, 1 küçük elma, 12 g ceviz, tarçın',
    steps: ['Elmayı küp küp doğra ve cevizi iri parçala.', 'Yoğurdun üzerine elma, ceviz ve tarçını ekle.'],
  },
  {
    id: 'nohutlu-avokado', name: 'Nohutlu avokado tostu', photo: require('@/assets/images/recipes/13.jpg'),
    category: 'breakfast',
    calories: 320, proteinGrams: 15, time: '10 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 70 g haşlanmış nohut, çeyrek avokado, limon, maydanoz',
    steps: ['Ekmeği kızart. Avokadoyu limonla ez.', 'Avokadoyu ekmeğe sür, nohut ve maydanozla tamamla.'],
  },
  {
    id: 'lorlu-salatalik', name: 'Lor peynirli salatalık kasesi', photo: require('@/assets/images/recipes/14.jpg'),
    category: 'snack',
    calories: 200, proteinGrams: 16, time: '5 dk',
    ingredients: '120 g lor peyniri, 1 salatalık, dereotu, 1 çay kaşığı zeytinyağı, karabiber',
    steps: ['Salatalığı dilimle ve dereotunu doğra.', 'Lorla birlikte kaseye al. Zeytinyağı ve karabiber ekle.'],
  },
  {
    id: 'ispanakli-smoothie', name: 'Ispanaklı muzlu smoothie', photo: require('@/assets/images/recipes/15.jpg'),
    category: 'drink',
    calories: 230, proteinGrams: 9, time: '5 dk',
    ingredients: '1 küçük muz, 200 ml süt, 1 avuç ıspanak',
    steps: ['Ispanağı yıka ve muzu dilimle.', 'Tüm malzemeleri blenderda pürüzsüz olana kadar karıştır.'],
  },
  {
    id: 'yogurtlu-tatli-patates', name: 'Yoğurtlu fırın tatlı patates', photo: require('@/assets/images/recipes/16.jpg'),
    category: 'main',
    calories: 265, proteinGrams: 7, time: '45 dk',
    ingredients: '1 orta boy tatlı patates (220 g), 100 g sade yoğurt, maydanoz, pul biber',
    steps: ['Patatesi yıka, çatalla del ve 200 °C fırında yumuşayana kadar pişir.', 'Ortadan aç ve yoğurt, maydanoz ve pul biber ekle.'],
  },
  {
    id: 'muzlu-yulaf-pankek', name: 'Muzlu yulaf pankek', photo: require('@/assets/images/recipes/17.jpg'),
    category: 'breakfast',
    calories: 330, proteinGrams: 15, time: '15 dk',
    ingredients: '1 küçük muz, 40 g yulaf, 1 yumurta, 50 g sade yoğurt, yarım çay kaşığı kabartma tozu',
    steps: [
      'Muzun yarısını ezip yulaf, yumurta ve kabartma tozuyla karıştır.',
      'Yapışmaz tavada küçük pankekler yap. Altları kızarınca çevir ve diğer yüzünü pişir.',
      'Kalan muzu dilimle, yoğurtla birlikte pankeklerin üzerine koy.',
    ],
  },
  {
    id: 'lorlu-yumurta-tostu', name: 'Lor peynirli yumurtalı tost', photo: require('@/assets/images/recipes/18.jpg'),
    category: 'breakfast',
    calories: 335, proteinGrams: 25, time: '12 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 2 yumurta, 50 g lor peyniri, karabiber',
    steps: [
      'Ekmeği kızart. Yumurtaları çırpıp yapışmaz tavada karıştırarak pişir.',
      'Yumurtalar pişince lor ve karabiberi ekle. Kızarmış ekmeğin üzerine paylaştır.',
    ],
  },
  {
    id: 'kakaolu-chia-puding', name: 'Kakaolu muzlu chia pudingi', photo: require('@/assets/images/recipes/19.jpg'),
    category: 'snack',
    calories: 290, proteinGrams: 11, time: '10 dk + bekleme',
    ingredients: '20 g chia tohumu, 200 ml yarım yağlı süt, 1 küçük muz, 1 yemek kaşığı şekersiz kakao',
    steps: [
      'Muzun yarısını ez. Süt, chia ve kakaoyla karıştır.',
      '10 dakika sonra yeniden karıştırıp en az 3 saat buzdolabında beklet.',
      'Kalan muzu dilimleyip üzerine koy.',
    ],
  },
  {
    id: 'cilekli-kefir', name: 'Çilekli kefir smoothie', photo: require('@/assets/images/recipes/20.jpg'),
    category: 'drink',
    calories: 245, proteinGrams: 10, time: '5 dk',
    ingredients: '250 ml sade kefir, 120 g çilek, yarım muz, 15 g yulaf',
    steps: [
      'Çilekleri yıka ve saplarını ayır. Muzu kabuğundan çıkar.',
      'Kefir, meyveler ve yulafı blenderda karıştır. Soğuk servis et.',
    ],
  },
  {
    id: 'yogurtlu-tavuk-durum', name: 'Yoğurt soslu tavuk dürüm', photo: require('@/assets/images/recipes/21.jpg'),
    category: 'main',
    calories: 420, proteinGrams: 36, time: '25 dk',
    ingredients: '140 g çiğ tavuk göğsü, 1 tam buğday lavaş (60 g), 50 g sade yoğurt, marul, limon, 1 çay kaşığı zeytinyağı',
    steps: [
      'Tavuğu ince dilimle, yağla tavada her tarafını pişir. En kalın parça 74 °C olunca ocaktan al.',
      'Yoğurdu limonla karıştırıp lavaşa sür. Marulu ve tavuğu ekleyip lavaşı sar.',
    ],
  },
  {
    id: 'hindi-kofte-bulgur', name: 'Bulgurlu hindi köfte', photo: require('@/assets/images/recipes/22.jpg'),
    category: 'main',
    calories: 450, proteinGrams: 35, time: '30 dk',
    ingredients: '140 g hindi kıyması, 160 g pişmiş bulgur, 15 g yulaf, yarım küçük soğan, maydanoz, 1 çay kaşığı zeytinyağı',
    steps: [
      'Soğanı rendele. Hindi kıyması, yulaf ve maydanozla karıştırıp küçük köfteler yap.',
      'Köfteleri yağla tavada çevirerek pişir. En kalın köftenin içi 74 °C\'ye ulaştığında ocaktan al.',
      'Pişmiş bulgur ve kıyılmış maydanozla servis et.',
    ],
  },
  {
    id: 'havuclu-yesil-mercimek', name: 'Fırın havuçlu yeşil mercimek salatası', photo: require('@/assets/images/recipes/23.jpg'),
    category: 'main',
    calories: 400, proteinGrams: 22, time: '25 dk',
    ingredients: '180 g haşlanmış yeşil mercimek, 150 g havuç, 40 g beyaz peynir, 1 çay kaşığı zeytinyağı, limon, maydanoz',
    steps: [
      'Havucu dilimleyip yağla karıştır. 200 °C fırında 20 dakika, yumuşayana kadar pişir.',
      'Havuç ve mercimeği karıştır. Üzerine peynir, limon ve maydanoz ekle.',
    ],
  },
  {
    id: 'kabakli-levrek', name: 'Kabaklı fırın levrek', photo: require('@/assets/images/recipes/24.jpg'),
    category: 'main',
    calories: 290, proteinGrams: 38, time: '25 dk',
    ingredients: '180 g levrek fileto, 200 g kabak, 2 çay kaşığı zeytinyağı, limon, dereotu',
    steps: [
      'Kabağı dilimle ve yağla harmanla. 200 °C fırında 8 dakika pişir.',
      'Levreği tepsiye ekleyip iç sıcaklığı 63 °C olana kadar pişir. Limon ve dereotuyla servis et.',
    ],
  },
  {
    id: 'yogurtlu-nohut-kinoa', name: 'Yoğurtlu nohut ve kinoa kasesi', photo: require('@/assets/images/recipes/25.jpg'),
    category: 'main',
    calories: 420, proteinGrams: 24, time: '12 dk',
    ingredients: '100 g haşlanmış nohut, 120 g pişmiş kinoa, 150 g süzme yoğurt, yarım salatalık, limon, nane',
    steps: [
      'Kinoayı, nohudu ve küp doğradığın salatalığı kaseye al.',
      'Yoğurdu limon ve naneyle karıştır. Kasedeki malzemelerin üzerine gezdir.',
    ],
  },
  {
    id: 'biberli-domatesli-yumurta', name: 'Domates ve biberli yumurta', photo: require('@/assets/images/recipes/26.jpg'),
    category: 'breakfast',
    calories: 335, proteinGrams: 18, time: '20 dk',
    ingredients: '2 yumurta, 200 g domates, 1 kırmızı biber, yarım soğan, 1 çay kaşığı zeytinyağı, 1 dilim tam tahıllı ekmek',
    steps: [
      'Soğan ve biberi doğrayıp yağda yumuşat. Doğranmış domatesi ekleyip sos koyulaşana kadar pişir.',
      'Sosta iki yuva açıp yumurtaları kır. Kapağı kapat ve yumurtalar pişince ekmekle servis et.',
    ],
  },
  {
    id: 'bezelyeli-makarna-salatasi', name: 'Yoğurtlu bezelyeli makarna salatası', photo: require('@/assets/images/recipes/27.jpg'),
    category: 'main',
    calories: 400, proteinGrams: 20, time: '20 dk',
    ingredients: '150 g pişmiş tam buğday makarna, 100 g haşlanmış bezelye, 100 g süzme yoğurt, 1 çay kaşığı zeytinyağı, limon, dereotu',
    steps: [
      'Makarna ve bezelyeyi soğutup bir kasede karıştır.',
      'Yoğurdu zeytinyağı, limon ve dereotuyla çırp. Sosu salataya ekleyip karıştır.',
    ],
  },
  {
    id: 'firin-elma-yogurt', name: 'Yoğurtlu tarçınlı fırın elma', photo: require('@/assets/images/recipes/28.jpg'),
    category: 'snack',
    calories: 260, proteinGrams: 10, time: '30 dk',
    ingredients: '1 orta boy elma, 150 g sade yoğurt, 12 g ceviz, tarçın',
    steps: [
      'Elmayı ikiye kes, çekirdeklerini çıkar ve tarçın serp.',
      '190 °C fırında yaklaşık 20–25 dakika, elma yumuşayana kadar pişir.',
      'Ilıyan elmayı yoğurt ve iri kırılmış cevizle servis et.',
    ],
  },
  {
    id: 'mantarli-omlet', name: 'Mantarlı ıspanaklı omlet', photo: require('@/assets/images/recipes/29.jpg'),
    category: 'breakfast',
    calories: 245, proteinGrams: 18, time: '15 dk',
    ingredients: '2 yumurta, 100 g mantar, 50 g ıspanak, 30 g beyaz peynir, 1 çay kaşığı zeytinyağı',
    steps: [
      'Mantarı dilimle ve zeytinyağında suyunu çekene kadar sotele. Ispanağı ekle.',
      'Çırpılmış yumurtayı dök, peyniri ufala ve omleti yumurta tamamen pişince katla.',
    ],
  },
  {
    id: 'lorlu-domates-tostu', name: 'Lor peynirli domates tostu', photo: require('@/assets/images/recipes/30.jpg'),
    category: 'breakfast',
    calories: 290, proteinGrams: 20, time: '10 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 100 g lor peyniri, 1 domates, 1 çay kaşığı zeytinyağı, kekik',
    steps: [
      'Ekmeği kızart. Lor peynirini zeytinyağı ve kekikle karıştır.',
      'Lor karışımını ekmeğe yay ve domates dilimlerini üzerine koy.',
    ],
  },
  {
    id: 'firin-nohut', name: 'Kimyonlu fırın nohut', photo: require('@/assets/images/recipes/31.jpg'),
    category: 'snack',
    calories: 240, proteinGrams: 11, time: '30 dk',
    ingredients: '120 g haşlanmış nohut, 1 çay kaşığı zeytinyağı, kimyon, toz kırmızı biber',
    steps: [
      'Nohudu süzüp iyice kurula. Yağ ve baharatla karıştır.',
      '200 °C fırında 20–25 dakika pişir. Pişirmenin ortasında tepsiyi salla.',
    ],
  },
  {
    id: 'armutlu-bademli-yogurt', name: 'Armutlu bademli yoğurt', photo: require('@/assets/images/recipes/32.jpg'),
    category: 'snack',
    calories: 280, proteinGrams: 13, time: '5 dk',
    ingredients: '150 g sade süzme yoğurt, 1 küçük armut, 15 g badem, tarçın',
    steps: [
      'Armudu küçük parçalar halinde doğra. Bademleri iri kır.',
      'Yoğurdu kaseye alıp armut, badem ve tarçınla tamamla.',
    ],
  },
  {
    id: 'kakaolu-muzlu-kefir', name: 'Kakaolu muzlu kefir', photo: require('@/assets/images/recipes/33.jpg'),
    category: 'drink',
    calories: 240, proteinGrams: 11, time: '5 dk',
    ingredients: '250 ml sade kefir, 1 küçük muz, 1 yemek kaşığı şekersiz kakao',
    steps: [
      'Muzu soyup dilimle. Kefir ve kakaoyla blendera koy.',
      'Pürüzsüz olana kadar karıştır ve bardağa dök.',
    ],
  },
  {
    id: 'yaban-mersinli-smoothie', name: 'Yaban mersinli yulaf smoothie', photo: require('@/assets/images/recipes/34.jpg'),
    category: 'drink',
    calories: 295, proteinGrams: 17, time: '5 dk',
    ingredients: '100 g yaban mersini, 150 g sade süzme yoğurt, 25 g yulaf, 100 ml su',
    steps: [
      'Yaban mersini ve yoğurdu blendera al. Yulafı ve suyu ekle.',
      'Pürüzsüz olana kadar çek. Daha akışkan kıvam için biraz su ekle.',
    ],
  },
  {
    id: 'tavuklu-tam-bugday-makarna', name: 'Tavuklu sebzeli tam buğday makarna', photo: require('@/assets/images/recipes/35.jpg'),
    category: 'main',
    calories: 490, proteinGrams: 42, time: '30 dk',
    ingredients: '140 g çiğ tavuk göğsü, 180 g pişmiş tam buğday makarna, 120 g kabak, 100 g domates, 2 çay kaşığı zeytinyağı',
    steps: [
      'Tavuğu küp doğra ve zeytinyağında iç sıcaklığı 74 °C olana kadar pişir.',
      'Kabak ve domatesi doğrayıp tavaya ekle. Sebzeler yumuşayınca pişmiş makarnayla karıştır.',
    ],
  },
  {
    id: 'mercimekli-esmer-pirinc', name: 'Yeşil mercimekli esmer pirinç pilavı', photo: require('@/assets/images/recipes/36.jpg'),
    category: 'main',
    calories: 420, proteinGrams: 18, time: '20 dk',
    ingredients: '150 g haşlanmış yeşil mercimek, 150 g pişmiş esmer pirinç, yarım küçük soğan, 2 çay kaşığı zeytinyağı, maydanoz, limon',
    steps: [
      'Soğanı küçük doğrayıp zeytinyağında yumuşayana kadar çevir.',
      'Mercimek ve pirinci ekleyip karıştırarak ısıt. Maydanoz ve limonla servis et.',
    ],
  },
  {
    id: 'yesil-biberli-menemen', name: 'Yeşil biberli menemen', photo: require('@/assets/images/recipes/37.jpg'),
    category: 'breakfast',
    calories: 310, proteinGrams: 17, time: '20 dk',
    ingredients: '2 yumurta, 200 g domates, 2 yeşil biber, 1 çay kaşığı zeytinyağı, 1 dilim tam tahıllı ekmek',
    steps: [
      'Biberleri doğrayıp yağda yumuşat. Doğranmış domatesi ekleyip suyunun biraz çekmesini bekle.',
      'Yumurtaları tavaya kırıp karıştır. Tamamen pişince ekmekle servis et.',
    ],
  },
  {
    id: 'orman-meyveli-firin-yulaf', name: 'Orman meyveli fırın yulaf', photo: require('@/assets/images/recipes/38.jpg'),
    category: 'breakfast',
    calories: 350, proteinGrams: 17, time: '30 dk',
    ingredients: '45 g yulaf, 1 yumurta, 130 ml süt, 100 g orman meyvesi, yarım çay kaşığı kabartma tozu',
    steps: [
      'Yulaf, yumurta, süt ve kabartma tozunu karıştır. Meyveleri ekle.',
      'Küçük bir fırın kabına dök ve 180 °C fırında ortası katılaşana kadar yaklaşık 25 dakika pişir.',
    ],
  },
  {
    id: 'labneli-salatalikli-ekmek', name: 'Labneli salatalıklı açık tost', photo: require('@/assets/images/recipes/39.jpg'),
    category: 'breakfast',
    calories: 315, proteinGrams: 11, time: '8 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 60 g labne, 100 g salatalık, dereotu, limon kabuğu rendesi',
    steps: [
      'Ekmeği kızart. Labneyi kıyılmış dereotu ve limon kabuğu rendesiyle karıştır.',
      'Labneyi ekmeğe sürüp ince salatalık dilimlerini üzerine diz.',
    ],
  },
  {
    id: 'peynirli-yulaf-pankek', name: 'Peynirli maydanozlu yulaf pankek', photo: require('@/assets/images/recipes/40.jpg'),
    category: 'breakfast',
    calories: 375, proteinGrams: 20, time: '20 dk',
    ingredients: '45 g yulaf unu, 1 yumurta, 70 g sade yoğurt, 35 g beyaz peynir, maydanoz, 1 çay kaşığı zeytinyağı',
    steps: [
      'Yulaf unu, yumurta ve yoğurdu karıştır. Ufalanmış peynir ve maydanozu ekle.',
      'Tavayı hafifçe yağla. Hamurdan küçük porsiyonlar döküp iki yüzünü de pişir.',
    ],
  },
  {
    id: 'tavuklu-beyaz-fasulye', name: 'Izgara tavuklu beyaz fasulye salatası', photo: require('@/assets/images/recipes/41.jpg'),
    category: 'main',
    calories: 410, proteinGrams: 43, time: '25 dk',
    ingredients: '130 g çiğ tavuk göğsü, 130 g haşlanmış beyaz fasulye, 1 domates, 1 küçük salatalık, 2 çay kaşığı zeytinyağı, limon, maydanoz',
    steps: [
      'Tavuğu ızgara tavada iç sıcaklığı 74 °C olana kadar pişir ve dilimle.',
      'Fasulye, doğranmış sebze ve maydanozu karıştır. Limon ve zeytinyağı ekleyip tavukla servis et.',
    ],
  },
  {
    id: 'somonlu-mercimek', name: 'Somonlu yeşil mercimek kasesi', photo: require('@/assets/images/recipes/42.jpg'),
    category: 'main',
    calories: 455, proteinGrams: 40, time: '25 dk',
    ingredients: '130 g somon, 140 g haşlanmış yeşil mercimek, 1 avuç roka, 1 çay kaşığı zeytinyağı, limon',
    steps: [
      'Somonu zeytinyağıyla yağla ve 200 °C fırında iç sıcaklığı 63 °C olana kadar pişir.',
      'Mercimeği roka ve limonla karıştır. Üzerine somonu koy.',
    ],
  },
  {
    id: 'brokolili-nohut-bulgur', name: 'Brokolili nohut ve bulgur kasesi', photo: require('@/assets/images/recipes/43.jpg'),
    category: 'main',
    calories: 410, proteinGrams: 19, time: '25 dk',
    ingredients: '130 g haşlanmış nohut, 110 g pişmiş bulgur, 150 g brokoli, 15 g tahin, 1 çay kaşığı zeytinyağı, limon',
    steps: [
      'Brokoliyi zeytinyağıyla karıştırıp 200 °C fırında yaklaşık 15 dakika pişir.',
      'Bulgur, nohut ve brokoliyi kaseye al. Tahini limon ve biraz suyla açıp üzerine gezdir.',
    ],
  },
  {
    id: 'kiymali-esmer-pirinc', name: 'Sebzeli kıymalı esmer pirinç', photo: require('@/assets/images/recipes/44.jpg'),
    category: 'main',
    calories: 470, proteinGrams: 33, time: '30 dk',
    ingredients: '130 g az yağlı dana kıyma, 150 g pişmiş esmer pirinç, 1 kırmızı biber, 100 g kabak, 1 çay kaşığı zeytinyağı',
    steps: [
      'Kıymayı yağla tavada topaklarını ayırarak iç sıcaklığı 71 °C olana kadar pişir.',
      'Doğranmış biber ve kabağı ekle. Sebzeler yumuşayınca pirinci ekleyip karıştırarak ısıt.',
    ],
  },
  {
    id: 'havuclu-fasulye-ezmesi', name: 'Havuç çubukları ve fasulye ezmesi', photo: require('@/assets/images/recipes/45.jpg'),
    category: 'snack',
    calories: 230, proteinGrams: 11, time: '10 dk',
    ingredients: '120 g haşlanmış beyaz fasulye, 120 g havuç, 1 çay kaşığı zeytinyağı, limon, kimyon',
    steps: [
      'Fasulyeyi zeytinyağı, limon ve kimyonla ez. Kıvam için az su ekle.',
      'Havucu çubuk şeklinde kes ve fasulye ezmesine batırarak servis et.',
    ],
  },
  {
    id: 'kabak-cipsi-yogurt', name: 'Fırın kabak cipsi ve yoğurt', photo: require('@/assets/images/recipes/46.jpg'),
    category: 'snack',
    calories: 195, proteinGrams: 11, time: '35 dk',
    ingredients: '250 g kabak, 1 çay kaşığı zeytinyağı, 15 g tam buğday galeta unu, 120 g sade yoğurt, sarımsak',
    steps: [
      'Kabağı ince dilimle, kurula ve yağ ile galeta ununa bula.',
      '200 °C fırında tek sıra halinde yaklaşık 25 dakika pişir. Sarımsaklı yoğurtla servis et.',
    ],
  },
  {
    id: 'kakaolu-hurmali-toplar', name: 'Kakaolu hurmalı yulaf topları', photo: require('@/assets/images/recipes/47.jpg'),
    category: 'snack',
    calories: 290, proteinGrams: 7, time: '15 dk',
    ingredients: '40 g çekirdeksiz hurma, 25 g yulaf, 15 g fıstık ezmesi, 1 çay kaşığı şekersiz kakao',
    steps: [
      'Hurma, yulaf, fıstık ezmesi ve kakaoyu mutfak robotunda çek. Gerekirse bir çay kaşığı su ekle.',
      'Karışımı üç küçük top yapıp buzdolabında kısa süre dinlendir.',
    ],
  },
  {
    id: 'fistik-ezmeli-elma', name: 'Fıstık ezmeli elma dilimleri', photo: require('@/assets/images/recipes/48.jpg'),
    category: 'snack',
    calories: 240, proteinGrams: 6, time: '5 dk',
    ingredients: '1 orta boy elma, 25 g şekersiz fıstık ezmesi, tarçın',
    steps: [
      'Elmayı yıkayıp çekirdeklerini çıkar ve dilimle.',
      'Dilimlere fıstık ezmesi sürüp tarçın serp.',
    ],
  },
  {
    id: 'mangolu-lassi', name: 'Mangolu yoğurt lassi', photo: require('@/assets/images/recipes/49.jpg'),
    category: 'drink',
    calories: 210, proteinGrams: 13, time: '5 dk',
    ingredients: '160 g sade süzme yoğurt, 120 g mango, 100 ml soğuk su, bir tutam kakule',
    steps: [
      'Mangoyu soyup küp doğra. Yoğurt, su ve kakuleyle blenderda çek.',
      'Kıvamı koyuysa biraz su ekle ve soğuk servis et.',
    ],
  },
  {
    id: 'ananasli-kefir', name: 'Ananaslı ıspanaklı kefir', photo: require('@/assets/images/recipes/50.jpg'),
    category: 'drink',
    calories: 195, proteinGrams: 10, time: '5 dk',
    ingredients: '250 ml sade kefir, 140 g ananas, 1 avuç ıspanak',
    steps: [
      'Ananası doğra ve ıspanağı iyice yıka.',
      'Kefirle birlikte blenderda pürüzsüz olana kadar karıştır.',
    ],
  },
  {
    id: 'buzlu-sutlu-kahve', name: 'Buzlu sütlü kahve', photo: require('@/assets/images/recipes/51.jpg'),
    category: 'drink',
    calories: 100, proteinGrams: 7, time: '5 dk',
    ingredients: '200 ml yarım yağlı süt, 1 shot espresso (30 ml), buz',
    steps: [
      'Bardağı buzla doldurup sütü ekle.',
      'Espressoyu üzerine dök ve karıştır.',
    ],
  },
  {
    id: 'salatalik-limon-soda', name: 'Salatalıklı naneli limon soda', photo: require('@/assets/images/recipes/52.jpg'),
    category: 'drink',
    calories: 15, proteinGrams: 0, time: '5 dk',
    ingredients: '250 ml sade maden suyu, 60 g salatalık, 1 yemek kaşığı limon suyu, taze nane, buz',
    steps: [
      'Salatalığı ince dilimle. Nane ve limon suyuyla birlikte bardağa al.',
      'Buz ve maden suyunu ekle, hafifçe karıştır.',
    ],
  },
];
