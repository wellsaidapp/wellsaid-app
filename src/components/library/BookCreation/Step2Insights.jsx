
import React from 'react';
import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox, Trash2, Save, GripVertical, Bookmark, CheckCircle,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download, ImageIcon,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';

const Step2Insights = ({ newBook, setNewBook, insights, setEntryOrder, groupedEntries }) => { 
  const allEntries = newBook.selectedCollections.flatMap(collectionId =>
    groupedEntries[collectionId] || []
  );

  // Remove duplicates
  const uniqueEntries = allEntries.filter(
    (entry, index, self) => index === self.findIndex(e => e.id === entry.id)
  );

  const toggleEntry = (entryId) => {
    setNewBook(prev => ({
      ...prev,
      selectedEntries: prev.selectedEntries.includes(entryId)
        ? prev.selectedEntries.filter(id => id !== entryId)
        : [...prev.selectedEntries, entryId]
    }));

    // Initialize entry order when first selecting entries
  if (!newBook.selectedEntries.includes(entryId)) {
      setEntryOrder(prev => [...prev, entryId]);
    } else {
      setEntryOrder(prev => prev.filter(id => id !== entryId));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select insights to include</h3>
      <p className="text-sm text-gray-600 mb-6">
        {newBook.selectedEntries.length} of {uniqueEntries.length} insights selected
      </p>

      <div className="space-y-4">
        {uniqueEntries.map(entry => (
          <div
            key={entry.id}
            onClick={() => toggleEntry(entry.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              newBook.selectedEntries.includes(entry.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Check
                  checked={newBook.selectedEntries.includes(entry.id)}
                  onChange={() => toggleEntry(entry.id)}
                />
              </div>
              <div className="flex-1">
                {entry.question && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Question</div>
                    <p className="text-sm text-gray-800">{entry.question}</p>
                  </div>
                )}
                <div>
                  <div className="text-xs font-medium text-green-600 uppercase tracking-wider mb-1">Answer</div>
                  <p className="text-sm text-gray-800">
                    {entry.text || entry.content || "No content yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2Insights;
