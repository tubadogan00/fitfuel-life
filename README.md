# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Hesap ve oturum

Giriş ve kayıt işlemleri için Expo sunucusunu Node.js 24 ile çalıştır. Geliştirme hesapları sunucuda `.fitfuel/accounts.sqlite` dosyasına, öğün ve antrenman kayıtları ise ilgili hesap adına cihazda kaydedilir. Uygulamayı giriş eklenmeden önce kullandıysan bu cihazdaki eski günlük, ilk açılan hesaba aktarılır.

### Supabase ile cihazlar arası eşitleme

Supabase Session pooler bağlantısını `.env.local` dosyasında `DATABASE_URL` olarak sakla. Database Settings sayfasındaki SSL Configuration bölümünden indirilen CA sertifikasını `.fitfuel/supabase-ca.crt` olarak yerleştir. Sunucuya başka bir konumdan sertifika vermek için `FITFUEL_DB_CA_FILE` kullanabilirsin.

Bağlantı doğrulandıktan sonra `FITFUEL_CLOUD_ENABLED=true` ayarıyla Expo’yu yeniden başlat. İlk bulut bağlantısı mevcut SQLite hesaplarının kimliklerini, şifre özetlerini ve süresi dolmamış oturumlarını PostgreSQL’e kopyalar. Eski günlükler, ilgili hesapla kayıtların tutulduğu cihazda uygulama açıldığında eşitlenir. Diğer cihazlar aynı Expo API sunucusuna bağlanmalıdır. Geliştirme ağı dışında kullanım için API’yi HTTPS üzerinden barındır.

### Şifre sıfırlama e-postası

Resend’de bir gönderici alan adını doğrula ve gönderme yetkisi olan bir API anahtarı oluştur. Proje kökündeki `.env.local` dosyasına aşağıdaki değerleri ekle ve Expo sunucusunu yeniden başlat.

```dotenv
RESEND_API_KEY=your_resend_api_key
FITFUEL_RESET_FROM_EMAIL=no-reply@your-verified-domain.example
```

Resend’in test göndericisi kullanılıyorsa yalnızca Resend hesabının e-posta adresine gönderim yapılabilir. [Resend e-posta gönderim rehberi](https://resend.com/docs/api-reference/emails/send-email)

## Fotoğrafla öğün ekleme

Yerel geliştirme için proje kökünde `.env.local` oluştur ve Google AI Studio’dan aldığın API anahtarını bu dosyaya ekle.

```dotenv
GEMINI_API_KEY=your_gemini_api_key
```

Expo sunucusunu yeniden başlat. iPhone'da Expo Go ile denemek için `npx expo start --go`, tarayıcıda denemek için `npm run web` kullan. Kalori ekranında bir öğün fotoğrafı seçip **Fotoğrafı analiz et** düğmesine bas.

API anahtarını sunucu ortamında sakla. Yerel geliştirmede Expo Router, `/meal-photo` isteklerini çalışmakta olan Expo sunucusuna yönlendirir. Yayına alınan mobil sürüm için API rotasını sunan bir HTTPS sunucusu ve Expo Router `origin` ayarı gerekir. Herkese açık dağıtımda ücretli analiz rotasını uygulamanın kullanıcı kimlik doğrulamasıyla koru.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
