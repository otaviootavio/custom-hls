import { ContractDeploymentProps } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export const ContractDeployment: React.FC<ContractDeploymentProps> = ({
  channelData,
  vendorInfoFetched,
  onDeployContract
}) => (
  <div className="space-y-4 pt-4 border-t">
    <h3 className="font-medium">3. Deploy Contract</h3>
    <Button 
      onClick={onDeployContract}
      disabled={!vendorInfoFetched || !channelData.numHashes}
    >
      Deploy Smart Contract
    </Button>
    
    {channelData.contractAddress && (
      <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-sm">
          Contract deployed at: {channelData.contractAddress}
        </p>
      </div>
    )}
  </div>
);