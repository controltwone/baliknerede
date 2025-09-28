const mongoose = require('mongoose')
require('dotenv').config()

// Post model
const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentText: { type: String },
  imageUrl: { type: String },
  locationCity: { type: String },
  locationSpot: { type: String },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)

async function resetViewCounts() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/baliknerede')
    console.log('MongoDB bağlandı')

    // Tüm postları listele
    const posts = await Post.find({}, 'contentText viewCount createdAt').sort({ createdAt: -1 })
    
    console.log('\n📋 Mevcut Postlar ve Görüntüleme Sayıları:')
    console.log('='.repeat(60))
    posts.forEach((post, index) => {
      const content = post.contentText ? post.contentText.substring(0, 30) + '...' : 'Fotoğraf gönderisi'
      console.log(`${index + 1}. ${content} - Görüntüleme: ${post.viewCount}`)
    })

    // Görüntüleme sayılarını sıfırla
    const result = await Post.updateMany({}, { viewCount: 0 })
    console.log(`\n🔄 ${result.modifiedCount} postun görüntüleme sayısı sıfırlandı!`)
    console.log('✅ Artık görüntüleme sayıları daha doğru olacak!')

  } catch (error) {
    console.error('❌ Hata:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n📡 MongoDB bağlantısı kapatıldı')
  }
}

// Script'i çalıştır
resetViewCounts()
