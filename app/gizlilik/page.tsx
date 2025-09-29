export default function GizlilikPage() {
  return (
    <div className="min-h-svh bg-background dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Gizlilik Politikası</h1>
        <p className="text-sm text-muted-foreground mb-6">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        <div className="prose dark:prose-invert">
          <p>
            Bu Gizlilik Politikası, baliknerede platformunda ziyaretçi ve kullanıcılarımızın
            kişisel verilerinin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili
            mevzuata uygun olarak nasıl toplandığını, işlendiğini, saklandığını, paylaşıldığını ve
            korunduğunu ayrıntılı biçimde açıklar. Buradaki bilgiler; iş ve
            teknoloji süreçlerimiz güncellendikçe metnin de güncellenmesi gerekebilir.
          </p>
          <p>
            Veri sorumlusu sıfatıyla; hesabın oluşturulması, hizmetin sunulması, güvenliğin
            sağlanması, kötüye kullanımın önlenmesi, performansın ölçülmesi ve kullanıcı deneyiminin
            iyileştirilmesi amaçlarıyla asgari düzeyde veri işleriz. Yasal yükümlülüklerimiz ve
            meşru menfaatlerimiz ile sözleşmenin ifası kapsamındaki işlemler zorunlu temellere
            dayanır; pazarlama/analitik gibi zorunlu olmayan hususlar ise açık rızanıza tabidir.
          </p>
          <h2>Toplanan Veriler</h2>
          <ul>
            <li>Hesap bilgileri (ad, e‑posta vb.)</li>
            <li>Oturum/cihaz bilgileri ve IP</li>
            <li>İçerik paylaşımları ve etkileşimler</li>
          </ul>
          <p>
            Bunun yanında hata kayıtları, cihaz/ tarayıcı bilgileri, çerez ve benzeri teknolojilerle
            kullanım istatistikleri toplanabilir. Zorunlu olmayan çerezler için tercihleriniz her
            zaman sayfanın altındaki çerez yöneticisinden güncellenebilir.
          </p>
          <h2>Verilerin Kullanım Amaçları</h2>
          <ul>
            <li>Hizmetin sunulması ve güvenliği</li>
            <li>Hesap yönetimi ve bildirimler</li>
            <li>İyileştirme ve analitik</li>
          </ul>
          <p>
            Yasal uyuşmazlıkların çözümü ve yetkili mercilerin taleplerinin karşılanması da veri
            işleme amaçları arasındadır. Pazarlama iletileri yalnızca onay vermiş olmanız halinde
            gönderilir ve dilediğiniz anda ileti tercihlerinizi değiştirebilirsiniz.
          </p>
          <h2>Üçüncü Taraflar</h2>
          <p>
            Barındırma, dosya depolama, içerik dağıtımı (CDN), kimlik doğrulama ve analitik
            sağlayıcılarıyla sözleşmesel ve teknik güvenlik tedbirleri eşliğinde veri işleme
            ilişkisi kurulabilir. Bu kuruluşlar, talimatlarımız doğrultusunda ve amaçla sınırlı
            şekilde veri işler.
          </p>
          <h2>Saklama Süreleri</h2>
          <p>
            Veriler, ilgili mevzuatta öngörülen süreler ve işleme amaçları için gerekli olan azami
            süre boyunca saklanır; süre dolduğunda silinir, anonimleştirilir veya imha edilir.
          </p>
          <h2>Güvenlik Tedbirleri</h2>
          <p>
            Erişim kontrolleri, şifreleme, ağ güvenliği, günlükleme ve ayrık ortamlar gibi idari ve
            teknik tedbirler uygulanır. %100 güvenlik garanti edilememekle birlikte en iyi uygulama
            prensipleri izlenir.
          </p>
          <h2>İletişim</h2>
          <p>
            KVKK kapsamındaki başvuru ve talepleriniz için: kvkk@baliknerede.com. Genel gizlilik
            soruları için: support@baliknerede.com
          </p>
          <h2>Değişiklikler</h2>
          <p>
            Politikada değişiklik olması halinde güncelleme tarihi yukarıda değiştirilir; önemli
            değişiklikler makul yöntemlerle ayrıca bildirilebilir.
          </p>
        </div>
      </div>
    </div>
  )
}


