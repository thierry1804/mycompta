// Composant de confirmation modal réutilisable
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    details?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'warning';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    details,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'default',
    isLoading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    const variantStyles = {
        default: 'bg-blue-600 hover:bg-blue-700',
        destructive: 'bg-red-600 hover:bg-red-700',
        warning: 'bg-orange-600 hover:bg-orange-700',
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        {variant === 'warning' && (
                            <div className="flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {message}
                    </p>
                    {details && (
                        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            {details}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="min-w-[100px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={cn(
                            'min-w-[100px] text-white',
                            variantStyles[variant]
                        )}
                    >
                        {isLoading ? 'Traitement...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

