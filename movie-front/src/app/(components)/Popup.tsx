import React from "react";
import { useTranslation } from "react-i18next";

interface PopupProps {
  message: string;
  status: boolean;
  clearFunction: () => void;
  event?: string;
}

const Popup: React.FC<PopupProps> = ({
  message,
  status,
  clearFunction,
  event,
}) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <h2
          className={`text-xl font-semibold mb-4 ${
            status ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </h2>
        {event && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Event:</h3>
            <p>{event}</p>
          </div>
        )}
        <button
          onClick={clearFunction}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
};

export default Popup;
