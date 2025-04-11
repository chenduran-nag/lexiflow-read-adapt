
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onTextSubmit }) => {
  const [text, setText] = useState('');
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text);
    } else {
      toast({
        title: "Empty Text",
        description: "Please enter some text to read.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .txt file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been loaded.`,
      });
    };
    reader.readAsText(file);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast({
        title: "Text Pasted",
        description: "Clipboard content has been pasted.",
      });
    } catch (err) {
      toast({
        title: "Paste Failed",
        description: "Unable to access clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Input Text</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload text file"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt"
            className="hidden"
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePaste}
            aria-label="Paste from clipboard"
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Paste
          </Button>
        </div>
      </div>
      
      <Textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Type or paste text here..."
        className="min-h-[200px] p-4"
      />
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!text.trim()}>
          <FileText className="h-4 w-4 mr-2" />
          Read Text
        </Button>
      </div>
    </div>
  );
};

export default TextInput;
