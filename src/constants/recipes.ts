import type { ImageSource } from 'expo-image';

type Recipe = {
  id: string;
  name: string;
  photo: ImageSource | number;
  calories: number;
  proteinGrams: number;
  time: string;
  ingredients: string;
  steps: string[];
  afterWorkoutMeal?: boolean;
};

export const recipes: Recipe[] = [
  {
    id: 'muzlu-yulaf', name: 'Muzlu yulaf kasesi', photo: require('@/assets/images/recipes/1.jpg'),
    calories: 400, proteinGrams: 16, time: '5 dk',
    ingredients: '40 g yulaf, 150 g sade yoğurt, 1 küçük muz, 1 yemek kaşığı fıstık ezmesi',
    steps: ['Yulafı ve yoğurdu karıştır.', 'Muzu dilimle ve fıstık ezmesiyle üzerine ekle.'],
  },
  {
    id: 'nohutlu-bulgur', name: 'Nohutlu bulgur salatası', photo: require('@/assets/images/recipes/2.jpg'),
    afterWorkoutMeal: true,
    calories: 435, proteinGrams: 15, time: '15 dk',
    ingredients: '120 g haşlanmış nohut, 100 g pişmiş bulgur, domates, salatalık, 1 yemek kaşığı zeytinyağı, limon',
    steps: ['Domatesi ve salatalığı doğra.', 'Nohut ve bulgurla karıştır. Yağ ve limonla tatlandır.'],
  },
  {
    id: 'avokado-yumurta', name: 'Avokadolu yumurta tostu', photo: require('@/assets/images/recipes/3.jpg'),
    afterWorkoutMeal: true,
    calories: 370, proteinGrams: 16, time: '12 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 1 yumurta, yarım avokado, limon',
    steps: ['Ekmeği kızart ve yumurtayı haşla.', 'Avokadoyu limonla ez, ekmeğe sür ve yumurtayı ekle.'],
  },
  {
    id: 'cilekli-parfe', name: 'Çilekli yoğurt parfe', photo: require('@/assets/images/recipes/4.jpg'),
    calories: 260, proteinGrams: 10, time: '5 dk',
    ingredients: '170 g sade yoğurt, 100 g çilek, 30 g yulaflı granola',
    steps: ['Çilekleri yıka ve dilimle.', 'Yoğurt, çilek ve granolayı bir bardakta katmanla.'],
  },
  {
    id: 'tavuklu-kinoa', name: 'Tavuklu kinoa kasesi', photo: require('@/assets/images/recipes/5.jpg'),
    afterWorkoutMeal: true,
    calories: 460, proteinGrams: 40, time: '25 dk',
    ingredients: '150 g tavuk göğsü, 120 g pişmiş kinoa, salatalık, çeri domates, roka, 2 çay kaşığı zeytinyağı',
    steps: ['Tavuğu yağla tavada tamamen pişir ve dilimle.', 'Kinoayı, doğranmış sebzeleri ve tavuğu kaseye al.'],
  },
  {
    id: 'mercimek-corbasi', name: 'Kırmızı mercimek çorbası', photo: require('@/assets/images/recipes/6.jpg'),
    calories: 260, proteinGrams: 15, time: '30 dk',
    ingredients: '55 g kırmızı mercimek, yarım havuç, yarım soğan, 1 çay kaşığı zeytinyağı, 350 ml su, kimyon',
    steps: ['Soğan ve havucu doğrayıp yağda birkaç dakika çevir.', 'Mercimeği ve suyu ekle. Mercimek yumuşayana kadar pişir ve kimyonla tatlandır.'],
  },
  {
    id: 'ton-balikli-fasulye', name: 'Ton balıklı fasulye salatası', photo: require('@/assets/images/recipes/7.jpg'),
    afterWorkoutMeal: true,
    calories: 315, proteinGrams: 34, time: '10 dk',
    ingredients: '90 g suda ton balığı, 120 g haşlanmış kuru fasulye, kırmızı biber, maydanoz, 1 çay kaşığı zeytinyağı, limon',
    steps: ['Balığı ve fasulyeyi süz, biberi ve maydanozu doğra.', 'Tüm malzemeleri yağ ve limonla karıştır.'],
  },
  {
    id: 'ispanakli-omlet', name: 'Ispanaklı omlet', photo: require('@/assets/images/recipes/8.jpg'),
    afterWorkoutMeal: true,
    calories: 225, proteinGrams: 15, time: '12 dk',
    ingredients: '2 yumurta, 60 g ıspanak, 5 çeri domates, 1 çay kaşığı zeytinyağı, roka',
    steps: ['Ispanağı yağda sotele ve çırpılmış yumurtayı tavaya dök.', 'Yumurta pişince omleti katla ve domates ile roka eşliğinde servis et.'],
  },
  {
    id: 'brokolili-somon', name: 'Fırında somon ve brokoli', photo: require('@/assets/images/recipes/9.jpg'),
    afterWorkoutMeal: true,
    calories: 390, proteinGrams: 31, time: '25 dk',
    ingredients: '130 g somon, 180 g brokoli, 1 çay kaşığı zeytinyağı, limon',
    steps: ['Brokoli ve somonu fırın tepsisine al, zeytinyağını gezdir.', '200 °C fırında somon pişip brokoli yumuşayana kadar pişir. Limonla servis et.'],
  },
  {
    id: 'humuslu-durum', name: 'Humuslu sebze dürümü', photo: require('@/assets/images/recipes/10.jpg'),
    afterWorkoutMeal: true,
    calories: 335, proteinGrams: 12, time: '25 dk',
    ingredients: '1 tam buğday lavaş, 60 g humus, 100 g patlıcan, 1 kırmızı biber, roka, 1 çay kaşığı zeytinyağı',
    steps: ['Patlıcan ve biberi dilimle ve 200 °C fırında yağla birlikte yumuşayana kadar kızart.', 'Humusu lavaşa sür. Sebzeleri ve rokayı ekle, lavaşı sar.'],
  },
  {
    id: 'yaban-mersinli-yulaf', name: 'Yaban mersinli gecelik yulaf', photo: require('@/assets/images/recipes/11.jpg'),
    calories: 325, proteinGrams: 12, time: '5 dk + bekleme',
    ingredients: '45 g yulaf, 150 ml süt, 60 g yaban mersini, 1 çay kaşığı chia',
    steps: ['Yulaf, süt ve chia tohumunu kapaklı kavanozda karıştır.', 'Gece boyunca buzdolabında beklet. Yaban mersinini servis ederken ekle.'],
  },
  {
    id: 'elmali-yogurt', name: 'Elmalı tarçınlı yoğurt', photo: require('@/assets/images/recipes/12.jpg'),
    calories: 265, proteinGrams: 9, time: '5 dk',
    ingredients: '180 g sade yoğurt, 1 küçük elma, 12 g ceviz, tarçın',
    steps: ['Elmayı küp küp doğra ve cevizi iri parçala.', 'Yoğurdun üzerine elma, ceviz ve tarçını ekle.'],
  },
  {
    id: 'nohutlu-avokado', name: 'Nohutlu avokado tostu', photo: require('@/assets/images/recipes/13.jpg'),
    calories: 320, proteinGrams: 15, time: '10 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 70 g haşlanmış nohut, çeyrek avokado, limon, maydanoz',
    steps: ['Ekmeği kızart. Avokadoyu limonla ez.', 'Avokadoyu ekmeğe sür, nohut ve maydanozla tamamla.'],
  },
  {
    id: 'lorlu-salatalik', name: 'Lor peynirli salatalık kasesi', photo: require('@/assets/images/recipes/14.jpg'),
    calories: 200, proteinGrams: 16, time: '5 dk',
    ingredients: '120 g lor peyniri, 1 salatalık, dereotu, 1 çay kaşığı zeytinyağı, karabiber',
    steps: ['Salatalığı dilimle ve dereotunu doğra.', 'Lorla birlikte kaseye al. Zeytinyağı ve karabiber ekle.'],
  },
  {
    id: 'ispanakli-smoothie', name: 'Ispanaklı muzlu smoothie', photo: require('@/assets/images/recipes/15.jpg'),
    calories: 230, proteinGrams: 9, time: '5 dk',
    ingredients: '1 küçük muz, 200 ml süt, 1 avuç ıspanak',
    steps: ['Ispanağı yıka ve muzu dilimle.', 'Tüm malzemeleri blenderda pürüzsüz olana kadar karıştır.'],
  },
  {
    id: 'yogurtlu-tatli-patates', name: 'Yoğurtlu fırın tatlı patates', photo: require('@/assets/images/recipes/16.jpg'),
    calories: 265, proteinGrams: 7, time: '45 dk',
    ingredients: '1 orta boy tatlı patates (220 g), 100 g sade yoğurt, maydanoz, pul biber',
    steps: ['Patatesi yıka, çatalla del ve 200 °C fırında yumuşayana kadar pişir.', 'Ortadan aç ve yoğurt, maydanoz ve pul biber ekle.'],
  },
  {
    id: 'muzlu-yulaf-pankek', name: 'Muzlu yulaf pankek', photo: require('@/assets/images/recipes/17.jpg'),
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
    calories: 335, proteinGrams: 25, time: '12 dk',
    ingredients: '2 dilim tam tahıllı ekmek, 2 yumurta, 50 g lor peyniri, karabiber',
    steps: [
      'Ekmeği kızart. Yumurtaları çırpıp yapışmaz tavada karıştırarak pişir.',
      'Yumurtalar pişince lor ve karabiberi ekle. Kızarmış ekmeğin üzerine paylaştır.',
    ],
  },
  {
    id: 'kakaolu-chia-puding', name: 'Kakaolu muzlu chia pudingi', photo: require('@/assets/images/recipes/19.jpg'),
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
    calories: 245, proteinGrams: 10, time: '5 dk',
    ingredients: '250 ml sade kefir, 120 g çilek, yarım muz, 15 g yulaf',
    steps: [
      'Çilekleri yıka ve saplarını ayır. Muzu kabuğundan çıkar.',
      'Kefir, meyveler ve yulafı blenderda karıştır. Soğuk servis et.',
    ],
  },
  {
    id: 'yogurtlu-tavuk-durum', name: 'Yoğurt soslu tavuk dürüm', photo: require('@/assets/images/recipes/21.jpg'),
    calories: 420, proteinGrams: 36, time: '25 dk',
    ingredients: '140 g çiğ tavuk göğsü, 1 tam buğday lavaş (60 g), 50 g sade yoğurt, marul, limon, 1 çay kaşığı zeytinyağı',
    steps: [
      'Tavuğu ince dilimle, yağla tavada her tarafını pişir. En kalın parça 74 °C olunca ocaktan al.',
      'Yoğurdu limonla karıştırıp lavaşa sür. Marulu ve tavuğu ekleyip lavaşı sar.',
    ],
  },
  {
    id: 'hindi-kofte-bulgur', name: 'Bulgurlu hindi köfte', photo: require('@/assets/images/recipes/22.jpg'),
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
    calories: 400, proteinGrams: 22, time: '25 dk',
    ingredients: '180 g haşlanmış yeşil mercimek, 150 g havuç, 40 g beyaz peynir, 1 çay kaşığı zeytinyağı, limon, maydanoz',
    steps: [
      'Havucu dilimleyip yağla karıştır. 200 °C fırında 20 dakika, yumuşayana kadar pişir.',
      'Havuç ve mercimeği karıştır. Üzerine peynir, limon ve maydanoz ekle.',
    ],
  },
  {
    id: 'kabakli-levrek', name: 'Kabaklı fırın levrek', photo: require('@/assets/images/recipes/24.jpg'),
    calories: 290, proteinGrams: 38, time: '25 dk',
    ingredients: '180 g levrek fileto, 200 g kabak, 2 çay kaşığı zeytinyağı, limon, dereotu',
    steps: [
      'Kabağı dilimle ve yağla harmanla. 200 °C fırında 8 dakika pişir.',
      'Levreği tepsiye ekleyip iç sıcaklığı 63 °C olana kadar pişir. Limon ve dereotuyla servis et.',
    ],
  },
  {
    id: 'yogurtlu-nohut-kinoa', name: 'Yoğurtlu nohut ve kinoa kasesi', photo: require('@/assets/images/recipes/25.jpg'),
    calories: 420, proteinGrams: 24, time: '12 dk',
    ingredients: '100 g haşlanmış nohut, 120 g pişmiş kinoa, 150 g süzme yoğurt, yarım salatalık, limon, nane',
    steps: [
      'Kinoayı, nohudu ve küp doğradığın salatalığı kaseye al.',
      'Yoğurdu limon ve naneyle karıştır. Kasedeki malzemelerin üzerine gezdir.',
    ],
  },
  {
    id: 'biberli-domatesli-yumurta', name: 'Domates ve biberli yumurta', photo: require('@/assets/images/recipes/26.jpg'),
    calories: 335, proteinGrams: 18, time: '20 dk',
    ingredients: '2 yumurta, 200 g domates, 1 kırmızı biber, yarım soğan, 1 çay kaşığı zeytinyağı, 1 dilim tam tahıllı ekmek',
    steps: [
      'Soğan ve biberi doğrayıp yağda yumuşat. Doğranmış domatesi ekleyip sos koyulaşana kadar pişir.',
      'Sosta iki yuva açıp yumurtaları kır. Kapağı kapat ve yumurtalar pişince ekmekle servis et.',
    ],
  },
  {
    id: 'bezelyeli-makarna-salatasi', name: 'Yoğurtlu bezelyeli makarna salatası', photo: require('@/assets/images/recipes/27.jpg'),
    calories: 400, proteinGrams: 20, time: '20 dk',
    ingredients: '150 g pişmiş tam buğday makarna, 100 g haşlanmış bezelye, 100 g süzme yoğurt, 1 çay kaşığı zeytinyağı, limon, dereotu',
    steps: [
      'Makarna ve bezelyeyi soğutup bir kasede karıştır.',
      'Yoğurdu zeytinyağı, limon ve dereotuyla çırp. Sosu salataya ekleyip karıştır.',
    ],
  },
  {
    id: 'firin-elma-yogurt', name: 'Yoğurtlu tarçınlı fırın elma', photo: require('@/assets/images/recipes/28.jpg'),
    calories: 260, proteinGrams: 10, time: '30 dk',
    ingredients: '1 orta boy elma, 150 g sade yoğurt, 12 g ceviz, tarçın',
    steps: [
      'Elmayı ikiye kes, çekirdeklerini çıkar ve tarçın serp.',
      '190 °C fırında yaklaşık 20–25 dakika, elma yumuşayana kadar pişir.',
      'Ilıyan elmayı yoğurt ve iri kırılmış cevizle servis et.',
    ],
  },
];
