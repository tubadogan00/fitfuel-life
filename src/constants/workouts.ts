import type { ExerciseMotion } from '@/constants/exercise-motions';

type Workout = {
  id: string;
  title: string;
  detail: string;
  steps: { text: string; motion?: ExerciseMotion }[];
};

export const locations = [
  { id: 'home', label: 'Ev' },
  { id: 'gym', label: 'Spor salonu' },
] as const;

export const workouts: Record<(typeof locations)[number]['id'], Workout[]> = {
  home: [
    {
      id: 'strength', title: 'Evde tüm vücut', detail: 'Başlangıç · Ekipmansız · Yaklaşık 20 dk',
      steps: [
        { text: '5 dk rahat tempoda yürü.', motion: 'walk' },
        { text: 'Sandalyeye otur-kalk · 2 set × 8 tekrar', motion: 'chair' },
        { text: 'Duvar şınavı · 2 set × 8 tekrar', motion: 'wallPush' },
        { text: 'Kalça köprüsü · 2 set × 10 tekrar', motion: 'bridge' },
        { text: 'Setler arasında 60–90 saniye dinlen.' },
      ],
    },
    {
      id: 'cardio', title: 'Kardiyo · Tempolu yürüyüş', detail: 'Başlangıç · Kardiyo · 25 dk',
      steps: [
        { text: '5 dk rahat tempoda başla.', motion: 'walk' },
        { text: '15 dk konuşabileceğin bir tempoda yürü.', motion: 'walk' },
        { text: 'Son 5 dk tempoyu düşür.', motion: 'walk' },
      ],
    },
    {
      id: 'home-chest',
      title: 'Göğüs günü',
      detail: 'Başlangıç · Duvar ve sabit tezgâh · Yaklaşık 15 dk',
      steps: [
        { text: 'Omuzlarını ve kollarını 3 dk hafifçe hareket ettir.', motion: 'shoulder' },
        { text: 'Duvar şınavı · 2 set × 10 tekrar', motion: 'wallPush' },
        { text: 'Sabit tezgâhta eğimli şınav · 2 set × 8 tekrar', motion: 'incline' },
        { text: 'Avuç içlerini göğüs hizasında birbirine bastır · 2 set × 20 saniye', motion: 'palm' },
      ],
    },
    {
      id: 'home-legs',
      title: 'Bacak günü',
      detail: 'Başlangıç · Sandalye · Yaklaşık 20 dk',
      steps: [
        { text: '3–5 dk rahat tempoda yürü.', motion: 'walk' },
        { text: 'Sandalyeye otur-kalk · 2 set × 10 tekrar', motion: 'chair' },
        { text: 'Destek alarak geriye adım çömelme · 2 set × 8 tekrar / bacak', motion: 'lunge' },
        { text: 'Ayakta topuk kaldırma · 2 set × 12 tekrar', motion: 'calf' },
      ],
    },
    {
      id: 'home-glutes',
      title: 'Kalça günü',
      detail: 'Başlangıç · Ekipmansız · Yaklaşık 20 dk',
      steps: [
        { text: 'Kalça köprüsü · 2 set × 12 tekrar', motion: 'bridge' },
        { text: 'Yan yatışta üst bacağı kaldırma · 2 set × 10 tekrar / taraf', motion: 'sideRaise' },
        { text: 'Dört ayak pozisyonunda geriye bacak uzatma · 2 set × 10 tekrar / taraf', motion: 'kick' },
      ],
    },
    {
      id: 'home-back',
      title: 'Sırt günü',
      detail: 'Başlangıç · Hafif sırt çantası · Yaklaşık 20 dk',
      steps: [
        { text: 'Omuzlarını 3 dk hafifçe hareket ettir.', motion: 'shoulder' },
        { text: 'Bir elinle sabit bir yüzeyden destek alarak çantayı çek · 2 set × 10 tekrar / kol', motion: 'bagRow' },
        { text: 'Yüzüstü W pozisyonunda kürek kemiklerini yaklaştır · 2 set × 8 tekrar', motion: 'proneW' },
        { text: 'Dört ayak pozisyonunda karşı kol ve bacağı uzat (bird-dog) · 2 set × 8 tekrar / taraf', motion: 'bird' },
      ],
    },
    {
      id: 'home-core',
      title: 'Karın günü',
      detail: 'Başlangıç · Ekipmansız · Yaklaşık 15 dk',
      steps: [
        { text: 'Sırtüstü karşı kol ve bacak uzatma (dead bug) · 2 set × 8 tekrar / taraf', motion: 'deadBug' },
        { text: 'Dizler yerde ön plank · 2 set × 20 saniye', motion: 'kneePlank' },
        { text: 'Dizler bükülü yan plank · 2 set × 15 saniye / taraf', motion: 'sidePlank' },
      ],
    },
    {
      id: 'mobility', title: 'Hareketlilik', detail: 'Başlangıç · Ekipmansız · Yaklaşık 10 dk',
      steps: [
        { text: 'Omuz çevirme · Her yönde 8 tekrar', motion: 'shoulder' },
        { text: 'Kedi-deve hareketi · 8 kontrollü tekrar', motion: 'catCow' },
        { text: 'Ayak bileği çevirme · Her ayakta ve yönde 8 tekrar', motion: 'ankle' },
        { text: 'Hareketleri rahat aralıkta, acele etmeden yap.' },
      ],
    },
  ],
  gym: [
    {
      id: 'gym-strength',
      title: 'Salonda tüm vücut',
      detail: 'Başlangıç · Makineler · Yaklaşık 30 dk',
      steps: [
        { text: '5 dk yürüyüş bandında rahat tempoda ısın.', motion: 'treadmill' },
        { text: 'Bacak presi (leg press) · 2 set × 10 tekrar', motion: 'legPress' },
        { text: 'Göğüs presi (chest press) · 2 set × 10 tekrar', motion: 'chestPress' },
        { text: 'Oturarak çekiş (seated row) · 2 set × 10 tekrar', motion: 'row' },
        { text: 'Hafif ağırlıkla başla ve setler arasında 60–90 saniye dinlen.' },
      ],
    },
    {
      id: 'gym-cardio',
      title: 'Kardiyo · Sabit bisiklet',
      detail: 'Başlangıç · Kardiyo · 25 dk',
      steps: [
        { text: '5 dk düşük dirençte ısın.', motion: 'bike' },
        { text: '15 dk konuşabildiğin bir tempoda pedal çevir.', motion: 'bike' },
        { text: 'Son 5 dk direnci ve tempoyu azalt.', motion: 'bike' },
      ],
    },
    {
      id: 'gym-chest',
      title: 'Göğüs günü',
      detail: 'Başlangıç · Makineler · Yaklaşık 25 dk',
      steps: [
        { text: '5 dk hafif tempoda ısın.', motion: 'treadmill' },
        { text: 'Göğüs presi (chest press) · 2 set × 10 tekrar', motion: 'chestPress' },
        { text: 'Kelebek makinesi (pec deck) · 2 set × 10 tekrar', motion: 'pectoral' },
      ],
    },
    {
      id: 'gym-legs',
      title: 'Bacak günü',
      detail: 'Başlangıç · Makineler · Yaklaşık 25 dk',
      steps: [
        { text: '5 dk yürüyüş bandında ısın.', motion: 'treadmill' },
        { text: 'Bacak presi (leg press) · 2 set × 10 tekrar', motion: 'legPress' },
        { text: 'Oturarak bacak bükme (leg curl) · 2 set × 10 tekrar', motion: 'curl' },
        { text: 'Baldır makinesi (calf raise) · 2 set × 12 tekrar', motion: 'machineCalf' },
      ],
    },
    {
      id: 'gym-glutes',
      title: 'Kalça günü',
      detail: 'Başlangıç · Makine ve kablo · Yaklaşık 25 dk',
      steps: [
        { text: '5 dk rahat tempoda ısın.', motion: 'treadmill' },
        { text: 'Kalça itişi (hip thrust) makinesi · 2 set × 10 tekrar', motion: 'hipThrust' },
        { text: 'Kalça açış makinesi (hip abduction) · 2 set × 12 tekrar', motion: 'abduction' },
        { text: 'Kabloyla geriye bacak itişi · 2 set × 10 tekrar / bacak', motion: 'cableKick' },
      ],
    },
    {
      id: 'gym-back',
      title: 'Sırt günü',
      detail: 'Başlangıç · Makine ve kablo · Yaklaşık 25 dk',
      steps: [
        { text: '5 dk hafif tempoda ısın.', motion: 'treadmill' },
        { text: 'Üstten çekiş (lat pulldown) · 2 set × 10 tekrar', motion: 'lat' },
        { text: 'Oturarak çekiş (seated row) · 2 set × 10 tekrar', motion: 'row' },
        { text: 'Ters kelebek makinesi (reverse fly) · 2 set × 10 tekrar', motion: 'reverseFly' },
      ],
    },
    {
      id: 'gym-core',
      title: 'Karın günü',
      detail: 'Başlangıç · Kablo ve mat · Yaklaşık 20 dk',
      steps: [
        { text: 'Kabloyu göğüs hizasında ileri iterek gövdeyi sabit tut (Pallof press) · 2 set × 8 tekrar / taraf', motion: 'pallof' },
        { text: 'Dirsekler üzerinde plank · 2 set × 20 saniye', motion: 'plank' },
        { text: 'Sırtüstü karşı kol ve bacak uzatma (dead bug) · 2 set × 8 tekrar / taraf', motion: 'deadBug' },
      ],
    },
  ],
};
