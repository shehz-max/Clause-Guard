'use client'

import { useState, useCallback } from 'react'

export interface UploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  message: string
  documentId?: string
  error?: string
}

export function useUpload() {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  })

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    setUploadState({
      status: 'uploading',
      progress: 10,
      message: 'Uploading file...',
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()

      setUploadState({
        status: 'processing',
        progress: 50,
        message: 'Processing document...',
        documentId: data.documentId,
      })

      // Poll for processing status
      const documentId = data.documentId
      const finalStatus = await pollProcessingStatus(documentId)

      return finalStatus
    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return null
    }
  }, [])

  const pollProcessingStatus = async (documentId: string): Promise<string | null> => {
    const maxAttempts = 60 // 2 minutes max
    let attempts = 0

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000))

      try {
        const response = await fetch(`/api/contracts/${documentId}`)
        if (!response.ok) continue

        const data = await response.json()

        if (data.status === 'analyzed') {
          setUploadState({
            status: 'completed',
            progress: 100,
            message: 'Document processed successfully!',
            documentId,
          })
          return documentId
        }

        if (data.status === 'error') {
          throw new Error(data.error_message || 'Processing failed')
        }

        // Update progress based on status
        const progress = data.status === 'processing' ? 75 : 50
        setUploadState(prev => ({
          ...prev,
          progress,
          message: 'Analyzing document...',
        }))
      } catch (error) {
        // Continue polling
      }

      attempts++
    }

    throw new Error('Processing timeout')
  }

  const reset = useCallback(() => {
    setUploadState({
      status: 'idle',
      progress: 0,
      message: '',
    })
  }, [])

  return {
    uploadState,
    uploadFile,
    reset,
  }
}
