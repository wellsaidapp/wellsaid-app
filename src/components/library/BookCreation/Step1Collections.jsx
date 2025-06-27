
import React from 'react';
import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox, Trash2, Save, GripVertical, Bookmark, CheckCircle,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download, ImageIcon,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';

const Step1Collections = ({ newBook, setNewBook, SYSTEM_COLLECTIONS, collections, groupedEntries }) => {
  const toggleCollection = (collectionId) => {
    setNewBook(prev => ({
      ...prev,
      selectedCollections: prev.selectedCollections.includes(collectionId)
        ? prev.selectedCollections.filter(id => id !== collectionId)
        : [...prev.selectedCollections, collectionId]
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Which collections would you like to include?</h3>
      <p className="text-sm text-gray-600 mb-6">Select one or more collections to pull insights from.</p>

      <div className="space-y-3">
        {[...SYSTEM_COLLECTIONS, ...collections].filter(c => groupedEntries[c.id]?.length > 0).map(collection => (
          <div
            key={collection.id}
            onClick={() => toggleCollection(collection.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              newBook.selectedCollections.includes(collection.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 ${collection.color} rounded-md flex items-center justify-center mr-3`}>
                {collection.type === 'occasion' ? (
                  <Calendar className="w-4 h-4 text-white" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{collection.name}</h4>
                <p className="text-xs text-gray-500">
                  {groupedEntries[collection.id]?.length || 0} insights
                </p>
              </div>
              <div className="ml-auto">
                <Check
                  checked={newBook.selectedCollections.includes(collection.id)}
                  onChange={() => toggleCollection(collection.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1Collections;
