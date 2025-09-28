"use client"

import React, { useState } from "react"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { Button } from "./button"
import { X, Flag, AlertTriangle } from "lucide-react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onReport: (reason: string) => void
  isLoading?: boolean
}

const reportReasons = [
  { id: "spam", label: "Spam veya gereksiz içerik" },
  { id: "inappropriate", label: "Uygunsuz içerik" },
  { id: "harassment", label: "Taciz veya zorbalık" },
  { id: "violence", label: "Şiddet içeren içerik" },
  { id: "fake", label: "Sahte bilgi" },
  { id: "other", label: "Diğer" }
]

export function ReportModal({
  isOpen,
  onClose,
  onReport,
  isLoading = false
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  const handleSubmit = () => {
    const reason = selectedReason === "other" ? customReason : reportReasons.find(r => r.id === selectedReason)?.label || ""
    if (reason.trim()) {
      onReport(reason)
    }
  }

  const handleClose = () => {
    setSelectedReason("")
    setCustomReason("")
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Flag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Gönderiyi Şikayet Et
                    </h3>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Bu gönderiyi neden şikayet etmek istiyorsunuz?
                  </p>
                  
                  <div className="space-y-2">
                    {reportReasons.map((reason) => (
                      <label
                        key={reason.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {reason.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {selectedReason === "other" && (
                    <div className="mt-4">
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Lütfen şikayet sebebinizi detaylı olarak açıklayın..."
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2"
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || (!selectedReason || (selectedReason === "other" && !customReason.trim()))}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gönderiliyor...
                      </div>
                    ) : (
                      "Şikayet Et"
                    )}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
