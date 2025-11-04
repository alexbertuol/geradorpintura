import React, { useState, useEffect, useCallback } from 'react';
import type { ProcessedImage } from './types';
import { generateColoringPage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ArrowPathIcon } from './components/icons/ArrowPathIcon';


const App: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(0, 10);
      // FIX: Explicitly type the 'file' parameter as 'File' to resolve type inference issues.
      const processedFiles: ProcessedImage[] = files.map((file: File) => ({
        id: `${file.name}-${Date.now()}`,
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        generatedUrl: null,
        status: 'pending',
      }));
      setImages(processedFiles);
    }
  };

  const processImage = useCallback(async (image: ProcessedImage) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === image.id ? { ...img, status: 'processing' } : img
      )
    );

    try {
      const base64Data = await fileToBase64(image.originalFile);
      const generatedImageBase64 = await generateColoringPage(base64Data, image.originalFile.type);
      
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === image.id
            ? { ...img, status: 'completed', generatedUrl: `data:image/png;base64,${generatedImageBase64}` }
            : img
        )
      );
    } catch (error) {
      console.error('Error processing image:', error);
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === image.id
            ? { ...img, status: 'error', error: 'Falha ao gerar a imagem.' }
            : img
        )
      );
    } finally {
        setCurrentProcessingIndex((prevIndex) => prevIndex + 1);
    }
  }, []);

  useEffect(() => {
    if (isProcessing && currentProcessingIndex < images.length) {
      const imageToProcess = images[currentProcessingIndex];
      processImage(imageToProcess);
    } else if (isProcessing && currentProcessingIndex >= images.length) {
      setIsProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, currentProcessingIndex, images]);

  const handleStartConversion = () => {
    if (images.some(img => img.status === 'pending')) {
        setIsProcessing(true);
        setCurrentProcessingIndex(0);
    }
  };

  const handleReset = () => {
    images.forEach(image => URL.revokeObjectURL(image.originalUrl));
    setImages([]);
    setIsProcessing(false);
    setCurrentProcessingIndex(0);
  };
  
  const canStart = images.length > 0 && !isProcessing;
  const isFinished = images.length > 0 && !isProcessing && currentProcessingIndex >= images.length;


  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                Criador de Páginas para Colorir
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Envie até 10 fotos e veja a IA transformá-las em lindas páginas prontas para colorir.
            </p>
        </header>

        <main>
          {images.length === 0 ? (
            <ImageUploader onChange={handleFileChange} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {images.map((image) => (
                  <ResultCard key={image.id} image={image} />
                ))}
              </div>
              
              <div className="mt-8 flex space-x-4">
                <button
                    onClick={handleStartConversion}
                    disabled={!canStart}
                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-transform transform hover:scale-105"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Convertendo...' : 'Iniciar Conversão'}
                </button>
                {(isFinished || images.length > 0) && (
                    <button
                        onClick={handleReset}
                        className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform transform hover:scale-105"
                    >
                       <ArrowPathIcon className="w-5 h-5 mr-2" />
                        Começar de Novo
                    </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;