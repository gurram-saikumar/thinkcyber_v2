import React from 'react'
import { 
    Heading1, 
    Heading2, 
    Heading3, 
    Bold, 
    Italic, 
    Strikethrough, 
    AlignLeft, 
    AlignCenter, 
    AlignRight, 
    List, 
    ListOrdered, 
    Highlighter, 
} from "lucide-react"
import { Toggle } from '@/components/ui/toggle';
import { Editor } from '@tiptap/react';

export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null
    }

    const Options = [
        {
            icon: <Heading1 className="size-4" />,
            onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            icon: <Heading2 className="size-4" />,
            onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            icon: <Heading3 className="size-4" />,
            onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            icon: <Bold className="size-4" />,
            onclick: () => editor.chain().focus().toggleBold().run(),
            preesed: editor.isActive("bold")
        },
        {
            icon: <Italic className="size-4" />,
            onclick: () => editor.chain().focus().toggleItalic().run(),
            preesed: editor.isActive("italic")
        },
        {
            icon: <Strikethrough className="size-4" />,
            onclick: () => editor.chain().focus().toggleStrike().run(),
            preesed: editor.isActive("strike")
        },
        {
            icon: <AlignLeft className="size-4" />,
            onclick: () => editor.chain().focus().setTextAlign("left").run(),
            preesed: editor.isActive("left")
        },
        {
            icon: <AlignCenter className="size-4" />,
            onclick: () => editor.chain().focus().setTextAlign("center").run(),
            preesed: editor.isActive("center")
        },
        {
            icon: <AlignRight className="size-4" />,
            onclick: () => editor.chain().focus().setTextAlign("right").run(),
            preesed: editor.isActive("right")
        },
        {
            icon: <List className="size-4" />,
            onclick: () => editor.chain().focus().toggleBulletList().run(),
            preesed: editor.isActive("bulletList")
        },
        {
            icon: <ListOrdered className="size-4" />,
            onclick: () => editor.chain().focus().toggleOrderedList().run(),
            preesed: editor.isActive("orderedList")
        },
        {
            icon: <Highlighter className="size-4" />,
            onclick: () => editor.chain().focus().toggleHighlight().run(),
            preesed: editor.isActive("highlight")
        },

    ];

    return (
        <div className='
        border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50'>
            {Options.map((option, index) => (
                <Toggle 
  key={index} 
  onClick={option.onclick} 
  pressed={option.preesed ?? false}
>
  {option.icon}
</Toggle>

            ))}
        </div>
    )
};


