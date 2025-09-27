export type Article = {
  id: string
  title: string
  summary: string
  tags: string[]
  body: string
}

// Seed list for index page (still used to render list quickly). In MDX mode you may replace this with file-system read.
export const articles: Article[] = [
  {
    id: "istanbul-balik-rehberi",
    title: "İstanbul'da Nerede Ne Tutulur? Kapsamlı Rehber",
    summary:
      "İstanbul'un en verimli balık avı noktaları, mevsimsel değişimler ve hangi balığın nerede bulunduğu hakkında detaylı bilgiler.",
    tags: ["İstanbul", "Av Noktaları", "Rehber"],
    body:
      "İstanbul, dünyanın en zengin balık çeşitliliğine sahip şehirlerinden biri. Boğaz'ın akıntıları, Marmara'nın derinlikleri ve Karadeniz'in soğuk suları bir araya gelerek eşsiz bir ekosistem oluşturuyor.\n\n**En Verimli Noktalar:**\n- **Galata Köprüsü**: Lüfer, istavrit, mezgit\n- **Sarayburnu**: Levrek, çipura, kefal\n- **Karaköy**: Hamsi, sardalya, palamut\n- **Kadıköy Rıhtım**: İstavrit, mezgit, kefal\n- **Anadolu Kavağı**: Palamut, lüfer, torik\n\n**Mevsimsel Değişimler:**\n- **İlkbahar**: Hamsi, sardalya, istavrit\n- **Yaz**: Levrek, çipura, kefal\n- **Sonbahar**: Lüfer, palamut, torik\n- **Kış**: Mezgit, kefal, istavrit",
  },
  {
    id: "mevsimsel-balik-rehberi",
    title: "Mevsimsel Balık Rehberi: Hangi Balık Ne Zaman?",
    summary:
      "Türkiye kıyılarında hangi balığın hangi mevsimde en verimli olduğu, göç yolları ve avlanma teknikleri.",
    tags: ["Mevsim", "Balık Türleri", "Göç"],
    body:
      "Balıkların yaşam döngüsü mevsimsel değişimlere bağlıdır. Doğru zamanı bilmek avcılık başarınızı önemli ölçüde artırır.\n\n**İlkbahar (Mart-Mayıs):**\n- **Hamsi**: Karadeniz'den Marmara'ya göç\n- **Sardalya**: Kıyı sularında üreme\n- **İstavrit**: Sığ sularda beslenme\n\n**Yaz (Haziran-Ağustos):**\n- **Levrek**: Sığ sularda aktif\n- **Çipura**: Kayalık bölgelerde\n- **Kefal**: Kıyı sularında\n\n**Sonbahar (Eylül-Kasım):**\n- **Lüfer**: Boğaz'dan geçiş\n- **Palamut**: Güneye göç\n- **Torik**: Büyük sürüler\n\n**Kış (Aralık-Şubat):**\n- **Mezgit**: Derin sularda\n- **Kefal**: Kıyı sularında\n- **İstavrit**: Sığ sularda",
  },
  {
    id: "lufer-av-teknikleri",
    title: "Lüfer Avı: Boğaz'ın Efsanesi",
    summary:
      "Lüfer avında akıntı okuma, doğru takım seçimi ve en verimli saatler hakkında uzman tavsiyeleri.",
    tags: ["Lüfer", "Boğaz", "Spin"],
    body:
      "Lüfer, İstanbul Boğazı'nın en değerli balıklarından biridir. Sonbahar aylarında Karadeniz'den Marmara'ya göç ederken en verimli avlanma fırsatı sunar.\n\n**En Verimli Dönem:**\n- **Eylül-Kasım**: Ana göç dönemi\n- **Ekim**: En yoğun geçiş\n- **Gün doğumu ve batımı**: En aktif saatler\n\n**Av Teknikleri:**\n- **Spin Avı**: Rapala, popper, zoka\n- **Doğal Yem**: Taze istavrit, zargana\n- **Takım**: 2.40-3.00m kamış, 0.16-0.20 misina\n\n**Kritik Noktalar:**\n- Akıntıyı okumak çok önemli\n- Sessiz yaklaşım şart\n- Rüzgârı arkaya alın\n- Atış açısını akıntıya göre ayarlayın",
  },
  {
    id: "levrek-av-rehberi",
    title: "Levrek Avı: Sığ Sularda Büyük Avlar",
    summary:
      "Levrek avında habitat seçimi, silikon yem teknikleri ve en verimli saatler hakkında detaylı rehber.",
    tags: ["Levrek", "Silikon Yem", "Sığ Su"],
    body:
      "Levrek, kıyı sularının en popüler av balıklarından biridir. Doğru teknik ve ekipmanla büyük başarılar elde edebilirsiniz.\n\n**Habitat Tercihleri:**\n- **Kayalık bölgeler**: Doğal barınak\n- **Yosunluk alanlar**: Beslenme alanı\n- **Oksijenli sular**: Yaşam alanı\n- **Sığ sularda**: 1-5 metre derinlik\n\n**Av Teknikleri:**\n- **Silikon Yemler**: Shad, slug, worm\n- **Yavaş Aksiyon**: Doğal hareket\n- **Ritmik Çekim**: Düzenli tempo\n- **Dip Teması**: Yem kontrolü\n\n**Renk Seçimi:**\n- **Gündüz**: Doğal tonlar (yeşil, kahverengi)\n- **Gece**: Koyu renkler (siyah, mor)\n- **Bulutlu hava**: Parlak renkler\n- **Açık hava**: Mat renkler",
  },
  {
    id: "cipura-dip-avciligi",
    title: "Çipura Dip Avcılığı: Sabır ve Teknik",
    summary:
      "Çipura avında dip takımları, fluorocarbon köstek kullanımı ve taze yem seçimi hakkında uzman tavsiyeleri.",
    tags: ["Çipura", "Dip Avı", "Fluorocarbon"],
    body:
      "Çipura, Akdeniz ve Ege'nin en lezzetli balıklarından biridir. Avı sabır ve teknik gerektirir.\n\n**Ekipman Seçimi:**\n- **Kamış**: Hassas uçlu, 3-4 metre\n- **Makine**: 2500-4000 arası\n- **Misina**: 0.25-0.30 ana, 0.18-0.22 fluorocarbon köstek\n- **İğne**: Küçük (no: 6-10), keskin\n\n**Yem Seçimi:**\n- **Midye**: Kabuklu veya ayıklanmış\n- **Karides**: Canlı veya taze\n- **Boru Kurdu**: Kumlu diplerde etkili\n- **Sülünes**: Nadir ama çok etkili\n\n**Av Teknikleri:**\n- **Dip Takımı**: 2-3 köstekli\n- **At-Çek**: Yavaş çekim\n- **Sabır**: Uzun bekleme\n- **Temiz Dip**: Kayalık alanlar\n\n**En Verimli Zamanlar:**\n- Sabahın erken saatleri\n- Akşamüstü\n- Sakin havalar\n- Düşük akıntı",
  },
  {
    id: "mezgit-kis-avciligi",
    title: "Kışın Mezgit Avcılığı: Soğuk Sularda Sıcak Avlar",
    summary:
      "Kış aylarında mezgit avında derinlik seçimi, çapari teknikleri ve en verimli saatler hakkında rehber.",
    tags: ["Mezgit", "Kış", "Çapari"],
    body:
      "Mezgit, kış aylarının en popüler balıklarından biridir. Soğuk sularda daha derinlere çekilir ve özel teknikler gerektirir.\n\n**Kış Davranışları:**\n- **Derinlik**: 15-30 metre bandı\n- **Sıcaklık**: 8-12°C arası\n- **Beslenme**: Daha az aktif\n- **Göç**: Kıyıdan uzaklaşma\n\n**Ekipman:**\n- **Kamış**: İnce uçlu, hassas\n- **Makine**: 4000-6000 arası\n- **Misina**: 0.25-0.30\n- **Çapari**: Fosforlu, küçük iğneli\n\n**Yem Seçimi:**\n- **Karides**: Taze, büyük\n- **Tavuk Göğsü**: Şerit halinde\n- **Sülünes**: Canlı\n- **Midye**: Ayıklanmış\n\n**Av Teknikleri:**\n- **Dip Dokunuşu**: Hassas takip\n- **Yavaş Çekim**: Doğal hareket\n- **Sabır**: Uzun bekleme\n- **Sessizlik**: Gürültü yapmama\n\n**En Verimli Zamanlar:**\n- Akşam-gece saatleri\n- Düşük akıntı\n- Sakin hava\n- Yeni ay dönemleri",
  },
  {
    id: "hamsi-av-teknikleri",
    title: "Hamsi Avı: Karadeniz'in İncisi",
    summary:
      "Hamsi avında sürü takibi, doğru ağ seçimi ve en verimli dönemler hakkında detaylı bilgiler.",
    tags: ["Hamsi", "Sürü", "Ağ"],
    body:
      "Hamsi, Karadeniz'in en değerli balıklarından biridir. Sürü halinde yaşar ve özel av teknikleri gerektirir.\n\n**Yaşam Döngüsü:**\n- **İlkbahar**: Karadeniz'den Marmara'ya göç\n- **Yaz**: Marmara'da beslenme\n- **Sonbahar**: Güneye göç\n- **Kış**: Derin sularda\n\n**Av Teknikleri:**\n- **Gırgır Ağı**: Büyük sürüler için\n- **Uzatma Ağı**: Kıyı avcılığı\n- **Işıklı Av**: Gece avcılığı\n- **Sürü Takibi**: Sonar kullanımı\n\n**En Verimli Dönemler:**\n- **Mart-Mayıs**: Göç dönemi\n- **Eylül-Kasım**: Güneye göç\n- **Gece saatleri**: Işıklı av\n- **Ay ışığı**: Sürü hareketi\n\n**Kritik Faktörler:**\n- Su sıcaklığı (8-15°C)\n- Akıntı yönü\n- Rüzgâr durumu\n- Ay fazı",
  },
  {
    id: "palamut-av-rehberi",
    title: "Palamut Avı: Güneye Göçün Efendisi",
    summary:
      "Palamut avında göç yolları, doğru takım seçimi ve en verimli dönemler hakkında uzman tavsiyeleri.",
    tags: ["Palamut", "Göç", "Spin"],
    body:
      "Palamut, sonbahar aylarında Karadeniz'den Akdeniz'e göç eden büyük bir balıktır. Güçlü ve hızlıdır.\n\n**Göç Yolları:**\n- **Eylül**: Karadeniz'den çıkış\n- **Ekim**: Boğaz geçişi\n- **Kasım**: Marmara geçişi\n- **Aralık**: Akdeniz'e varış\n\n**Av Teknikleri:**\n- **Spin Avı**: Rapala, popper\n- **Doğal Yem**: Taze hamsi, sardalya\n- **Takım**: 3.00-3.60m kamış\n- **Misina**: 0.25-0.35\n\n**En Verimli Noktalar:**\n- **Boğaz girişi**: Ana geçiş yolu\n- **Marmara çıkışı**: Son fırsat\n- **Akıntılı bölgeler**: Beslenme alanı\n- **Derin sular**: Büyük sürüler\n\n**Kritik Faktörler:**\n- Akıntı hızı\n- Su sıcaklığı\n- Rüzgâr yönü\n- Ay fazı\n\n**En Verimli Zamanlar:**\n- Gün doğumu\n- Gün batımı\n- Gece saatleri\n- Düşük akıntı",
  }
]

export function getArticleById(id: string) {
  return articles.find((a) => a.id === id) || null
}


