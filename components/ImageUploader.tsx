import React from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <label
        htmlFor="file-upload"
        className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
      >
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
          Enviar imagens
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Selecione até 10 imagens (PNG, JPG, etc.)
        </p>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={onChange}
        />
      </label>
    </div>
  );
};