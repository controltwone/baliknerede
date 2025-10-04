/**
 * Foto boyutlandırma ve kalite optimizasyonu için utility fonksiyonları
 */

// HEIC dönüştürme için dynamic import
let heic2any: any = null

// HEIC kütüphanesini lazy load et
async function loadHeic2Any() {
  if (!heic2any) {
    heic2any = await import('heic2any')
  }
  return heic2any
}

export interface ImageResizeOptions {
  maxWidth: number
  maxHeight: number
  quality: number
  format?: 'jpeg' | 'png' | 'webp'
}

/**
 * HEIC/HEIF dosyasını JPEG'e dönüştürür
 * @param file - HEIC/HEIF dosyası
 * @returns JPEG dosyası
 */
async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    console.log(`HEIC dönüştürme başlıyor: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    const startTime = Date.now()
    
    const heic2anyLib = await loadHeic2Any()
    const convertedBlob = await heic2anyLib.default({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8, // Kaliteyi düşürdük (0.9 → 0.8) hız için
      multiple: false // Tek dosya dönüştür
    })
    
    const endTime = Date.now()
    console.log(`HEIC dönüştürme tamamlandı: ${(endTime - startTime) / 1000}s`)
    
    return new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: Date.now()
    })
  } catch (error) {
    console.error('HEIC dönüştürme hatası:', error)
    throw new Error('HEIC dosyası dönüştürülemedi. Lütfen JPEG formatında fotoğraf seçin.')
  }
}

/**
 * Foto boyutunu ve kalitesini optimize eder
 * @param file - Orijinal foto dosyası
 * @param options - Boyutlandırma seçenekleri
 * @returns Optimize edilmiş foto dosyası
 */
export async function resizeImage(
  file: File, 
  options: ImageResizeOptions = {
    maxWidth: 800, // Daha küçük boyut (1200 → 800) hız için
    maxHeight: 800,
    quality: 0.8, // Daha düşük kalite (0.85 → 0.8) hız için
    format: 'jpeg'
  }
): Promise<File> {
  // Dosya boyutu kontrolü (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error('Dosya boyutu çok büyük. Lütfen 10MB\'dan küçük bir fotoğraf seçin.')
  }

  // HEIC/HEIF dosyasını önce JPEG'e dönüştür
  let processedFile = file
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    console.log('HEIC/HEIF dosyası JPEG\'e dönüştürülüyor...')
    processedFile = await convertHeicToJpeg(file)
  }
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Orijinal boyutları al
      const { width: originalWidth, height: originalHeight } = img
      
      // Yeni boyutları hesapla (aspect ratio korunarak)
      let { width: newWidth, height: newHeight } = calculateNewDimensions(
        originalWidth, 
        originalHeight, 
        options.maxWidth, 
        options.maxHeight
      )

      // Canvas boyutunu ayarla
      canvas.width = newWidth
      canvas.height = newHeight

      // Foto çiz
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)

      // Canvas'ı blob'a çevir
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Foto işlenemedi'))
            return
          }

          // Yeni dosya oluştur
          const resizedFile = new File(
            [blob], 
            processedFile.name, 
            { 
              type: `image/${options.format}`,
              lastModified: Date.now()
            }
          )

          console.log(`Foto optimize edildi: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`)
          console.log(`Dosya boyutu: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB → ${(resizedFile.size / 1024 / 1024).toFixed(2)}MB`)
          
          resolve(resizedFile)
        },
        `image/${options.format}`,
        options.quality
      )
    }

    img.onerror = () => reject(new Error('Foto yüklenemedi'))
    img.src = URL.createObjectURL(processedFile)
  })
}

/**
 * Yeni boyutları aspect ratio korunarak hesaplar
 */
function calculateNewDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  // Eğer foto zaten küçükse, orijinal boyutları kullan
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight }
  }

  // Aspect ratio'yu hesapla
  const aspectRatio = originalWidth / originalHeight

  let newWidth = maxWidth
  let newHeight = maxWidth / aspectRatio

  // Eğer yükseklik maksimumu aşıyorsa, yüksekliği baz al
  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = maxHeight * aspectRatio
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  }
}

/**
 * Foto dosyasının boyutunu kontrol eder
 * @param file - Kontrol edilecek dosya
 * @param maxSizeMB - Maksimum dosya boyutu (MB)
 * @returns Dosya boyutu uygunsa true
 */
export function validateImageSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Desteklenen foto formatlarını kontrol eder
 * @param file - Kontrol edilecek dosya
 * @returns Desteklenen format ise true
 */
export function validateImageFormat(file: File): boolean {
  const supportedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp',
    'image/heic',  // iPhone HEIC formatı
    'image/heif'   // iPhone HEIF formatı
  ]
  return supportedTypes.includes(file.type)
}
