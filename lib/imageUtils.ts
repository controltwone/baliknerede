/**
 * Foto boyutlandırma ve kalite optimizasyonu için utility fonksiyonları
 */

export interface ImageResizeOptions {
  maxWidth: number
  maxHeight: number
  quality: number
  format?: 'jpeg' | 'png' | 'webp'
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
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85,
    format: 'jpeg'
  }
): Promise<File> {
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
            file.name, 
            { 
              type: `image/${options.format}`,
              lastModified: Date.now()
            }
          )

          console.log(`Foto optimize edildi: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`)
          console.log(`Dosya boyutu: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(resizedFile.size / 1024 / 1024).toFixed(2)}MB`)
          
          resolve(resizedFile)
        },
        `image/${options.format}`,
        options.quality
      )
    }

    img.onerror = () => reject(new Error('Foto yüklenemedi'))
    img.src = URL.createObjectURL(file)
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
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return supportedTypes.includes(file.type)
}
