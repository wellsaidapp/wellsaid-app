import { CheckCircle, Bookmark, X, XCircle, Info } from 'lucide-react';

const ToastMessage = ({ type, title, message, onDismiss }) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      buttonColor: 'text-green-400 hover:text-green-600'
    },
    draft: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <Bookmark className="w-5 h-5 text-yellow-600 flex-shrink-0" />,
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      buttonColor: 'text-yellow-400 hover:text-yellow-600'
    },
    publish: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />,
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      buttonColor: 'text-blue-400 hover:text-blue-600'
    },
    cancel: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: <Info className="w-5 h-5 text-gray-500 flex-shrink-0" />,
      titleColor: 'text-gray-800',
      messageColor: 'text-gray-700',
      buttonColor: 'text-gray-400 hover:text-gray-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      buttonColor: 'text-red-400 hover:text-red-600'
    }
  };

  const style = styles[type] || styles.success;

  return (
    <div className={`
      p-4 rounded-lg border shadow-sm
      ${style.bg} ${style.border}
      min-w-0 w-full max-w-md
    `}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${style.titleColor} text-sm`}>
            {title}
          </div>
          <p className={`text-sm mt-1 ${style.messageColor} break-words`}>
            {message}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className={`${style.buttonColor} transition-colors flex-shrink-0 ml-2`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastMessage;
