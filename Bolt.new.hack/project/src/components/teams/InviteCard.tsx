import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface InviteCardProps {
  inviteCode: string;
}

const InviteCard: React.FC<InviteCardProps> = ({ inviteCode }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Invite Members</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Share this invite code with others to invite them to your team:
        </p>
        
        <div className="flex items-center space-x-2 mb-4">
          <Input
            value={inviteCode}
            readOnly
            className="font-mono"
          />
          <Button
            variant="outline"
            onClick={handleCopyInviteCode}
            leftIcon={copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        
        <p className="text-sm text-gray-600">
          They can join your team by entering this code on the "Join Team" page.
        </p>
      </CardContent>
    </Card>
  );
};

export default InviteCard;