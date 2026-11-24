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
    calories: 435, proteinGrams: 15, time: '15 dk',
    ingredients: '120 g haşlanmış nohut, 100 g pişmiş bulgur, domates, salatalık, 1 yemek kaşığı zeytinyağı, limon',
    steps: ['Domatesi ve salatalığı doğra.', 'Nohut ve bulgurla karıştır. Yağ ve limonla tatlandır.'],
  },
  {
    id: 'avokado-yumurta', name: 'Avokadolu yumurta tostu', photo: require('@/assets/images/recipes/3.jpg'),
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
    calories: 315, proteinGrams: 34, time: '10 dk',
    ingredients: '90 g suda ton balığı, 120 g haşlanmış kuru fasulye, kırmızı biber, maydanoz, 1 çay kaşığı zeytinyağı, limon',
    steps: ['Balığı ve fasulyeyi süz, biberi ve maydanozu doğra.', 'Tüm malzemeleri yağ ve limonla karıştır.'],
  },
  {
    id: 'ispanakli-omlet', name: 'Ispanaklı omlet', photo: require('@/assets/images/recipes/8.jpg'),
    calories: 225, proteinGrams: 15, time: '12 dk',
    ingredients: '2 yumurta, 60 g ıspanak, 5 çeri domates, 1 çay kaşığı zeytinyağı, roka',
    steps: ['Ispanağı yağda sotele ve çırpılmış yumurtayı tavaya dök.', 'Yumurta pişince omleti katla ve domates ile roka eşliğinde servis et.'],
  },
  {
    id: 'brokolili-somon', name: 'Fırında somon ve brokoli', photo: require('@/assets/images/recipes/9.jpg'),
    calories: 390, proteinGrams: 31, time: '25 dk',
    ingredients: '130 g somon, 180 g brokoli, 1 çay kaşığı zeytinyağı, limon',
    steps: ['Brokoli ve somonu fırın tepsisine al, zeytinyağını gezdir.', '200 °C fırında somon pişip brokoli yumuşayana kadar pişir. Limonla servis et.'],
  },
  {
    id: 'humuslu-durum', name: 'Humuslu sebze dürümü', photo: require('@/assets/images/recipes/10.jpg'),
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
];
