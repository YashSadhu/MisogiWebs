import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface InviteCodeGeneratorProps {
  code: string;
}

const InviteCodeGenerator = ({ code }: InviteCodeGeneratorProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Invite code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy invite code');
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Team Invite Code</h4>
      <div className="flex gap-2">
        <Input
          value={code}
          readOnly
          className="font-mono text-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className="shrink-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InviteCodeGenerator; 