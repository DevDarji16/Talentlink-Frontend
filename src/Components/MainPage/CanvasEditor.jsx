import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import { apiClient } from '../../apiClient'
import "@excalidraw/excalidraw/index.css";


export default function CanvasEditor() {
  const { canvasId } = useParams()
  const navigate = useNavigate()
  const [canvasData, setCanvasData] = useState(null)
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

useEffect(() => {
  const fetchCanvas = async () => {
    try {
      const canvas = await apiClient(`http://localhost:8000/canvas/${canvasId}/`)
      console.log("Canvas from API:", canvas)

      setTitle(canvas.title)
      setCanvasData({
        elements: canvas.data?.elements || [],
        appState: {
          ...(canvas.data?.appState || {}),
          collaborators: [], // Ensure collaborators is always an array
          viewBackgroundColor: canvas.data?.appState?.viewBackgroundColor || '#ffffff'
        },
        files: canvas.data?.files || {},
        scrollToContent: true
      })
    } catch (error) {
      console.error("Error loading canvas:", error)
      setCanvasData({
        elements: [],
        appState: {
          collaborators: [],
          viewBackgroundColor: '#ffffff'
        },
        files: {},
        scrollToContent: true
      })
    }
  }
  fetchCanvas()
}, [canvasId])

  // Save handler
  const handleSave = useCallback(async (elements, appState) => {
    setIsSaving(true)
    const updateData = {
      data: { elements, appState },
      title: title
    }
    await apiClient(
      `http://localhost:8000/canvas/${canvasId}/update/`,
      'PUT',
      updateData
    )
    setIsSaving(false)
  }, [canvasId, title])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex flex-wrap items-center justify-center gap-3 sm:justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-medium px-2 py-1 border rounded"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/canvaslist')}
            className="px-4 py-2 border rounded"
          >
            Back to List
          </button>
          {isSaving && (
            <span className="px-4 py-2 text-gray-500">Saving...</span>
          )}
        </div>
      </div>

      {/* Excalidraw Canvas */}
      <div className="flex-1 h-full">
        {canvasData && (
          <Excalidraw
            initialData={canvasData}
            onChange={handleSave}
          />
        )}
      </div>
    </div>
  )
}