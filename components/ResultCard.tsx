import React from 'react';
import type { ProcessedImage } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultCardProps {
  image: ProcessedImage;
}

const Loader: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const StatusOverlay: React.FC<{ status: ProcessedImage['status']; error?: string }> = ({ status, error }) => {
    if (status === 'completed') return null;

    let content;
    switch (status) {
        case 'processing':
            content = <Loader />;
            break;
        case 'error':
            content = (
                <div className="text-center text-red-500">
                    <p className="font-bold">Erro</p>
                    <p className="text-sm">{error || 'Ocorreu um erro desconhecido'}</p>
                </div>
            );
            break;
        case 'pending':
            content = <p className="text-gray-500 dark:text-gray-400">Aguardando...</p>;
            break;
        default:
            content = null;
    }

    return (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center rounded-lg">
            {content}
        </div>
    );
};


export const ResultCard: React.FC<ResultCardProps> = ({ image }) => {

    const handleDownload = () => {
        if (!image.generatedUrl) return;
        const link = document.createElement('a');
        link.href = image.generatedUrl;
        
        const fileName = image.originalFile.name;
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        link.download = `${nameWithoutExt}-para-colorir.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="grid grid-cols-2">
        <div>
          <p className="text-center font-semibold p-2 bg-gray-100 dark:bg-gray-700 text-sm">Original</p>
          <img src={image.originalUrl} alt="Original upload" className="w-full h-48 object-cover" />
        </div>
        <div className="relative">
          <p className="text-center font-semibold p-2 bg-gray-100 dark:bg-gray-700 text-sm">Página para Colorir</p>
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-700">
            {image.generatedUrl ? (
                <img src={image.generatedUrl} alt="Generated coloring page" className="w-full h-full object-cover"/>
            ): (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-900"></div>
            )}
            <StatusOverlay status={image.status} error={image.error} />
          </div>
        </div>
      </div>
      {image.status === 'completed' && image.generatedUrl && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50">
            <button onClick={handleDownload} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                <DownloadIcon className="w-4 h-4 mr-2"/>
                Baixar
            </button>
        </div>
      )}
    </div>
  );
};