export default function CerezlerPage() {
  return (
    <div className="min-h-svh bg-background dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Çerez Politikası</h1>
        <p className="text-sm text-muted-foreground mb-6">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        <div className="prose dark:prose-invert">
          <p>
            Bu politika, baliknerede üzerinde kullanılan çerezleri ve benzeri teknolojileri, bunların
            hangi amaçlarla kullanıldığını ve tercihlerinizi nasıl yönetebileceğinizi açıklar.
          </p>
          <h2>Çerez Nedir?</h2>
          <p>
            Çerezler; bir web sitesini ziyaret ettiğinizde cihazınıza (bilgisayar, telefon, tablet)
            yerleştirilen küçük metin dosyalarıdır. Oturumunuzu sürdürmek, tercihlerinizi hatırlamak
            ve site performansını ölçmek gibi amaçlarla kullanılır.
          </p>
          <h2>Kullanılan Çerez Türleri</h2>
          <ul>
            <li>
              <strong>Zorunlu çerezler</strong>: Oturum açma, güvenlik, dolandırıcılığın önlenmesi gibi
              temel işlevler için gereklidir. Devre dışı bırakılamaz.
            </li>
            <li>
              <strong>Tercih çerezleri</strong>: Tema (açık/koyu), dil ve arayüz ayarlarınızı
              hatırlamamıza yardımcı olur.
            </li>
            <li>
              <strong>Analitik/performans çerezleri</strong>: Hangi sayfaların ziyaret edildiği, site
              içi etkileşimler ve hatalar gibi verileri anonim/anonimleştirilmiş olarak ölçmemizi
              sağlar. Bu çerezler hizmeti iyileştirmeye yöneliktir.
            </li>
          </ul>
          <h2>Birinci ve Üçüncü Taraf Çerezler</h2>
          <p>
            Birinci taraf çerezler, ziyaret ettiğiniz alan adı tarafından yerleştirilir. Üçüncü taraf
            çerezler, analitik veya kimlik doğrulama gibi hizmetleri sağlayan iş ortaklarımız
            tarafından yerleştirilebilir. Bu taraflarla veri işleyen sözleşmeleri yaparak güvenlik ve
            gizlilik tedbirlerini uygularız.
          </p>
          <h2>Saklama Süreleri</h2>
          <p>
            Oturum çerezleri tarayıcı kapatılınca silinir. Kalıcı çerezler; amaçla sınırlı ve uygun
            sürelerle cihazınızda tutulur; süre dolunca tarayıcı tarafından silinir veya tarafımızca
            yenilenir.
          </p>
          <h2>Tercihlerin Yönetimi</h2>
          <p>
            Zorunlu olmayan çerezler için onay/ret tercihlerinizi sitemizde sunulan çerez
            yöneticisinden değiştirebilirsiniz. Ayrıca tarayıcı ayarlarından çerezleri engelleyebilir
            veya silebilirsiniz. Genel adımlar:
          </p>
          <ul>
            <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler ve diğer site verileri</li>
            <li>Firefox: Seçenekler → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
            <li>Safari: Tercihler → Gizlilik → Çerezleri engelle</li>
            <li>Edge: Ayarlar → Çerezler ve site izinleri</li>
          </ul>
          <p>
            Mobil tarayıcılarda adımlar farklılık gösterebilir. Çerezleri tamamen devre dışı
            bırakmanız bazı özelliklerin çalışmamasına neden olabilir.
          </p>
          <h2>“Do Not Track” (İzlemeyi Engelle) Sinyalleri</h2>
          <p>
            Tarayıcınızın DNT sinyallerini alabiliriz; ancak yaygın bir standart bulunmadığından tüm
            servislerde bu sinyallere uyum garanti edilmemektedir.
          </p>
          <h2>Güncellemeler ve İletişim</h2>
          <p>
            Bu politika zaman zaman güncellenebilir. Önemli değişiklikleri makul yöntemlerle
            duyururuz. Sorularınız için: cerez@baliknerede.com
          </p>
        </div>
      </div>
    </div>
  )
}


