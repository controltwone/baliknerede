export default function AydinlatmaMetniPage() {
  return (
    <div className="min-h-svh bg-background dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Kişisel Verilerin Korunması Hakkında Aydınlatma Metni</h1>
        <p className="text-sm text-muted-foreground mb-6">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        <div className="prose dark:prose-invert">
          <p>
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu
            sıfatıyla, kişisel verilerinizin hangi kapsamda işlendiğine ilişkin aydınlatma amacıyla
            hazırlanmıştır.
          </p>
          <h2>İşlenen Veri Kategorileri</h2>
          <ul>
            <li>Kimlik ve iletişim bilgileri</li>
            <li>Kullanım ve işlem güvenliği verileri</li>
            <li>İçerik ve etkileşim verileri</li>
          </ul>
          <h2>Hukuki Sebepler ve Amaçlar</h2>
          <p>
            Hizmetin ifası ve sözleşmenin kurulması/ifası, hukuki yükümlülüğe uyum, meşru menfaat
            ve gerekli hallerde açık rıza dayanakları kapsamında; hesabın yönetimi, içerik paylaşımı,
            güvenliğin sağlanması, istismar ve ihlal tespitleri, iyileştirme/analitik ve bildirim
            süreçleri amaçlarıyla veriler işlenebilir.
          </p>
          <h2>Aktarım / Alıcı Grupları</h2>
          <p>
            Barındırma, dosya depolama, içerik dağıtımı, kimlik doğrulama ve analitik sağlayıcıları
            gibi hizmet aldığımız taraflarla veri işleyen ilişkisi kurulabilir. Yetkili mercilerin
            talepleri kapsamında yasal aktarım yapılabilir.
          </p>
          <h2>Saklama Süreleri</h2>
          <p>
            İlgili mevzuat ve işleme amaçları için gerekli azami süre boyunca saklanır; süresi dolan
            veriler silinir, anonimleştirilir veya imha edilir.
          </p>
          <h2>Haklarınız (KVKK m.11)</h2>
          <ul>
            <li>İşlenip işlenmediğini öğrenme ve bilgi talebi</li>
            <li>Düzeltme/silme/işlemenin kısıtlanması talebi</li>
            <li>Veri taşınabilirliği ve işleme itirazı</li>
            <li>Zarar halinde tazmin talebi</li>
          </ul>
          <p>
            Haklarınıza ilişkin başvurularınız, başvurunun niteliğine göre en geç 30 gün içinde
            sonuçlandırılır.
          </p>
          <h2>İletişim</h2>
          <p>KVKK başvurularınız için e‑posta: kvkk@baliknerede.com</p>
          <p>Genel sorular için: support@baliknerede.com</p>
        </div>
      </div>
    </div>
  )
}


