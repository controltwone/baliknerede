"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, Users, FileText, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/time'
import { useRouter } from 'next/navigation'

interface Report {
  _id: string
  postId: {
    _id: string
    contentText?: string
    imageUrl?: string
    authorId: string
    createdAt: string
  }
  reporterId: {
    _id: string
    name: string
    email: string
  }
  reason: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

interface AdminStats {
  totalReports: number
  pendingReports: number
  totalPosts: number
  totalUsers: number
}

export default function AdminPage() {
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/')
      return
    }
    fetchReports()
    fetchStats()
  }, [isAuthenticated, user, router])

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const updateReportStatus = async (reportId: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`${API_BASE}/admin/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status, adminNotes })
      })
      if (res.ok) {
        await fetchReports()
        setSelectedReport(null)
        setAdminNotes('')
      }
    } catch (error) {
      console.error('Failed to update report:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) return
    
    try {
      const res = await fetch(`${API_BASE}/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      })
      if (res.ok) {
        await fetchReports()
        await fetchStats()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'dismissed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'reviewed': return 'İncelendi'
      case 'resolved': return 'Çözüldü'
      case 'dismissed': return 'Reddedildi'
      default: return status
    }
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Yetkisiz Erişim
            </CardTitle>
            <CardDescription>
              Bu sayfaya erişim için admin yetkisi gereklidir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              Ana Sayfaya Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Admin Paneli
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Şikayetleri yönetin ve site istatistiklerini görüntüleyin
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bekleyen Şikayetler</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Şikayet</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Gönderi</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Kullanıcı</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Şikayetler</CardTitle>
            <CardDescription>
              Kullanıcıların gönderiler hakkındaki şikayetleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : reports.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Henüz şikayet bulunmuyor.
              </p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report._id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusText(report.status)}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(report.createdAt)}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Şikayet Eden: {report.reporterId.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Sebep: {report.reason}
                          </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Şikayet Edilen Gönderi:
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {report.postId.contentText || 'Fotoğraf gönderisi'}
                          </p>
                          {report.postId.imageUrl && (
                            <div className="mt-2">
                              <img 
                                src={report.postId.imageUrl} 
                                alt="Reported post" 
                                className="w-20 h-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>

                        {report.adminNotes && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mb-3">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                              Admin Notu:
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                              {report.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReport(report)}
                          className="text-xs"
                        >
                          İncele
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePost(report.postId._id)}
                          className="text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Şikayet Detayı</CardTitle>
                <CardDescription>
                  Şikayet durumunu güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Admin Notu</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                    rows={3}
                    placeholder="Admin notu ekleyin..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateReportStatus(selectedReport._id, 'resolved')}
                    disabled={updating}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Çözüldü
                  </Button>
                  <Button
                    onClick={() => updateReportStatus(selectedReport._id, 'dismissed')}
                    disabled={updating}
                    variant="outline"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reddet
                  </Button>
                </div>
                
                <Button
                  onClick={() => setSelectedReport(null)}
                  variant="ghost"
                  className="w-full"
                >
                  Kapat
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
