import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  Trash2, 
  RotateCw, 
  ZoomIn, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { compressImageToDataUrl } from '../../utils/imageCompressor';

interface ProfilePhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  collaboratorName: string;
  onSavePhoto: (newPhotoUrl: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
];

export const ProfilePhotoEditModal: React.FC<ProfilePhotoEditModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  collaboratorName,
  onSavePhoto
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhotoUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('A imagem selecionada é muito grande. O tamanho máximo permitido é 15MB.');
      return;
    }

    try {
      const compressed = await compressImageToDataUrl(file, 320, 320, 0.85);
      setPreviewUrl(compressed);
      setZoomLevel(1);
    } catch (err) {
      console.error('Erro ao comprimir imagem:', err);
      setErrorMessage('Erro ao processar o arquivo de imagem.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    onSavePhoto(previewUrl);
    onClose();
  };

  const handleRemovePhoto = () => {
    setPreviewUrl('');
    setErrorMessage(null);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setPreviewUrl(customUrlInput.trim());
    setCustomUrlInput('');
    setIsUrlMode(false);
  };

  const initials = collaboratorName
    ? collaboratorName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'CP';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Personalizar Foto de Perfil</h3>
              <p className="text-[11px] text-slate-500">{collaboratorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Preview & Drop Zone Area */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Live Avatar Preview */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative group">
                <div 
                  className="w-32 h-32 rounded-2xl border-4 border-slate-100 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center relative transition-all"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Prévia do perfil" 
                      className="w-full h-full object-cover transition-transform duration-200"
                      style={{ transform: `scale(${zoomLevel})` }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-slate-500 bg-slate-200">
                      {initials}
                    </div>
                  )}

                  {/* Drag overlay on top of avatar */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-600/80 text-white flex flex-col items-center justify-center text-center p-2 text-[11px] font-semibold animate-pulse">
                      <UploadCloud className="w-6 h-6 mb-1" />
                      Solte a foto aqui
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-all cursor-pointer"
                    title="Remover foto atual"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-[11px] font-medium text-slate-500">
                Visualização no Sistema
              </span>
            </div>

            {/* Drop Zone Box */}
            <div className="flex-1 w-full">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[130px] ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <UploadCloud className={`w-8 h-8 mb-2 transition-colors ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
                <p className="text-xs font-semibold text-slate-800">
                  {isDragging ? 'Solte a imagem para carregar' : 'Arraste e solte uma imagem aqui'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  ou <span className="text-blue-600 font-semibold underline">procure no seu computador</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP até 10MB</p>
              </div>

              {previewUrl && (
                <div className="mt-3 flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <ZoomIn className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-600 shrink-0">Zoom:</span>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.05"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">{Math.round(zoomLevel * 100)}%</span>
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Preset Avatars */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Ou escolha uma foto de catálogo rápido:
              </span>
              <button
                type="button"
                onClick={() => setIsUrlMode(!isUrlMode)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <LinkIcon className="w-3 h-3" />
                {isUrlMode ? 'Ocultar URL' : 'Inserir link URL'}
              </button>
            </div>

            {isUrlMode && (
              <div className="flex items-center gap-2 pt-1 pb-2">
                <input
                  type="url"
                  placeholder="Cole o endereço HTTPS da imagem..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_AVATARS.map((url, idx) => {
                const isSelected = previewUrl === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(url);
                      setZoomLevel(1);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                        : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={url} 
                      alt={`Preset ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Armazenamento Seguro:</strong> As alterações são gravadas permanentemente no seu navegador e não são perdidas com inatividade ou recarregamento.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remover foto
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              Salvar Foto de Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
