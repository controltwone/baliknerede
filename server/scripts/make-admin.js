const mongoose = require('mongoose')
require('dotenv').config()

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  bio: { type: String, maxlength: 500 },
  avatarUrl: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

async function makeAdmin() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/baliknerede')
    console.log('MongoDB bağlandı')

    // Tüm kullanıcıları listele
    const users = await User.find({}, 'name email isAdmin').sort({ createdAt: -1 })
    
    console.log('\n📋 Mevcut Kullanıcılar:')
    console.log('='.repeat(50))
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Admin: ${user.isAdmin ? '✅' : '❌'}`)
    })

    // Önce tüm adminleri kaldır
    await User.updateMany({ isAdmin: true }, { isAdmin: false })
    console.log('\n🔄 Tüm admin yetkileri kaldırıldı!')
    
    // Belirli kullanıcıyı admin yap
    const targetEmail = 'oogncr@gmail.com'
    const targetUser = users.find(user => user.email === targetEmail)
    
    if (targetUser) {
      await User.findByIdAndUpdate(targetUser._id, { isAdmin: true })
      console.log(`\n✅ ${targetUser.name} (${targetUser.email}) admin yapıldı!`)
      console.log('🎉 Artık /admin sayfasına erişebilirsiniz!')
    } else {
      console.log(`\n❌ ${targetEmail} email adresli kullanıcı bulunamadı!`)
    }

  } catch (error) {
    console.error('❌ Hata:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n📡 MongoDB bağlantısı kapatıldı')
  }
}

// Script'i çalıştır
makeAdmin()
