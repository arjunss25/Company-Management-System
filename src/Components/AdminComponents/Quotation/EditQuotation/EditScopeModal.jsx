import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
} from 'react-icons/fa';

const EditScopeModal = ({ isOpen, onClose, onAdd }) => {
  const [editorState, setEditorState] = useState({
    bold: false,
    italic: false,
    underline: false,
    orderedList: false,
    unorderedList: false,
  });

  const [description, setDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState('Option 1');

  if (!isOpen) return null;

  const handleFormat = (command) => {
    const editor = document.getElementById('scope-editor');

    if (!editor) {
      console.error('Editor element not found');
      return;
    }

    editor.focus();

    if (command === 'orderedList' || command === 'unorderedList') {
      const currentContent = editor.innerHTML.trim();
      const listTag = command === 'orderedList' ? 'ol' : 'ul';
      const listStyle = command === 'orderedList' ? 'decimal' : 'disc';

      const listHtml = `
        <${listTag} style="list-style-type: ${listStyle}; margin-left: 20px;">
          <li></li>
        </${listTag}>
      `;

      if (
        !currentContent ||
        currentContent === '<p></p>' ||
        currentContent === '<br>'
      ) {
        editor.innerHTML = listHtml;
      } else {
        const wrappedContent = `
          <${listTag} style="list-style-type: ${listStyle}; margin-left: 20px;">
            <li>${currentContent}</li>
          </${listTag}>
        `;
        editor.innerHTML = wrappedContent;
      }

      setEditorState((prev) => ({
        ...prev,
        [command]: true,
        orderedList: command === 'orderedList',
        unorderedList: command === 'unorderedList',
      }));
    } else {
      document.execCommand(command, false, null);
      setEditorState((prev) => ({
        ...prev,
        [command]: !prev[command],
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const listItem = range.startContainer.closest('li');

      if (listItem && listItem.textContent.trim() === '') {
        e.preventDefault();
        const list = listItem.parentElement;
        const parentList = list.parentElement;
        list.removeChild(listItem);

        if (list.children.length === 0) {
          parentList.removeChild(list);
          const p = document.createElement('p');
          p.appendChild(document.createElement('br'));
          editor.appendChild(p);

          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);

          setEditorState((prev) => ({
            ...prev,
            orderedList: false,
            unorderedList: false,
          }));
        }
      }
    }
  };

  const handleSelect = (e) => {
    const format = e.target.value;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    document.execCommand('formatBlock', false, format);
    selection.removeAllRanges();
    selection.addRange(range);
    const editor = document.getElementById('scope-editor');
    setDescription(editor.innerHTML);
  };

  const handleEditorChange = (e) => {
    setDescription(e.currentTarget.innerHTML);
  };

  const editorStyles = {
    minHeight: '120px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    outline: 'none',
    listStylePosition: 'inside',
  };

  const handleSubmit = () => {
    const scopeData = {
      description,
      selectedOption,
    };
    onAdd(scopeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 w-full">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">Add Scope</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Options dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </select>
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Scope Description
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                  <select
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleSelect}
                    defaultValue="p"
                  >
                    <option value="p">Normal</option>
                    <option value="h1">Heading 1</option>
                  </select>
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  <button
                    className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                      editorState.bold ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleFormat('bold')}
                    type="button"
                  >
                    <FaBold className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                      editorState.italic ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleFormat('italic')}
                    type="button"
                  >
                    <FaItalic className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                      editorState.underline ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleFormat('underline')}
                    type="button"
                  >
                    <FaUnderline className="w-4 h-4" />
                  </button>
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  <button
                    className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                      editorState.unorderedList ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleFormat('unorderedList')}
                    type="button"
                  >
                    <FaListUl className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 ${
                      editorState.orderedList ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleFormat('orderedList')}
                    type="button"
                  >
                    <FaListOl className="w-4 h-4" />
                  </button>
                </div>

                {/* Editor Area */}
                <div
                  id="scope-editor"
                  contentEditable="true"
                  className="w-full focus:outline-none"
                  style={editorStyles}
                  onInput={handleEditorChange}
                  onKeyDown={handleKeyDown}
                  suppressContentEditableWarning={true}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Scope
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScopeModal;
