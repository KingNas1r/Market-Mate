import { Package2, Bell, User, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Header() {
  const [language, setLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", flag: "🇳🇬" },
    { code: "yo", name: "Yoruba", flag: "🗣️" },
    { code: "pcm", name: "Pidgin", flag: "💬" },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <Package2 className="text-white text-lg" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-medium text-gray-900">Market Mate</h1>
              <p className="text-xs text-gray-500">
                Nigerian Business Solutions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="text-gray-500" size={16} />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="text-gray-600" size={20} />
            </button>
            <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
              <User className="text-white" size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
