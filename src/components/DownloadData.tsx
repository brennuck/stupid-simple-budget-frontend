import { useState } from "react";
import { Loader2, PlusCircle, Upload } from "lucide-react";

export default function DownloadData({
    onDownloadPress,
    onUploadPress,
}: {
    onDownloadPress: () => void;
    onUploadPress: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div className="flex justify-between">
            <button
                className={`flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                disabled={isLoading}
                onClick={() => {
                    setIsLoading(true);
                    onDownloadPress();
                    setIsLoading(false);
                }}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <PlusCircle className="w-4 h-4 mr-2" />
                )}
                Download Data
            </button>
            <button
                className={`flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                disabled={isUploading}
                onClick={() => {
                    setIsUploading(true);
                    onUploadPress();
                    setIsUploading(false);
                }}
            >
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload Data
            </button>
        </div>
    );
}
